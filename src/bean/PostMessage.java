package bean;

public class PostMessage {
	
	public PostMessage() {
	}
	
	public PostMessage(long id) {
		this.id = id;
	}

	private long id;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

}
