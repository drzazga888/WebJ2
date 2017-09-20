package exception;

import javax.ejb.ApplicationException;
import javax.ws.rs.WebApplicationException;

/**
 * Should be thrown when user extracted from SecurityContext
 * does not match user from requested resource.
 * @author kdrzazga
 *
 */
@ApplicationException
public class UserIsNotOwnerException extends WebApplicationException {

	private static final long serialVersionUID = 1L;

}
