package api;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.servlet.http.HttpServletRequest;
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

import org.mindrot.jbcrypt.BCrypt;

import bean.User;
import exception.UserAlreadyExistsException;
import model.UserModel;

@Path("users")
public class UserController {
	
	@PersistenceContext
	private EntityManager em;
	
	@GET
	@Path("me")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUser(@Context HttpServletRequest request) {
		return Response.ok(request.getAttribute("user")).build();
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createUser(User user) {
		user.sanitize();
		user.setEmail(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
		if (em.createNamedQuery("User.getByEmail").setParameter("email", user.getEmail()).getResultList().size() > 0) {
			throw new UserAlreadyExistsException();
		}
		EntityTransaction trans = em.getTransaction();
		trans.begin();
		em.persist();
		return Response.status(Status.CREATED).build();
	}
	
	@PUT
	@Path("me")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUser(User user, @Context HttpServletRequest request) {
		User existingUser = (User) request.getAttribute("user");
		user.setId(existingUser.getId());
		user.sanitize();
		if (em.createNamedQuery("User.getByEmail").setParameter("email", user.getEmail()).getResultList().size() > 0) {
			throw new UserAlreadyExistsException();
		}
		update(user);
		return Response.status(Status.NO_CONTENT).build();
	}
	
	@DELETE
	@Path("me")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUser(@Context HttpServletRequest request) {
		User existingUser = (User) request.getAttribute("user");
		userModel.deleteUser(existingUser.getId());
		return Response.status(Status.NO_CONTENT).build();
	}

}
