package bean;

import java.util.Date;

public class ProjectPostSuccessMessage extends SuccessMessage {
	
	private Date createdAt;
	private Date updatedAt;

	public ProjectPostSuccessMessage(String message, Long id, Date createdAt, Date updatedAt) {
		super(message, id);
		this.setCreatedAt(createdAt);
		this.setUpdatedAt(updatedAt);
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

}
