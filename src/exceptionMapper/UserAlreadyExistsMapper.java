package exceptionMapper;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;

import bean.ErrorMessage;
import exception.UserAlreadyExistsException;

/**
 * Maps UserAlreadyExistsException to the CONFLICT response
 * @author kdrzazga
 *
 */
public class UserAlreadyExistsMapper implements ExceptionMapper<UserAlreadyExistsException> {
	
	public static final String DEFAULT_MESSAGE = "user already exists";

	/**
	 * Returns CONFLICT response
	 */
	@Override
	public Response toResponse(UserAlreadyExistsException exception) {
		return Response
				.status(Status.CONFLICT)
				.entity(new ErrorMessage(DEFAULT_MESSAGE))
				.type(MediaType.APPLICATION_JSON)
				.build();
	}

}
