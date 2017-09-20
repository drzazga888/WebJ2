package bean;

/**
 * Holds error message
 * @author kdrzazga
 *
 */
public class ErrorMessage {
	
	/**
	 * Default constructor
	 */
	public ErrorMessage() {
	}
	
	/**
	 * Constructor with one parameter
	 * @param error Error to be set
	 */
	public ErrorMessage(String error) {
		this.error = error;
	}

	private String error;

	/**
	 * Returns saved error
	 * @return Saved error
	 */
	public String getError() {
		return error;
	}

	/**
	 * Allows to change error message
	 * @param error Error message
	 */
	public void setError(String error) {
		this.error = error;
	}

}
