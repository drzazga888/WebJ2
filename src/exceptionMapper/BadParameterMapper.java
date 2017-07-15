package exceptionMapper;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import bean.ErrorMessage;
import exception.BadParameterException;

@Provider
public class BadParameterMapper implements ExceptionMapper<BadParameterException> {

	@Override
	public Response toResponse(BadParameterException e) {
		return Response
				.status(Status.BAD_REQUEST)
				.entity(new ErrorMessage(e.getMessage()))
				.type(MediaType.APPLICATION_JSON)
				.build();
	}

}
