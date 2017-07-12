package exception;

import javax.ejb.ApplicationException;
import javax.ws.rs.WebApplicationException;

@ApplicationException
public class BadParameterException extends WebApplicationException {

	public BadParameterException(String message) {
		super(message);
	}

	private static final long serialVersionUID = 1L;

}
