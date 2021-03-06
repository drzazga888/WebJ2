package controller;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;
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
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

import javax.ws.rs.core.Response.Status;

import bean.Audio;
import bean.AudioPostSuccessMessage;
import bean.Project;
import bean.Sample;
import bean.SuccessMessage;
import bean.Track;
import bean.User;
import exception.UserAlreadyExistsException;
import exception.UserIsNotOwnerException;
import filter.BasicSecurityContext;
import util.AudioInfoExtractor;
import util.PATCH;

/**
 * REST endpoints concerning audio files
 * @author kdrzazga
 *
 */
@Path("audios")
@Stateless
public class AudioController {
	
	private static final String AUDIO_DELETED_MESSAGE = "audio was successfully deleted";
	private static final String AUDIO_UPDATED_MESSAGE = "audio information was successfully updated";
	
	private static final SuccessMessage AUDIO_DELETED_PAYLOAD = new SuccessMessage(AUDIO_DELETED_MESSAGE);
	private static final SuccessMessage AUDIO_UPDATED_PAYLOAD = new SuccessMessage(AUDIO_UPDATED_MESSAGE);
	
	@PersistenceContext(name = "WebJ2")
	private EntityManager em;

	/**
	 * Produces list of the audio entries
	 * @param securityContext Security context with authenticated user
	 * @return Response with the list of audio if there is no errors
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAudioList(@Context SecurityContext securityContext) {
		User user = (User) ((BasicSecurityContext) securityContext).getUser();
		List<Audio> audios = em.createNamedQuery("Audio.getByUser", Audio.class).setParameter("id", user.getId()).getResultList();
		return Response.ok(audios.stream().map(a -> a.prepareForResponse()).collect(Collectors.toList())).build();
	}
	
	/**
	 * Returns .wav audio file represented by provided ID
	 * @param securityContext Security context with authenticated user
	 * @param id ID number of the resource
	 * @return Audio file
	 */
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
	
	/**
	 * Creates audio from form data
	 * @param audio Form data that must be validated
	 * @param securityContext Security context with authenticated user
	 * @return Action status
	 */
	@POST 
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createAudio(Audio audio, @Context SecurityContext securityContext) {
		User user = (User) ((BasicSecurityContext) securityContext).getUser();
		audio.sanitize();
		if (em.createNamedQuery("Project.getByUserAndName").setParameter("id", user.getId()).setParameter("name", audio.getName()).getResultList().size() > 0) {
			throw new UserAlreadyExistsException();
		}
		audio.setUser(user);
		audio.saveBase64AudioStringToTempFile();
		AudioInfoExtractor audioInfoExtractor;
		try {
			audioInfoExtractor = new AudioInfoExtractor(audio.audioTempPath());
		} catch (IOException e) {
			e.printStackTrace();
			throw new InternalServerErrorException();
		}
		audio.setAmplitudeOverTime(audioInfoExtractor.getRmsOverTime());
		audio.setLength(audioInfoExtractor.getLength());
		if (!em.contains(audio)) {
			audio = em.merge(audio);
		}
		em.persist(audio);
		em.flush();
		audio.assignIdToTempAudioFile();
		return Response.status(Status.CREATED).entity(new AudioPostSuccessMessage(audio.getId(), audio.getLength(), audio.getAmplitudeOverTime())).build();
	}
	
	
	/**
	 * Updated audio info
	 * @param newAudio Audio form that is used to update existing one
	 * @param securityContext Security context with authenticated user
	 * @param id ID of the audio
	 * @return Action status
	 */
	@Path("{id}")
	@PATCH
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
		audio.setName(newAudio.getName());
		audio.sanitize();
		if (em.createNamedQuery("Project.getByUserAndName").setParameter("id", authUser.getId()).setParameter("name", audio.getName()).getResultList().size() > 0) {
			throw new UserAlreadyExistsException();
		}
		if (em.contains(audio)) {
			em.detach(audio);
		} 
		audio = em.merge(audio);
		em.persist(audio);
		return Response.ok(AUDIO_UPDATED_PAYLOAD).build();
	}
	
	/**
	 * Deletes requested audio
	 * @param securityContext Security context with authenticated user
	 * @param id ID of the audio resource
	 * @return Action status
	 */
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
		List<Project> projects = em.createNamedQuery("Project.getByUser", Project.class).setParameter("id", authUser.getId()).getResultList();
		for (Project project: projects) {
			System.out.println(project);
			for (Track track : project.getTracks()) {
				List<Sample> tracks = track.getSamples();
				Iterator<Sample> iTrack = tracks.iterator();
				while (iTrack.hasNext()) {
					Sample sample = iTrack.next();
					if (sample.getAudio().getId() == audio.getId()) {
						System.out.println(sample);
						iTrack.remove();
						if (!em.contains(sample)) {
							em.merge(sample);
						}
						em.remove(sample);
					}
				}
			}
		}
		audio.deleteAudioFile();
		em.flush();
		em.remove(audio);
		return Response.ok(AUDIO_DELETED_PAYLOAD).build();
	}

}
