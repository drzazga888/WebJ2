package model;

public class User {

	private Integer id;
	private String fname;
	private String lname;
	private String email;
	private String password;
	private String password2;

	public Integer getId() {
		return id;
	}

	public String getFname() {
		return fname;
	}

	public String getLname() {
		return lname;
	}

	public String getEmail() {
		return email;
	}

	public String getPassword() {
		return password;
	}

	public String getPassword2() {
		return password2;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}

	public void setFname(String fname) {
		this.fname = fname;
	}

	public void setLname(String lname) {
		this.lname = lname;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setPassword2(String password2) {
		this.password2 = password2;
	}
	
	@Override
	public String toString() {
		return String.format("User(id=%d, fname=%s, lname=%s, email=%s, password=%s, password2=%s)", id, fname, lname, email, password, password2);
	}
	
}
