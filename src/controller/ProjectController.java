package controller;

import java.util.Arrays;
import java.util.Date;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.Response.Status;

import bean.Project;
import bean.SuccessMessage;
import bean.Track;
import bean.User;
import filter.BasicSecurityContext;

@Path("projects")
@Stateless
public class ProjectController {
	
	@PersistenceContext(name = "WebJ2")
	private EntityManager em;
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createProject(Project requestProject, SecurityContext securityContext) {
		User user = (User) ((BasicSecurityContext) securityContext).getUser();
		Project project = new Project();
		project.setName(requestProject.getName());
		project.setCreatedAt(new Date());
		project.setUpdatedAt(new Date());
		project.setUser(user);
		project.setTracks(Arrays.asList(new Track()));
		project.sanitize();
		if (!em.contains(project)) {
			project = em.merge(project);
		}
		em.persist(project);
		em.flush();
		return Response.status(Status.CREATED).entity(new SuccessMessage("project was successfully created", project.getId())).build();
	}
	
	/*
	@GET
	@Path("produce")
	@Produces("audio/wav")
	public Response produce() {
		try {
			Project project = new Project(new ProjectSample[] {
					new ProjectSample("838[kb]099_deep_soul_rhodes.aif.mp3", 1.0, 0.0, 0.0, 5.0),
				git 	new ProjectSample("341[kb]121_limp-twins_elemental.wav.mp3", 1.0, 0.0, 0.0, 5.0),
					new ProjectSample("171[kb]121_hard-latin-bell.wav.mp3", 0.3, 0.0, 4.0, 1.0),
					new ProjectSample("agh_oh_yeah.mp3", 5.0, 0.0, 5.0, 3.0)
			}, 8.0, "test_proj");
			MusicProducer prod = new MusicProducer(project);	
			prod.createFromProject();
			return Response.ok(prod.getResult()).build();
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.NOT_FOUND).build();
		}
	}
*/
}
