package bean;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

/**
 * Base class that stores credentials (e-mail and password),
 * use also as JPA entity in connection with derived User class
 * @author kdrzazga
 *
 */
@MappedSuperclass
public class Credentials implements Serializable {
	
	protected static final long serialVersionUID = 1L;
	private static final int MAX_EMAIL_LENGTH = 40;
	
	@Column(length = MAX_EMAIL_LENGTH, nullable = false)
	protected String email;
	
	@Column(length = 60, nullable = false)
	protected String password;
	
	/**
	 * Default constructor
	 */
	public Credentials() {
		super();
	}

	/**
	 * Constructor that directly sets provided credentials
	 * @param email E-mail of the user
	 * @param password Password of the user
	 */
	public Credentials(String email, String password) {
		super();
		this.email = email;
		this.password = password;
	}

	/**
	 * Returns saved e-mail
	 * @return E-mail
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * Returns saved password
	 * @return User password
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * Sets user e-mail
	 * @param email User e-mail
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * Sets user password
	 * @param password Password
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * String representation of the object (useful for debug)
	 */
	@Override
	public String toString() {
		return String.format("Credentials(email=%s, password=%s)", email, password);
	}
	
}
