package controller;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
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
import bean.Project;
import bean.Sample;
import bean.SuccessMessage;
import bean.Track;
import bean.User;
import exception.UserIsNotOwnerException;
import filter.BasicSecurityContext;
import util.MusicProducer;

@Path("projects")
@Stateless
public class ProjectController {
	
	private static final String PROJECT_CREATED_MESSAGE = "project was successfully created";
	private static final String PROJECT_UPDATED_MESSAGE = "project was successfully updated";
	private static final String PROJECT_DELETED_MESSAGE = "project was successfully deleted";
	
	@PersistenceContext(name = "WebJ2")
	private EntityManager em;
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createProject(Project requestProject, @Context SecurityContext securityContext) {
		User user = (User) ((BasicSecurityContext) securityContext).getUser();
		Project project = new Project();
		project.setName(requestProject.getName());
		project.setCreatedAt(new Date());
		project.setUpdatedAt(new Date());
		project.setUser(user);
		Track track = new Track();
		track.setName("");
		project.setTracks(Arrays.asList(track));
		project.sanitize();
		if (!em.contains(project)) {
			project = em.merge(project);
		}
		em.persist(project);
		em.flush();
		return Response.status(Status.CREATED).entity(new SuccessMessage(PROJECT_CREATED_MESSAGE, project.getId())).build();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getProjectsList(@Context SecurityContext securityContext) {
		User user = (User) ((BasicSecurityContext) securityContext).getUser();
		List<Project> projects = em.createNamedQuery("Project.getByUser", Project.class).setParameter("id", user.getId()).getResultList();
		return Response.ok(projects.stream().map(a -> a.prepareForResponse()).collect(Collectors.toList())).build();
	}
	
	@GET
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getProject(@Context SecurityContext securityContext, @PathParam("id") String id) {
		User authUser = (User) ((BasicSecurityContext) securityContext).getUser();
		Project project = em.find(Project.class, Long.parseLong(id));
		if (project == null) {
			throw new NotFoundException();
		}
		if (project.getUser().getId() != authUser.getId()) {
			throw new UserIsNotOwnerException();
		}
		return Response.ok(project.prepareForExtendedResponse()).build();
	}
	
	@PUT
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response putProject(Project project, @Context SecurityContext securityContext, @PathParam("id") String id) {
		User authUser = (User) ((BasicSecurityContext) securityContext).getUser();
		Project existingProject = em.find(Project.class, Long.parseLong(id));
		if (existingProject == null) {
			throw new NotFoundException();
		}
		if (existingProject.getUser().getId() != authUser.getId()) {
			throw new UserIsNotOwnerException();
		}
		project.deepSanitize();
		for (Track track : project.getTracks()) {
			for (Sample sample : track.getSamples()) {
				Audio audio = em.find(Audio.class, sample.getAudioId());
				if (audio == null) {
					throw new NotFoundException();
				}
				if (audio.getUser().getId() != authUser.getId()) {
					throw new UserIsNotOwnerException();
				}
				sample.setAudio(audio);
			}
		}
		for (Track track : project.getTracks()) {
			for (Sample sample : track.getSamples()) {
				if (!em.contains(sample)) {
					em.merge(sample);
				}
				em.remove(sample);
			}
			if (!em.contains(track)) {
				em.merge(track);
			}
			em.remove(track);
		}
		project.setId(existingProject.getId());
		if (!em.contains(project)) {
			em.merge(project);
		}
		em.persist(project);
		return Response.ok(new SuccessMessage(PROJECT_UPDATED_MESSAGE)).build();
	}
	
	@DELETE
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteProject(SecurityContext securityContext, @PathParam("id") String id) {
		User authUser = (User) ((BasicSecurityContext) securityContext).getUser();
		Project project = em.find(Project.class, Long.parseLong(id));
		if (project == null) {
			throw new NotFoundException();
		}
		if (project.getUser().getId() != authUser.getId()) {
			throw new UserIsNotOwnerException();
		}
		for (Track track : project.getTracks()) {
			for (Sample sample : track.getSamples()) {
				if (!em.contains(sample)) {
					em.merge(sample);
				}
				em.remove(sample);
			}
			if (!em.contains(track)) {
				em.merge(track);
			}
			em.remove(track);
		}
		if (!em.contains(project)) {
			em.merge(project);
		}
		em.remove(project);
		return Response.ok(new SuccessMessage(PROJECT_DELETED_MESSAGE)).build();
	}
	
	@GET
	@Path("{id}")
	@Produces("audio/wav")
	public Response produce(SecurityContext securityContext, @PathParam("id") String id) {
		User authUser = (User) ((BasicSecurityContext) securityContext).getUser();
		Project project = em.find(Project.class, Long.parseLong(id));
		if (project == null) {
			throw new NotFoundException();
		}
		if (project.getUser().getId() != authUser.getId()) {
			throw new UserIsNotOwnerException();
		}
		MusicProducer producer = new MusicProducer(project);
		try {
			producer.createFromProject();
		} catch (IOException e) {
			e.printStackTrace();
			throw new InternalServerErrorException();
		}
		File result = producer.getResult();
		return Response.ok(result).header("Content-Disposition", "attachment; filename=\"" + project.getName() + "\"").build();
	}
	
}
