package bean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;

import exception.BadParameterException;
import util.ResponsePreparable;
import util.Sanitizable;

@Entity
@NamedQuery(name = "Audio.getByUser", query = "SELECT a FROM Audio a WHERE a.user.id = :id")
public class Audio implements Sanitizable, ResponsePreparable {
	
	private static final int MAX_NAME_LENGTH = 40;

	@Id
	@GeneratedValue
	private Long id;
	
	@Column(length = MAX_NAME_LENGTH, nullable = false)
	private String name;
	
	@Column(nullable = true)
	private float[] amplitudeOverTime;
	
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	private User user;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public float[] getAmplitudeOverTime() {
		return amplitudeOverTime;
	}
	public void setAmplitudeOverTime(float[] amplitudeOverTime) {
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
		if (name == null || name.length() == 0) {
			throw new BadParameterException("name must be provided");
		}
		if (name.length() > MAX_NAME_LENGTH) {
			throw new BadParameterException("max length of name is " + MAX_NAME_LENGTH);
		}
	}
	
	public String audioPath() {
		return id != null ? "./audios/" + id + ".wav" : null;
	}
	
	@Override
	public Object prepareForResponse() {
		Audio audio = new Audio();
		audio.setId(id);
		audio.setName(name);
		audio.setAmplitudeOverTime(amplitudeOverTime);
		return audio;
	}
	
}
