package bean;

/**
 * Utility class that could be used to produce
 * nice success message in response
 * @author kdrzazga
 *
 */
public class SuccessMessage {
	
	/**
	 * Default constructor
	 */
	public SuccessMessage() {
	}
	
	/**
	 * Constructor with message parameter
	 * @param message Message to be send
	 */
	public SuccessMessage(String message) {
		this(message, null);
	}
	
	/**
	 * More complex constructor, with message and id parameters
	 * @param message Message to be send
	 * @param id ID number of the related resource
	 */
	public SuccessMessage(String message, Long id) {
		this.message = message;
		this.id = id;
	}

	private Long id;
	private String message;

	/**
	 * ID getter
	 * @return ID
	 */
	public Long getId() {
		return id;
	}

	/**
	 * ID setter
	 * @param id New resource ID
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * Message string getter
	 * @return Existing message
	 */
	public String getMessage() {
		return message;
	}

	/**
	 * Message setter
	 * @param message New message text
	 */
	public void setMessage(String message) {
		this.message = message;
	}

}
