package model;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.mindrot.jbcrypt.BCrypt;

import bean.User;

public class UserModel extends DatabaseConnectedModel {
	
	public void createUser(User user) throws SQLException {
		PreparedStatement stmt = conn.prepareStatement("INSERT INTO users (fname, lname, email, password) VALUES (?, ?, ?, ?)");
		stmt.setString(1, user.getFname());
		stmt.setString(2, user.getLname());
		stmt.setString(3, user.getEmail());
		stmt.setString(4, BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
		stmt.executeUpdate();
	}
	
	public User getUserByEmail(String email) throws SQLException {
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
	}
	
	public boolean checkIfUserExistsById(int id) throws SQLException {
		PreparedStatement stmt = conn.prepareStatement("SELECT email FROM users WHERE id = ?");
		stmt.setInt(1, id);
		ResultSet result = stmt.executeQuery();
		return result.next();
	}

	public void updateUser(User user) throws SQLException {
		PreparedStatement stmt = conn.prepareStatement("UPDATE FROM users SET fname = ?, lname = ?, email = ?, password = ? WHERE id = ?");
		stmt.setString(1, user.getFname());
		stmt.setString(2, user.getLname());
		stmt.setString(3, user.getEmail());
		stmt.setString(4, BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
		stmt.setInt(5,  user.getId());
		stmt.executeUpdate();
	}
	
	public void deleteUser(int id) throws SQLException {
		PreparedStatement stmt = conn.prepareStatement("DELETE FROM users WHERE id = ?");
		stmt.setInt(1, id);
		stmt.executeUpdate();
	}

}
