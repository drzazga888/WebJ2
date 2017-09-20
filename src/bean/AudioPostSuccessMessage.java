package bean;

/**
 * Used to build success audio creation message
 * @author kdrzazga
 *
 */
public class AudioPostSuccessMessage extends SuccessMessage {
	
	private static final String AUDIO_CREATED_MESSAGE = "audio was successfully created";
	
	private double length;
	private float[] amplitudeOverTime;
	
	/**
	 * Default constructor
	 * @param id ID of the created resource
	 * @param length Duration of the audio
	 * @param amplitudeOverTime Amplitudes of the audio
	 */
	public AudioPostSuccessMessage(Long id, double length, float[] amplitudeOverTime) {
		super(AUDIO_CREATED_MESSAGE, id);
		this.setLength(length);
		this.setAmplitudeOverTime(amplitudeOverTime);
	}

	/**
	 * Returns audio duration
	 * @return Duration
	 */
	public double getLength() {
		return length;
	}

	/**
	 * Sets audio duration
	 * @param length Audio duration
	 */
	public void setLength(double length) {
		this.length = length;
	}

	/**
	 * Returns amplitudes of the audio
	 * @return Amplitudes in array
	 */
	public float[] getAmplitudeOverTime() {
		return amplitudeOverTime;
	}

	/**
	 * Allows to set audio amplitudes directly
	 * @param amplitudeOverTime Amplitudes of the audio
	 */
	public void setAmplitudeOverTime(float[] amplitudeOverTime) {
		this.amplitudeOverTime = amplitudeOverTime;
	}

}
