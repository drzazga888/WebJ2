package bean;

import java.util.List;
import java.util.regex.Pattern;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import exception.BadParameterException;

@Entity
@Table(name = "PROFILE")
@NamedQuery(name = "User.getByEmail", query = "SELECT u FROM User u WHERE u.email = :email")
public class User extends Credentials implements Sanitizable {
	
	private static final long serialVersionUID = 1L;
	public static final Pattern EMAIL_PATTERN = Pattern.compile("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}");
	public static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
	public static final int MAX_FNAME_LENGTH = 40;
	public static final int MAX_LNAME_LENGTH = 40;
	
	@Id
	@GeneratedValue
	private Long id;
	
	@Column(length = MAX_FNAME_LENGTH, unique = true, nullable = false)
	private String fname;
	
	@Column(length = MAX_LNAME_LENGTH, nullable = false)
	private String lname;
	
	@Transient
	private String password2;
	
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
	private List<Audio> audios;
	
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
	private List<Project> projects;
	
	public User() {
		super();
	}
	
	public User(Long id, String fname, String lname, String email, String password2, String password) {
		super(email, password);
		this.id = id;
		this.fname = fname;
		this.lname = lname;
		this.password2 = password2;
	}
	
	public void sanitize() {
		// fname is not null / empty
		if (fname == null || fname.length() == 0) {
			throw new BadParameterException("fname must be provided");
		}
		// max length of fname = MAX_FNAME_LENGTH
		if (fname.length() > MAX_FNAME_LENGTH) {
			throw new BadParameterException("max length of fname is " + MAX_FNAME_LENGTH);
		}
		// lname is not null / empty
		if (lname == null || lname.length() == 0) {
			throw new BadParameterException("lname must be provided");
		}
		// max length of fname = MAX_FNAME_LENGTH
		if (lname.length() > MAX_FNAME_LENGTH) {
			throw new BadParameterException("max length of lname is " + MAX_LNAME_LENGTH);
		}
		// email is not null / empty
		if (email == null || email.length() == 0) {
			throw new BadParameterException("email must be provided");
		}
		// email is email :)
		if (!EMAIL_PATTERN.matcher(email).matches()) {
			throw new BadParameterException("bad email format");
		}
		// password is not null / empty
		if (password == null || password.length() == 0) {
			throw new BadParameterException("password must be provided");
		}
		// password constraints - at liest 1 upper, 1 lower, 1 digit and 1 special
		if (!PASSWORD_PATTERN.matcher(password).matches()) {
			throw new BadParameterException("password must contain at liest 1 uppercase English letter, 1 lowercase English letter, 1 digit and 1 special character (#?!@$%^&*-)");
		}
		// password2 is not null / empty
		if (password2 == null || password2.length() == 0) {
			throw new BadParameterException("password2 must be provided");
		}
		// password = password2
		if (!password.equals(password2)) {
			throw new BadParameterException("password and password2 must be the same");
		}
	}
	
	@Override
	public String toString() {
		return String.format(
				"User(id=%d, fname=%s, lname=%s, email=%s, password=%s, password2=%s, audios=%d, projects=%d)",
				id, fname, lname, email, password, password2,
				audios != null ? audios.size() : null,
				projects != null ? projects.size() : null
		);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFname() {
		return fname;
	}

	public void setFname(String fname) {
		this.fname = fname;
	}

	public String getLname() {
		return lname;
	}

	public void setLname(String lname) {
		this.lname = lname;
	}

	public String getPassword2() {
		return password2;
	}

	public void setPassword2(String password2) {
		this.password2 = password2;
	}

	public List<Audio> getAudios() {
		return audios;
	}

	public void setAudios(List<Audio> audios) {
		this.audios = audios;
	}

	public List<Project> getProjects() {
		return projects;
	}

	public void setProjects(List<Project> projects) {
		this.projects = projects;
	}
	
}
