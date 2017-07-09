package model;

import java.sql.Connection;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public abstract class DatabaseConnectedModel {
	
	protected Connection conn;

	public DatabaseConnectedModel() {
		try {
			Context context = new InitialContext();
			DataSource ds = (DataSource) context.lookup("jdbc/postgres-api");
			this.conn = ds.getConnection();
		} catch (NamingException | SQLException e) {
			e.printStackTrace();
		}
	}

}
