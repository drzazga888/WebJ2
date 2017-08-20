package controller;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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

import javax.ws.rs.core.Response.Status;

import bean.Audio;
import bean.SuccessMessage;
import bean.User;
import exception.UserIsNotOwnerException;
import filter.BasicSecurityContext;
import util.RmsPowerOverTime;

@Path("audios")
@Stateless
public class AudioController {
	
	private static final String AUDIO_DELETED_MESSAGE = "audio was successfully deleted";
	private static final String AUDIO_UPDATED_MESSAGE = "audio information was successfully updated";
	private static final String AUDIO_CREATED_MESSAGE = "audio was successfully created";
	
	@PersistenceContext(name = "WebJ2")
	private EntityManager em;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAudioList(@Context SecurityContext securityContext) {
		User user = (User) ((BasicSecurityContext) securityContext).getUser();
		List<Audio> audios = em.createNamedQuery("Audio.getByUser", Audio.class).setParameter("id", user.getId()).getResultList();
		return Response.ok(audios.stream().map(a -> a.prepareForResponse()).collect(Collectors.toList())).build();
	}
	
	@Path("{id}")
	@GET
	@Produces("audio/wav")
	public Response getAudio(@Context SecurityContext securityContext, @PathParam("id") String id) {
		User authUser = (User) ((BasicSecurityContext) securityContext).getUser();
		Audio audio = em.find(Audio.class, Long.parseLong(id));
		if (audio == null) {
			throw new NotFoundException();
		}
		if (audio.getUser().getId() != authUser.getId()) {
			throw new UserIsNotOwnerException();
		}
		File audioFile = new File(audio.audioIdPath());
		return Response.ok(audioFile).header("Content-Disposition", "attachment; filename=\"" + audio.audioAttachmentName() + "\"").build();
	}
	
	@POST 
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createAudio(Audio audio, @Context SecurityContext securityContext) {
		User user = (User) ((BasicSecurityContext) securityContext).getUser();
		audio.sanitize();
		audio.setUser(user);
		audio.saveBase64AudioStringToTempFile();
		RmsPowerOverTime rmsProvider = new RmsPowerOverTime(audio.audioTempPath());
		float[] rms = rmsProvider.generate();
		audio.setAmplitudeOverTime(rms);
		if (!em.contains(audio)) {
			audio = em.merge(audio);
		}
		em.persist(audio);
		em.flush();
		audio.assignIdToTempAudioFile();
		return Response.status(Status.CREATED).entity(new SuccessMessage(AUDIO_CREATED_MESSAGE, audio.getId())).build();
	}
	
	@Path("{id}")
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateAudioInfo(Audio newAudio, @Context SecurityContext securityContext, @PathParam("id") String id) {
		User authUser = (User) ((BasicSecurityContext) securityContext).getUser();
		Audio audio = em.find(Audio.class, Long.parseLong(id));
		if (audio == null) {
			throw new NotFoundException();
		}
		if (audio.getUser().getId() != authUser.getId()) {
			throw new UserIsNotOwnerException();
		}
		if (em.contains(audio)) {
			em.detach(audio);
		} 
		audio.setName(newAudio.getName());
		audio.sanitize();
		audio = em.merge(audio);
		em.persist(audio);
		return Response.ok(new SuccessMessage(AUDIO_UPDATED_MESSAGE)).build();
	}
	
	@Path("{id}")
	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteAudio(@Context SecurityContext securityContext, @PathParam("id") String id) {
		User authUser = (User) ((BasicSecurityContext) securityContext).getUser();
		Audio audio = em.find(Audio.class, Long.parseLong(id));
		if (audio == null) {
			throw new NotFoundException();
		}
		if (audio.getUser().getId() != authUser.getId()) {
			throw new UserIsNotOwnerException();
		}
		if (audio.getAmplitudeOverTime() != null && !audio.deleteAudioFile()) {
			throw new InternalServerErrorException();
		}
		em.remove(audio);
		return Response.ok(new SuccessMessage(AUDIO_DELETED_MESSAGE)).build();
	}

}
