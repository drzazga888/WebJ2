package aspects;

import javax.ws.rs.core.Response;

public aspect CorsFilter {
	
	after() returning(Response response): execution(public Response controller.*.*(..)) {
		response.getHeaders().add("Access-Control-Allow-Origin", "*");
		response.getHeaders().add("Access-Control-Allow-Headers", "Authorization, Content-Type");
		response.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
	}

}
