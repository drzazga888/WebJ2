package bean;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;

@MappedSuperclass
public class Credentials implements Serializable {
	
	protected static final long serialVersionUID = 1L;
	public static final int MAX_EMAIL_LENGTH = 40;
	
	@Column(length = MAX_EMAIL_LENGTH, nullable = false)
	protected String email;
	
	@Column(length = 60, nullable = false)
	protected String password;
	
	public Credentials() {
		super();
	}

	public Credentials(String email, String password) {
		super();
		this.email = email;
		this.password = password;
	}

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
