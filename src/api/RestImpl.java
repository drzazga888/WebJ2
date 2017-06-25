package api;
import java.io.IOException;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import model.Project;
import model.ProjectSample;
import processors.MusicProducer;

@Path("/")
public class RestImpl {
	
	@GET
	@Produces("audio/wav")
	public Response getRest() {
		try {
			Project project = new Project(new ProjectSample[] {
					new ProjectSample("838[kb]099_deep_soul_rhodes.aif.mp3", 1.0, 0.0, 0.0, 5.0),
					new ProjectSample("341[kb]121_limp-twins_elemental.wav.mp3", 1.0, 0.0, 0.0, 5.0),
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

}
