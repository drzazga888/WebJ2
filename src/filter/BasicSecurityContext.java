package filter;

import java.security.Principal;

import javax.ws.rs.core.SecurityContext;

import bean.User;

/**
 * Security context that contains User bean.
 * You can extract user from this context in REST endpoint.
 * @author kdrzazga
 *
 */
public class BasicSecurityContext implements SecurityContext {

	private User user;
	private String scheme;

	/**
	 * Basi constructor
	 * @param user User to be set
	 * @param scheme Scheme of the request (http / https)
	 */
	public BasicSecurityContext(User user, String scheme) {
		this.user = user;
		this.scheme = scheme;
	}
	
	/**
	 * User getter
	 * @return User instance
	 */
	public User getUser() {
		return this.user;
	}

	
	/**
	 * Overrides schema to the BASIC_AUTH
	 */
	@Override
	public String getAuthenticationScheme() {
		return SecurityContext.BASIC_AUTH;
	}

	/**
	 * Simply returns null (no principal used)
	 */
	@Override
	public Principal getUserPrincipal() {
		return null;
	}

	/**
	 * Return true when https schema is used
	 */
	@Override
	public boolean isSecure() {
		return "https".equals(this.scheme);
	}

	/**
	 * Just returns false due to no role used in the app
	 */
	@Override
	public boolean isUserInRole(String arg0) {
		return false;
	}

}
