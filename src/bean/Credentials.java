package bean;

public class Credentials {

	public Credentials(String email, String password) {
		super();
		this.email = email;
		this.password = password;
	}

	protected String email;
	protected String password;

	public String getEmail() {
		return email;
	}

	public String getPassword() {
		return password;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		return String.format("Credentials(email=%s, password=%s)", email, password);
	}
	
}
