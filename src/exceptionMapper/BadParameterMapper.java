package exceptionMapper;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import bean.ErrorMessage;
import exception.BadParameterException;

/**
 * Maps BadParameterException to the BAD_REQUEST response
 * @author kdrzazga
 *
 */
@Provider
public class BadParameterMapper implements ExceptionMapper<BadParameterException> {

	/**
	 * Returns BAD_REQUEST response with error message provided in the exception
	 */
	@Override
	public Response toResponse(BadParameterException e) {
		return Response
				.status(Status.BAD_REQUEST)
				.entity(new ErrorMessage(e.getMessage()))
				.type(MediaType.APPLICATION_JSON)
				.build();
	}

}
