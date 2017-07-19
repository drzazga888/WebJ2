package controller;

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

import bean.SuccessMessage;
import bean.User;
import exception.UserAlreadyExistsException;
import filter.BasicSecurityContext;
import util.BCrypt;

@Path("users")
@Stateless
public class UserController {
	
	@PersistenceContext(name = "WebJ2")
	private EntityManager em;
	
	@GET
	@Path("me")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUser(@Context SecurityContext securityContext) {
		User user = (User) ((BasicSecurityContext) securityContext).getUser();
		user.setPassword(null);
		user.setPassword2(null);
		return Response.ok(user).entity(user).build();
	}
	
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
		return Response.status(Status.CREATED).entity(new SuccessMessage("user was successfully created")).build();
	}
	
	@PUT
	@Path("me")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUser(User user, @Context SecurityContext securityContext) {
		User existingUser = (User) ((BasicSecurityContext) securityContext).getUser();
		user.setId(existingUser.getId());
		user.sanitize();
		user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
		if (em.createNamedQuery("User.getByEmail").setParameter("email", user.getEmail()).getResultList().size() > 0) {
			throw new UserAlreadyExistsException();
		}
		if (!em.contains(user)) {
		    user = em.merge(user);
		}
		return Response.ok(new SuccessMessage("user was successfully updated")).build();
	}
	
	@DELETE
	@Path("me")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUser(@Context SecurityContext securityContext) {
		User user = (User) ((BasicSecurityContext) securityContext).getUser();
		if (!em.contains(user)) {
		    user = em.merge(user);
		}
		em.remove(user);
		return Response.ok(new SuccessMessage("user was successfully deleted")).build();
	}

}
