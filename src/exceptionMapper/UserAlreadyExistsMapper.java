package exceptionMapper;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;

import bean.ErrorMessage;
import exception.UserAlreadyExistsException;

public class UserAlreadyExistsMapper implements ExceptionMapper<UserAlreadyExistsException> {
	
	public static final String DEFAULT_MESSAGE = "user already exists";

	@Override
	public Response toResponse(UserAlreadyExistsException exception) {
		return Response
				.status(Status.CONFLICT)
				.entity(new ErrorMessage(DEFAULT_MESSAGE))
				.type(MediaType.APPLICATION_JSON)
				.build();
	}

}
