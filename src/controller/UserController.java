package controller;

import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.SecurityContext;

import bean.Audio;
import bean.Project;
import bean.Sample;
import bean.SuccessMessage;
import bean.Track;
import bean.User;
import exception.UserAlreadyExistsException;
import filter.BasicSecurityContext;
import util.BCrypt;

/**
 * REST endpoints concerning user profile
 * @author kdrzazga
 *
 */
@Path("users")
@Stateless
public class UserController {
	
	private static final String USER_DELETED_MESSAGE = "user was successfully deleted";
	private static final String USER_CREATED_MESSAGE = "user was successfully created";
	
	private static final SuccessMessage USER_DELETED_PAYLOAD = new SuccessMessage(USER_DELETED_MESSAGE);
	private static final SuccessMessage USER_UPDATED_PAYLOAD = new SuccessMessage(USER_CREATED_MESSAGE);
	
	@PersistenceContext(name = "WebJ2")
	private EntityManager em;
	
	/**
	 * Returns user details, it could be user as a sign-in request
	 * @param securityContext Security context with authenticated user
	 * @return User details
	 */
	@GET
	@Path("me")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUser(@Context SecurityContext securityContext) {
		User user = (User) ((BasicSecurityContext) securityContext).getUser();
		return Response.ok(user.prepareForResponse()).build();
	}
	
	/**
	 * Not restricted endpoint that produces new user.
	 * @param user User data from the request form
	 * @return Action status
	 */
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createUser(User user) {
		user.sanitize();
		user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
		if (em.createNamedQuery("User.getByEmail").setParameter("email", user.getEmail()).getResultList().size() > 0) {
			throw new UserAlreadyExistsException();
		}
		em.persist(user);
		return Response.status(Status.CREATED).entity(new SuccessMessage(USER_CREATED_MESSAGE)).build();
	}
	
	/**
	 * Updated user data
	 * @param user User data from the request form
	 * @param securityContext Security context with authenticated user
	 * @return Action status
	 */
	@PUT
	@Path("me")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUser(User user, @Context SecurityContext securityContext) {
		User existingUser = (User) ((BasicSecurityContext) securityContext).getUser();
		user.setId(existingUser.getId());
		user.sanitize();
		user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
		List<User> usersByEmail = em.createNamedQuery("User.getByEmail", User.class).setParameter("email", user.getEmail()).getResultList();
		if (usersByEmail.size() > 0 && usersByEmail.get(0).getId() != existingUser.getId()) {
			throw new UserAlreadyExistsException();
		}
		if (!em.contains(user)) {
		    user = em.merge(user);
		}
		return Response.ok(USER_UPDATED_PAYLOAD).build();
	}
	
	/**
	 * Removes user from the application
	 * @param securityContext Security context with authenticated user
	 * @return Action status
	 */
	@DELETE
	@Path("me")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUser(@Context SecurityContext securityContext) {
		User user = (User) ((BasicSecurityContext) securityContext).getUser();
		List<Audio> audios = em.createNamedQuery("Audio.getByUser", Audio.class).setParameter("id", user.getId()).getResultList();
		List<Project> projects = em.createNamedQuery("Project.getByUser", Project.class).setParameter("id", user.getId()).getResultList();
		for (Project project : projects) {
			for (Track track : project.getTracks()) {
				for (Sample sample : track.getSamples()) {
					if (!em.contains(sample)) {
						em.merge(sample);
					}
					em.remove(sample);
				}
				if (!em.contains(track)) {
					em.merge(track);
				}
				em.remove(track);
			}
			project.deleteAudioFile();
			if (!em.contains(project)) {
				em.merge(project);
			}
			em.remove(project);
		}
		em.flush();
		for (Audio audio : audios) {
			audio.deleteAudioFile();
			if (!em.contains(audio)) {
				em.merge(audio);
			}
			em.remove(audio);
		}
		if (!em.contains(user)) {
		    user = em.merge(user);
		}
		em.remove(user);
		return Response.ok(USER_DELETED_PAYLOAD).build();
	}

}
