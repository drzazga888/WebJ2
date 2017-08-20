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
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Audio getAudio() {
		return audio;
	}
	public void setAudio(Audio audio) {
		this.audio = audio;
	}
	public float getStart() {
		return start;
	}
	public void setStart(float start) {
		this.start = start;
	}
	public float getDuration() {
		return duration;
	}
	public void setDuration(float duration) {
		this.duration = duration;
	}
	public float getOffset() {
		return offset;
	}
	public void setOffset(float offset) {
		this.offset = offset;
	}
	public float getGain() {
		return gain;
	}
	public void setGain(float gain) {
		this.gain = gain;
	}
	public Long getAudioId() {
		return audioId;
	}
	public void setAudioId(Long audioId) {
		this.audioId = audioId;
	}
	
	public Object prepareForResponse() {
		Sample sample = new Sample();
		sample.setAudioId(audio.getId());
		sample.setDuration(duration);
		sample.setGain(gain);
		sample.setStart(start);
		sample.setOffset(offset);
		return sample;
	}
	
	@Override
	public void sanitize() {
		if (audioId == null) {
			throw new BadParameterException("id of the audio must be provided");
		}
	}
	
}
