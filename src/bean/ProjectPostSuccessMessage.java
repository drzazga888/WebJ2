package bean;

import java.util.Date;

public class ProjectPostSuccessMessage extends SuccessMessage {
	
	private static final String PROJECT_CREATED_MESSAGE = "project was successfully created";
	
	private Date createdAt;
	private Date updatedAt;

	public ProjectPostSuccessMessage(Long id, Date createdAt, Date updatedAt) {
		super(PROJECT_CREATED_MESSAGE, id);
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
