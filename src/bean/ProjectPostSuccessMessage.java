package bean;

import java.util.Date;

/**
 * Consists of information that need to be send back to the user
 * when project had been successfully created
 * @author kdrzazga
 *
 */
public class ProjectPostSuccessMessage extends SuccessMessage {
	
	private static final String PROJECT_CREATED_MESSAGE = "project was successfully created";
	
	private Date createdAt;
	private Date updatedAt;

	/**
	 * Constructor
	 * @param id ID of the new project resource
	 * @param createdAt Date of creation
	 * @param updatedAt Date of update (roughly the same as createdAt)
	 */
	public ProjectPostSuccessMessage(Long id, Date createdAt, Date updatedAt) {
		super(PROJECT_CREATED_MESSAGE, id);
		this.setCreatedAt(createdAt);
		this.setUpdatedAt(updatedAt);
	}

	/**
	 * Returns update time
	 * @return Update date
	 */
	public Date getUpdatedAt() {
		return updatedAt;
	}

	/**
	 * Changes update date
	 * @param updatedAt Update date
	 */
	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}

	/**
	 * Returns project creation date
	 * @return Creation date
	 */
	public Date getCreatedAt() {
		return createdAt;
	}

	/**
	 * Changes creation date
	 * @param createdAt Creation timestamp
	 */
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

}
