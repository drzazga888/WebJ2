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
import bean.ProjectPatchSuccessMessage;
import bean.ProjectPostSuccessMessage;
import bean.Sample;
import bean.SuccessMessage;
import bean.Track;
import bean.User;
import exception.UserAlreadyExistsException;
import exception.UserIsNotOwnerException;
import filter.BasicSecurityContext;
import util.MusicProducer;
import util.PATCH;

@Path("projects")
@Stateless
public class ProjectController {
	
	private static final String PROJECT_DELETED_MESSAGE = "project was successfully deleted";	
	private static final String PROJECT_UPDATED_MESSAGE = "project was successfully updated";
	
	private static final SuccessMessage PROJECT_DELETED_PAYLOAD = new SuccessMessage(PROJECT_DELETED_MESSAGE);
	
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
		track.setGain(1.0f);
		project.setTracks(Arrays.asList(track));
		project.sanitize();
		if (em.createNamedQuery("Project.getByUserAndName").setParameter("id", user.getId()).setParameter("name", requestProject.getName()).getResultList().size() > 0) {
			throw new UserAlreadyExistsException();
		}
		if (!em.contains(project)) {
			project = em.merge(project);
		}
		em.persist(project);
		em.flush();
		return Response.status(Status.CREATED).entity(new ProjectPostSuccessMessage(project.getId(), project.getCreatedAt(), project.getUpdatedAt())).build();
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
		List<Project> projectsByName = em.createNamedQuery("Project.getByUserAndName", Project.class).setParameter("id", authUser.getId()).setParameter("name", project.getName()).getResultList();
		if (projectsByName.size() > 0 && projectsByName.get(0).getId() != existingProject.getId()) {
			throw new UserAlreadyExistsException();
		}
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
		project.setUser(existingProject.getUser());
		project.setCreatedAt(existingProject.getCreatedAt());
		project.setUpdatedAt(new Date());
		if (!em.contains(project)) {
			em.merge(project);
		}
		return Response.ok(new SuccessMessage(PROJECT_UPDATED_MESSAGE)).build();
	}
	
	@PATCH
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response patchProject(Project project, @Context SecurityContext securityContext, @PathParam("id") String id) {
		User authUser = (User) ((BasicSecurityContext) securityContext).getUser();
		Project existingProject = em.find(Project.class, Long.parseLong(id));
		if (existingProject == null) {
			throw new NotFoundException();
		}
		if (existingProject.getUser().getId() != authUser.getId()) {
			throw new UserIsNotOwnerException();
		}
		project.sanitize();
		if (em.createNamedQuery("Project.getByUserAndName").setParameter("id", authUser.getId()).setParameter("name", project.getName()).getResultList().size() > 0) {
			throw new UserAlreadyExistsException();
		}
		existingProject.setName(project.getName());
		existingProject.setUpdatedAt(new Date());
		if (!em.contains(existingProject)) {
			em.merge(existingProject);
		}
		return Response.ok(new ProjectPatchSuccessMessage(existingProject.getUpdatedAt())).build();
	}
	
	@DELETE
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteProject(@Context SecurityContext securityContext, @PathParam("id") String id) {
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
		project.deleteAudioFile();
		if (!em.contains(project)) {
			em.merge(project);
		}
		em.remove(project);
		return Response.ok(PROJECT_DELETED_PAYLOAD).build();
	}
	
	@GET
	@Path("{id}/audio")
	@Produces("audio/wav")
	public Response produce(@Context SecurityContext securityContext, @PathParam("id") String id) {
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
		return Response.ok(result).header("Content-Disposition", "attachment; filename=\"" + project.getName() + ".wav\"").build();
	}
	
}
