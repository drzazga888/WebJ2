package bean;

public class AudioPostSuccessMessage extends SuccessMessage {
	
	private static final String AUDIO_CREATED_MESSAGE = "audio was successfully created";
	
	private double length;
	private float[] amplitudeOverTime;
	
	public AudioPostSuccessMessage(Long id, double length, float[] amplitudeOverTime) {
		super(AUDIO_CREATED_MESSAGE, id);
		this.setLength(length);
		this.setAmplitudeOverTime(amplitudeOverTime);
	}

	public double getLength() {
		return length;
	}

	public void setLength(double length) {
		this.length = length;
	}

	public float[] getAmplitudeOverTime() {
		return amplitudeOverTime;
	}

	public void setAmplitudeOverTime(float[] amplitudeOverTime) {
		this.amplitudeOverTime = amplitudeOverTime;
	}

}
