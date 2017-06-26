package model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public class Database {
	
	private Connection conn;

	public Database() {
		try {
			Context context = new InitialContext();
			DataSource ds = (DataSource) context.lookup("jdbc/postgres-api");
			this.conn = ds.getConnection();
		} catch (NamingException | SQLException e) {
			e.printStackTrace();
		}
	}
	
	public int createUser(User user) throws SQLException {
		PreparedStatement stmt = conn.prepareStatement("INSERT INTO users (fname, lname, email, password) VALUES (?, ?, ?, ?)");
		stmt.setString(1, user.getFname());
		stmt.setString(2, user.getLname());
		stmt.setString(3, user.getEmail());
		stmt.setString(4, user.getPassword());
		return stmt.executeUpdate();
	}
	
	// TODO delete it!
	public String test() {
		try {
			return conn.getMetaData().getDatabaseProductName();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

}
