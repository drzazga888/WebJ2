package bean;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import exception.BadParameterException;
import util.Sanitizable;

/**
 * JPA entity that contains information about project tracks
 * @author kdrzazga
 *
 */
@Entity
public class Track implements Sanitizable {
	
	private static final int MAX_TRACK_NAME_LENGTH = 40;

	@Id
	@GeneratedValue
	private Long id;
	
	@Column(length = MAX_TRACK_NAME_LENGTH)
	private String name;
	
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
	private List<Sample> samples;
	
	@Column(nullable = false)
	private float gain;
	
	/**
	 * Track ID getter
	 * @return Track ID
	 */
	public Long getId() {
		return id;
	}
	
	/**
	 * Track ID setter
	 * @param id New track ID
	 */
	public void setId(Long id) {
		this.id = id;
	}
	
	/**
	 * Track name getter
	 * @return Track name
	 */
	public String getName() {
		return name;
	}
	
	/**
	 * Track name setter
	 * @param name New track name
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * Return list of the samples contained in current track
	 * @return List of samples
	 */
	public List<Sample> getSamples() {
		return samples;
	}
	
	/**
	 * This method allows to replace sample list to the new collection
	 * @param samples List of new samples
	 */
	public void setSamples(List<Sample> samples) {
		this.samples = samples;
	}
	
	/**
	 * Getter of the track gain (it applies also to the contained samples)
	 * @return Gain (volume) value
	 */
	public float getGain() {
		return gain;
	}
	
	/**
	 * Allows to set new value of track gain
	 * @param gain New track volume
	 */
	public void setGain(float gain) {
		this.gain = gain;
	}
	
	/**
	 * It combines track fields to create new object that
	 * could be used e.g. as a JAX-RS JSON response
	 * @return
	 */
	public Object prepareForResponse() {
		Track track = new Track();
		track.setGain(gain);
		track.setName(name);
		track.setSamples(samples.stream().map(a -> a.prepareForResponse()).collect(Collectors.toCollection(ArrayList<Sample>::new)));
		return track;
	}
	
	/**
	 * When you call this function on track and no exceptions will be thrown
	 * than track-specific fields are valid
	 */
	@Override
	public void sanitize() {
		if (name == null) {
			throw new BadParameterException("name must be a string");
		}
		if (name.length() > MAX_TRACK_NAME_LENGTH) {
			throw new BadParameterException("max length of name is " + MAX_TRACK_NAME_LENGTH);
		}
		for (Sample sample : samples) {
			sample.sanitize();
		}
	}

}
