package exception;

import javax.ws.rs.WebApplicationException;

public class BadParameterException extends WebApplicationException {

	public BadParameterException(String message) {
		super(message);
	}

	private static final long serialVersionUID = 1L;

}
