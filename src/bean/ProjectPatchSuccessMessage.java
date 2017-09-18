package bean;

import java.util.Date;

public class ProjectPatchSuccessMessage extends SuccessMessage {
	
	private static final String PROJECT_UPDATED_MESSAGE = "project was successfully updated";
	
	private Date updatedAt;

	public ProjectPatchSuccessMessage(Date updatedAt) {
		super(PROJECT_UPDATED_MESSAGE, null);
		this.setUpdatedAt(updatedAt);
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}

}
