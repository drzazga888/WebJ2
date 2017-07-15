package controller;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import bean.Audio;
import bean.PostMessage;
import bean.User;

@Path("audios")
@Stateless
public class AudioController {
	
	@PersistenceContext(name = "WebJ2")
	private EntityManager em;
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createAudioResource(Audio audio, @Context HttpServletRequest request) {
		User user = (User) request.getAttribute("user");
		audio.sanitize();
		audio.setUser(user);
		if (!em.contains(audio)) {
			audio = em.merge(audio);
		}
		em.persist(audio);
		em.flush();
		return Response.status(Status.CREATED).entity(new PostMessage(audio.getId())).build();
	}

}
