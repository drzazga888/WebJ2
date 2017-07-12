package model;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.persistence.EntityTransaction;
import javax.ws.rs.InternalServerErrorException;

import org.mindrot.jbcrypt.BCrypt;

import bean.User;
import exception.UserAlreadyExistsException;

public class UserModel extends DatabaseConnectedModel {

	
	public void deleteUser(int id) {
		try {
			PreparedStatement stmt = conn.prepareStatement("DELETE FROM users WHERE id = ?");
			stmt.setInt(1, id);
			stmt.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
			throw new InternalServerErrorException();
		}
	}

}
