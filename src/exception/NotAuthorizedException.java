package exception;

import javax.ejb.ApplicationException;
import javax.ws.rs.WebApplicationException;

/**
 * Exceptions that could be thrown when credentials are bad
 * and route is restricted
 * @author kdrzazga
 *
 */
@ApplicationException
public class NotAuthorizedException extends WebApplicationException {

	private static final long serialVersionUID = 1L;

}
