package bean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Sample {

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
	
}
