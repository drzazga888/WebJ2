package api;

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

import bean.User;
import model.UserModel;

@Path("users")
public class UserController {
	
	private UserModel userModel = new UserModel();
	
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
		userModel.createUser(user);
		return Response.status(Status.CREATED).build();
	}
	
	@PUT
	@Path("me")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUser(User userReplacement, @Context HttpServletRequest request) {
		User existingUser = (User) request.getAttribute("user");
		userReplacement.setId(existingUser.getId());
		userReplacement.sanitize();
		userModel.updateUser(userReplacement);
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
