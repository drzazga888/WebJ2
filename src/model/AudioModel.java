package model;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.ws.rs.InternalServerErrorException;

import bean.Audio;
import bean.PostMessage;
import bean.User;

public class AudioModel extends DatabaseConnectedModel {
	
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

}
