package api;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.PersistenceContext;
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

@Path("users")
@Stateless
public class UserController {
	
	@PersistenceContext(name = "WebJ2")
	private EntityManager em;
	
	@GET
	@Path("me")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUser(@Context HttpServletRequest request) {
		User user = (User) request.getAttribute("user");
		user.setPassword(null);
		user.setPassword2(null);
		return Response.ok(request.getAttribute("user")).build();
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
		user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
		if (em.createNamedQuery("User.getByEmail").setParameter("email", user.getEmail()).getResultList().size() > 0) {
			throw new UserAlreadyExistsException();
		}
		if (!em.contains(user)) {
		    user = em.merge(user);
		}
		return Response.status(Status.NO_CONTENT).build();
	}
	
	@DELETE
	@Path("me")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUser(@Context HttpServletRequest request) {
		User user = (User) request.getAttribute("user");
		if (!em.contains(user)) {
		    user = em.merge(user);
		}
		em.remove(user);
		return Response.status(Status.NO_CONTENT).build();
	}

}
