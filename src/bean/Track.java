package bean;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import exception.BadParameterException;
import util.Sanitizable;

@Entity
public class Track implements Sanitizable {
	
	private static final int MAX_TRACK_NAME_LENGTH = 40;

	@Id
	@GeneratedValue
	private Long id;
	
	@Column(length = MAX_TRACK_NAME_LENGTH)
	private String name;
	
	@OneToMany(fetch = FetchType.EAGER)
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
	
	public Object prepareForResponse() {
		Track track = new Track();
		track.setGain(gain);
		track.setName(name);
		track.setSamples(samples.stream().map(a -> a.prepareForResponse()).collect(Collectors.toCollection(ArrayList<Sample>::new)));
		return track;
	}
	
	@Override
	public void sanitize() {
		if (name == null || name.length() == 0) {
			throw new BadParameterException("name must be provided");
		}
		if (name.length() > MAX_TRACK_NAME_LENGTH) {
			throw new BadParameterException("max length of name is " + MAX_TRACK_NAME_LENGTH);
		}
		for (Sample sample : samples) {
			sample.sanitize();
		}
	}

}
