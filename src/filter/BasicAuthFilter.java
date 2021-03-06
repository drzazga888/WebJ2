package filter;

import java.util.Base64;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.ws.rs.HttpMethod;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import bean.Credentials;
import bean.User;
import exception.NotAuthorizedException;
import util.BCrypt;

/**
 * This is the authentication filer.
 * It's used via JAX-RS to provide SecurityContext
 * or to throw NotAuthorizedException (when path is secured).
 * @author kdrzazga
 *
 */
@Provider
@PreMatching
public class BasicAuthFilter implements ContainerRequestFilter {
		    	
	private final static String AUTH_HEADER_KEY = "Authorization";
	private final static Pattern AUTH_HEADER_PATTERN = Pattern.compile("^Basic (.+)$");
	
	@Inject
	private EntityManagerProvider entityManagerProvider;
	
	/**
	 * Default constructor
	 */
    public BasicAuthFilter() {
    }

	private Credentials getCredentialsFromRequest(ContainerRequestContext request) {
		String authHeader = request.getHeaderString(AUTH_HEADER_KEY);
		if (authHeader != null) {
			Matcher m = AUTH_HEADER_PATTERN.matcher(authHeader);
			if (m.find()) {
				String matched = m.group(1);
				String decoded = new String(Base64.getDecoder().decode(matched));
				StringTokenizer tokenizer = new StringTokenizer(decoded, ":");
				if (tokenizer.countTokens() == 2) {
					return new Credentials(tokenizer.nextToken(), tokenizer.nextToken());
				}
			}
		}
		return null;
	}
	
	/**
	 * Main filter body that sets security context to
	 * the request or throws NotAuthorizedException
	 */
	@Override
	public void filter(ContainerRequestContext request) {
		if (request.getMethod() == HttpMethod.OPTIONS) {
			request.abortWith(Response.ok().build());
		} else if (!request.getUriInfo().getPath().contains("users") || request.getMethod() != HttpMethod.POST) {
			Credentials requestCredentials = getCredentialsFromRequest(request);
			if (requestCredentials == null) {
				throw new NotAuthorizedException();
			}
			User user;
			try {
				EntityManager em = entityManagerProvider.get();
				user = (User) em.createNamedQuery("User.getByEmail")
						.setParameter("email", requestCredentials.getEmail())
						.getSingleResult();
			} catch(NoResultException e) {
				user = null;
			}
			if (user == null || !BCrypt.checkpw(requestCredentials.getPassword(), user.getPassword())) {
				throw new NotAuthorizedException();
			}
			request.setSecurityContext(new BasicSecurityContext(user, request.getUriInfo().getRequestUri().getScheme()));
		}
	}

}
