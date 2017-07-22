package bean;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Track {
	
	private static final int MAX_TRACK_NAME_LENGTH = 40;

	@Id
	@GeneratedValue
	private Long id;
	
	@Column(length = MAX_TRACK_NAME_LENGTH, nullable = true)
	private String name;
	
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
	private List<Sample> samples;
	
	@Column(nullable = false)
	private float gain;
	
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
	public List<Sample> getSamples() {
		return samples;
	}
	public void setSamples(List<Sample> samples) {
		this.samples = samples;
	}
	public float getGain() {
		return gain;
	}
	public void setGain(float gain) {
		this.gain = gain;
	}

}
