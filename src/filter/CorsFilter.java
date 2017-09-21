package filter;

import java.io.IOException;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.ext.Provider;

/**
 * Adds Cross-Origin Resource Sharing headers to the responses
 * @author kdrzazga
 *
 */
@Provider
public class CorsFilter implements ContainerResponseFilter
{

	/**
	 * Filter implementation of ContainerResponseFilter - adding CORS headers
	 */
	@Override
	public void filter(ContainerRequestContext request, ContainerResponseContext response) throws IOException {
		response.getHeaders().add("Access-Control-Allow-Origin", "*");
		response.getHeaders().add("Access-Control-Allow-Headers", "Authorization, Content-Type");
		response.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
	}

}