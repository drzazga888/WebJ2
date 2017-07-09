package bean;

public class User extends Credentials {

	public User(Integer id, String fname, String lname, String email, String password, String password2) {
		super(email, password);
		this.id = id;
		this.fname = fname;
		this.lname = lname;
		this.password2 = password2;
	}

	public User() {
		super(null, null);
	}

	private Integer id;
	private String fname;
	private String lname;
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

	public void setPassword2(String password2) {
		this.password2 = password2;
	}
	
	@Override
	public String toString() {
		return String.format("User(id=%d, fname=%s, lname=%s, email=%s, password=%s, password2=%s)", id, fname, lname, email, password, password2);
	}
	
}
