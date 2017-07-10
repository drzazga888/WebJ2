package api;

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
import bean.User;
import model.AudioModel;

@Path("audios")
public class AudioController {
	
	private AudioModel audioModel = new AudioModel();
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createSampleResource(Audio audio, @Context HttpServletRequest request) {
		User user = (User) request.getAttribute("user");
		return Response.status(Status.CREATED).entity(audioModel.createNewAudioResource(user, audio)).build();
	}

}
