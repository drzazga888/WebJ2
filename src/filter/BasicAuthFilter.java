package filter;
import java.io.IOException;
import java.util.Base64;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.InternalServerErrorException;

import org.mindrot.jbcrypt.BCrypt;

import bean.Credentials;
import bean.User;
import model.UserModel;

@WebFilter(filterName = "BasicAuthFilter", urlPatterns = {"/api/*"})
public class BasicAuthFilter implements Filter {
	
	public final static String AUTH_HEADER_KEY = "Authorization";
	public final static Pattern AUTH_HEADER_PATTERN = Pattern.compile("^Basic (.+)$");
	public final static String LOOKUP_APP_NAME = "java:app/AppName";
	public final static String BAD_CREDENTIALS_DESCRIPTION = "Bad login or password";
	

    public BasicAuthFilter() {
    }

	public void destroy() {
	}
	
	private Credentials getCredentialsFromRequest(HttpServletRequest httpRequest) {
		String authHeader = httpRequest.getHeader(AUTH_HEADER_KEY);
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
	
	private boolean isNotProtected(HttpServletRequest httpRequest) {
		try {
			InitialContext context = new InitialContext();
			String appName = (String) context.lookup(LOOKUP_APP_NAME);
			return httpRequest.getRequestURI().startsWith("/" + appName + "/api/user") && httpRequest.getMethod() == "POST";
		} catch (NamingException e) {
			e.printStackTrace();
			throw new InternalServerErrorException();
		}
	}
	
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		if (isNotProtected(httpRequest)) {
			chain.doFilter(request, response);
			return;
		} else {
			UserModel db = new UserModel();
			Credentials requestCredentials = getCredentialsFromRequest(httpRequest);
			User user = db.getUserByEmail(requestCredentials.getEmail());
			if (user != null && BCrypt.checkpw(requestCredentials.getPassword(), user.getPassword())) {
				user.setPassword(null);
				request.setAttribute("user", user);
				chain.doFilter(request, response);
				return;
			}
		}
		HttpServletResponse httpResponse = (HttpServletResponse) response;
		httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, BAD_CREDENTIALS_DESCRIPTION);
	}

	public void init(FilterConfig fConfig) throws ServletException {
	}

}
