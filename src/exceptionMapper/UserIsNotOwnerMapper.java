package exceptionMapper;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;

import bean.ErrorMessage;
import exception.UserAlreadyExistsException;
import exception.UserIsNotOwnerException;

@SuppressWarnings("unused")
public class UserIsNotOwnerMapper implements ExceptionMapper<UserIsNotOwnerException> {
	
	public static final String DEFAULT_MESSAGE = "you can access only your private resources";

	@Override
	public Response toResponse(UserIsNotOwnerException exception) {
		return Response
				.status(Status.FORBIDDEN)
				.entity(new ErrorMessage(DEFAULT_MESSAGE))
				.type(MediaType.APPLICATION_JSON)
				.build();
	}

}
