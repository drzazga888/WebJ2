package controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import javax.activation.DataHandler;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
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
import com.ibm.wsdl.util.IOUtils;

import javax.ws.rs.core.Response.Status;

import bean.Audio;
import bean.PostMessage;
import bean.User;
import filter.BasicSecurityContext;

@Path("audios")
@Stateless
public class AudioController {
	
	@PersistenceContext(name = "WebJ2")
	private EntityManager em;
	
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
	public String replaceAudio(
			IMultipartBody multipartBody,
			@Context SecurityContext securityContext,
			@PathParam("id") String id
	) {
		try {
			IAttachment attachment = multipartBody.getRootAttachment();
			DataHandler dataHandler = attachment.getDataHandler();
			InputStream audioStream = dataHandler.getInputStream();
			Files.copy(audioStream, Paths.get("./test.wav"), StandardCopyOption.REPLACE_EXISTING);
			return attachment.getContentType().toString();
		} catch (IOException e) {
			e.printStackTrace();
			return "bad, bad error!";
		}
	}

}
