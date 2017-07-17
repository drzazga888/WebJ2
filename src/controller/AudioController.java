package controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import javax.activation.DataHandler;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

import com.ibm.websphere.jaxrs20.multipart.IAttachment;
import com.ibm.websphere.jaxrs20.multipart.IMultipartBody;
import javax.ws.rs.core.Response.Status;

import bean.Audio;
import bean.PostMessage;
import bean.User;
import exception.AudioFormatNotSupportedException;
import exception.UserIsNotOwnerException;
import filter.BasicSecurityContext;
import util.RmsPowerOverTime;

@Path("audios")
@Stateless
public class AudioController {
	
	private static final String AUDIO_WAV_MIME_TYPE = "audio/wav";
	
	@PersistenceContext(name = "WebJ2")
	private EntityManager em;
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAllAudios(@Context SecurityContext securityContext) {
		User user = (User) ((BasicSecurityContext) securityContext).getUser();
		List<Audio> audios = em.createNamedQuery("Audio.getAllByUserId", Audio.class).setParameter("id", user.getId()).getResultList();
		for (Audio audio : audios) {
			audio.setUser(null);
		}
		return Response.status(Status.OK).entity(audios).build();
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createAudioResource(Audio audio, @Context SecurityContext securityContext) {
		User user = (User) ((BasicSecurityContext) securityContext).getUser();
		audio.sanitize();
		audio.setUser(user);
		if (!em.contains(audio)) {
			audio = em.merge(audio);
		}
		em.persist(audio);
		em.flush();
		return Response.status(Status.CREATED).entity(new PostMessage(audio.getId())).build();
	}
	
	@Path("{id}")
	@PUT
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public Response replaceAudio(IMultipartBody multipartBody, @Context SecurityContext securityContext, @PathParam("id") String id) {
		User authUser = (User) ((BasicSecurityContext) securityContext).getUser();
		Audio audio = em.find(Audio.class, Long.parseLong(id));
		if (audio == null) {
			throw new NotFoundException();
		}
		if (audio.getUser().getId() != authUser.getId()) {
			throw new UserIsNotOwnerException();
		}
		IAttachment attachment = multipartBody.getRootAttachment();
		if (!attachment.getContentType().toString().equals(AUDIO_WAV_MIME_TYPE)) {
			throw new AudioFormatNotSupportedException();
		}
		String filePath = "./" + id + ".wav";
		try {
			DataHandler dataHandler = attachment.getDataHandler();
			InputStream audioStream = dataHandler.getInputStream();
			Files.copy(audioStream, Paths.get(filePath), StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			e.printStackTrace();
			throw new InternalServerErrorException();
		}
		RmsPowerOverTime rmsProvider = new RmsPowerOverTime(filePath);
		float[] rms = rmsProvider.generate();
		audio.setAmplitudeOverTime(rms);
		em.persist(audio);
		return Response.status(Status.NO_CONTENT).build();
	}

}
