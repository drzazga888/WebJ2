package bean;

public class SuccessMessage {
	
	public SuccessMessage() {
	}
	
	public SuccessMessage(String message) {
		this(message, null);
	}
	
	public SuccessMessage(String message, Long id) {
		this.message = message;
		this.id = id;
	}

	private Long id;
	private String message;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
