package exception;

import javax.ejb.ApplicationException;
import javax.ws.rs.WebApplicationException;

@ApplicationException
public class UserAlreadyExistsException extends WebApplicationException {

	private static final long serialVersionUID = 1L;

}
