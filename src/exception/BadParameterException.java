package exception;

import javax.ejb.ApplicationException;
import javax.ws.rs.WebApplicationException;

/**
 * Exception that could be thrown when fields in object is not valid
 * @author kdrzazga
 *
 */
@ApplicationException
public class BadParameterException extends WebApplicationException {

	/**
	 * Constructor
	 * @param message Error message
	 */
	public BadParameterException(String message) {
		super(message);
	}

	private static final long serialVersionUID = 1L;

}
