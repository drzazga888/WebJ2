package model;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.ws.rs.InternalServerErrorException;

import org.mindrot.jbcrypt.BCrypt;

import bean.User;
import exception.UserAlreadyExistsException;

public class UserModel extends DatabaseConnectedModel {
	
	public void createUser(User user) {
		try {
			// check if provided email already exists...
			if (getUserByEmail(user.getEmail()) != null) {
				throw new UserAlreadyExistsException();
			}
			// do the update!
			PreparedStatement stmt = conn.prepareStatement("INSERT INTO users (fname, lname, email, password) VALUES (?, ?, ?, ?)");
			stmt.setString(1, user.getFname());
			stmt.setString(2, user.getLname());
			stmt.setString(3, user.getEmail());
			stmt.setString(4, BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
			stmt.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
			throw new InternalServerErrorException();
		}
	}
	
	public User getUserByEmail(String email) {
		try {
			PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE email = ?");
			stmt.setString(1, email);
			ResultSet result = stmt.executeQuery();
			if (result.next()) {
				return new User(
						result.getInt("id"),
						result.getString("fname"),
						result.getString("lname"),
						result.getString("email"),
						result.getString("password"),
						null
				);
			}
			return null;
		} catch (SQLException e) {
			e.printStackTrace();
			throw new InternalServerErrorException();
		}
	}
	
	public boolean checkIfUserExistsById(int id) {
		try {
			PreparedStatement stmt = conn.prepareStatement("SELECT email FROM users WHERE id = ?");
			stmt.setInt(1, id);
			ResultSet result = stmt.executeQuery();
			return result.next();
		}
		catch (SQLException e) {
			e.printStackTrace();
			throw new InternalServerErrorException();
		}
	}

	public void updateUser(User user) {
		try {
			// check if provided email already exists...
			if (getUserByEmail(user.getEmail()) != null) {
				throw new UserAlreadyExistsException();
			}
			// do the update
			PreparedStatement stmt = conn.prepareStatement("UPDATE users SET fname = ?, lname = ?, email = ?, password = ? WHERE id = ?");
			stmt.setString(1, user.getFname());
			stmt.setString(2, user.getLname());
			stmt.setString(3, user.getEmail());
			stmt.setString(4, BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
			stmt.setInt(5,  user.getId());
			stmt.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
			throw new InternalServerErrorException();
		}
	}
	
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
