package bean;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import exception.BadParameterException;

@Entity
public class Audio implements Sanitizable {
	
	private static final int MAX_NAME_LENGTH = 40;

	@Id
	@GeneratedValue
	private long id;
	
	@Column(length = MAX_NAME_LENGTH, nullable = false)
	private String name;
	
	@Column(nullable = true)
	private double[] amplitudeOverTime;
	
	@ManyToOne(optional = false, fetch = FetchType.LAZY, cascade = { CascadeType.REMOVE } )
	private User user;
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public double[] getAmplitudeOverTime() {
		return amplitudeOverTime;
	}
	public void setAmplitudeOverTime(double[] amplitudeOverTime) {
		this.amplitudeOverTime = amplitudeOverTime;
	}
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	
	@Override
	public String toString() {
		return String.format("Audio(id=%d, name=%s, available=%s)", id, name, amplitudeOverTime != null ? "yes" : "no");
	}
	
	@Override
	public void sanitize() {
		// fname is not null / empty
		if (name == null || name.length() == 0) {
			throw new BadParameterException("name must be provided");
		}
		// max length of fname = MAX_FNAME_LENGTH
		if (name.length() > MAX_NAME_LENGTH) {
			throw new BadParameterException("max length of name is " + MAX_NAME_LENGTH);
		}
	}
	
}
