package aspects;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.SecurityContext;

import bean.User;
import filter.BasicSecurityContext;
import filter.BasicAuthFilter;

/**
 * Aspect that prints to the console which user is authenticated
 * @author kdrzazga
 *
 */
public aspect UserLogger {
	
	pointcut afterUserLogged(ContainerRequestContext request):
		execution(public void BasicAuthFilter.filter(ContainerRequestContext))
		&& args(request);
	
	after(ContainerRequestContext request): afterUserLogged(request) {
		SecurityContext sc = request.getSecurityContext();
		if (sc instanceof BasicSecurityContext) {
			User user = (User) ((BasicSecurityContext) sc).getUser();
			System.out.println("Authenticated user: " + user.getEmail() + ": " + user.getFname() + " " + user.getLname());
		}
	}

}
