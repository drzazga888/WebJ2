package exceptionMapper;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import bean.ErrorMessage;
import exception.NotAuthorizedException;

/**
 * Used to map NotAuthorizedException to the UNAUTHORIZED response
 * @author kdrzazga
 *
 */
@Provider
public class BadCredentialsMapper implements ExceptionMapper<NotAuthorizedException> {
	
	private final static String BAD_CREDENTIALS_DESCRIPTION = "Bad login or password";

	/**
	 * Returns UNAUTHORIZED with WWW-Authenticate header
	 */
	@Override
	public Response toResponse(NotAuthorizedException e) {
		return Response
				.status(Status.UNAUTHORIZED)
				.entity(new ErrorMessage(BAD_CREDENTIALS_DESCRIPTION))
				.type(MediaType.APPLICATION_JSON)
				.header("WWW-Authenticate", "Basic realm=\"User Realm\"")
				.build();
	}

}
