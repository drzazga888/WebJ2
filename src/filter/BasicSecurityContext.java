package filter;

import java.security.Principal;

import javax.ws.rs.core.SecurityContext;

import bean.User;

public class BasicSecurityContext implements SecurityContext {

	private User user;
	private String scheme;

	public BasicSecurityContext(User user, String scheme) {
		this.user = user;
		this.scheme = scheme;
	}
	
	public User getUser() {
		return this.user;
	}

	@Override
	public String getAuthenticationScheme() {
		return SecurityContext.BASIC_AUTH;
	}

	@Override
	public Principal getUserPrincipal() {
		return null;
	}

	@Override
	public boolean isSecure() {
		return "https".equals(this.scheme);
	}

	@Override
	public boolean isUserInRole(String arg0) {
		return false;
	}

}
