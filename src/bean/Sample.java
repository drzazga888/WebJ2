package bean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;

import exception.BadParameterException;
import util.Sanitizable;


/**
 * JPA Entity that describes single sample
 * @author kdrzazga
 *
 */
@Entity
public class Sample implements Sanitizable {

	@Id
	@GeneratedValue
	private Long id;
	
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	private Audio audio;
	
	@Column(nullable = false)
	private float start;
	
	@Column(nullable = false)
	private float duration;
	
	@Column(name = "AUDIO_OFFSET", nullable = false)
	private float offset;
	
	@Column(nullable = false)
	private float gain;
	
	@Transient
	private Long audioId;
	
	/**
	 * Sample ID getter
	 * @return Audio ID
	 */
	public Long getId() {
		return id;
	}
	
	/**
	 * Sample ID setter
	 * @param id New audio ID
	 */
	public void setId(Long id) {
		this.id = id;
	}
	
	/**
	 * Returns audio, that is connected to the sample
	 * @return Related audio instance
	 */
	public Audio getAudio() {
		return audio;
	}
	
	/**
	 * Allows to set audio to the sample
	 * @param audio New audio reference 
	 */
	public void setAudio(Audio audio) {
		this.audio = audio;
	}
	
	/**
	 * Returns sample start position (in seconds)
	 * @return Start position
	 */
	public float getStart() {
		return start;
	}
	
	/**
	 * Sets sample start position (in seconds)
	 * @param start New audio start position
	 */
	public void setStart(float start) {
		this.start = start;
	}
	
	/**
	 * Returns duration of the sample (in seconds)
	 * @return Audio duration
	 */
	public float getDuration() {
		return duration;
	}
	
	/**
	 * Audio duration setter (in seconds)
	 * @param duration New audio duration
	 */
	public void setDuration(float duration) {
		this.duration = duration;
	}
	
	/**
	 * Audio playing offset getter (in seconds)
	 * @return Audio playing offset
	 */
	public float getOffset() {
		return offset;
	}
	
	/**
	 * Allows to set new audio playing offset (in seconds)
	 * @param offset Audio playing offset
	 */
	public void setOffset(float offset) {
		this.offset = offset;
	}
	
	/**
	 * Getter for sample gain (volume)
	 * @return Sample volume
	 */
	public float getGain() {
		return gain;
	}
	
	/**
	 * Setter of sample volume
	 * @param gain New sample gain
	 */
	public void setGain(float gain) {
		this.gain = gain;
	}
	
	/**
	 * Getter of transient field audioId,
	 * it's useful when you want to send back
	 * only audio id instead of full audio details
	 * @return Connected audio ID of the sample
	 */
	public Long getAudioId() {
		return audioId;
	}
	
	/**
	 * Sets new audio ID (transient)
	 * @param audioId New audio ID
	 */
	public void setAudioId(Long audioId) {
		this.audioId = audioId;
	}
	
	/**
	 * Creates object that could be send as a response,
	 * makes use of audioId fields instead of audio,
	 * do not returns user data
	 * @return
	 */
	public Object prepareForResponse() {
		Sample sample = new Sample();
		sample.setAudioId(audio.getId());
		sample.setDuration(duration);
		sample.setGain(gain);
		sample.setStart(start);
		sample.setOffset(offset);
		return sample;
	}
	
	/**
	 * Sanitizes data - when there's bad field, BadParameterException
	 * with message is throwed
	 */
	@Override
	public void sanitize() {
		if (audioId == null) {
			throw new BadParameterException("id of the audio must be provided");
		}
	}
	
}
