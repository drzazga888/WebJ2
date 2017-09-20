package exception;

import javax.ejb.ApplicationException;
import javax.ws.rs.WebApplicationException;

/**
 * Exception that could be thrown when entry has unique field that belongs
 * to the other entity
 * @author kdrzazga
 *
 */
@ApplicationException
public class UserAlreadyExistsException extends WebApplicationException {

	private static final long serialVersionUID = 1L;

}
