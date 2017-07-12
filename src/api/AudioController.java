package api;

import javax.ws.rs.Path;

@Path("audios")
public class AudioController {
	
	/*
	private AudioModel audioModel = new AudioModel();
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createSampleResource(Audio audio, @Context HttpServletRequest request) {
		User user = (User) request.getAttribute("user");
		return Response.status(Status.CREATED).entity(audioModel.createNewAudioResource(user, audio)).build();
	}
	
	public PostMessage createNewAudioResource(User user, Audio audio) {
		try {
			PreparedStatement stmt = conn.prepareStatement("INSERT INTO audios (user_id, name) VALUES (?, ?)", Statement.RETURN_GENERATED_KEYS);
			stmt.setInt(1, user.getId());
			stmt.setString(2, audio.getName());
			stmt.executeUpdate();
			ResultSet result = stmt.getGeneratedKeys();
			result.next();
			return new PostMessage(result.getInt(1));
		} catch (SQLException e) {
			e.printStackTrace();
			throw new InternalServerErrorException();
		}
	}
	*/

}
