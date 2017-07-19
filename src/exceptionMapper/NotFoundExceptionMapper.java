package exceptionMapper;

import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;

import bean.ErrorMessage;

public class NotFoundExceptionMapper implements ExceptionMapper<NotFoundException> {
	
	public static final String DEFAULT_MESSAGE = "resource cannot be found";

	@Override
	public Response toResponse(NotFoundException exception) {
		return Response
				.status(Status.NOT_FOUND)
				.entity(new ErrorMessage(DEFAULT_MESSAGE))
				.type(MediaType.APPLICATION_JSON)
				.build();
	}

}
