package bean;

import java.util.Date;

/**
 * Represents project partial update (patch) response object
 * @author kdrzazga
 *
 */
public class ProjectPatchSuccessMessage extends SuccessMessage {
	
	private static final String PROJECT_UPDATED_MESSAGE = "project was successfully updated";
	
	private Date updatedAt;

	/**
	 * Constructor
	 * @param updatedAt Date of the modifications
	 */
	public ProjectPatchSuccessMessage(Date updatedAt) {
		super(PROJECT_UPDATED_MESSAGE, null);
		this.setUpdatedAt(updatedAt);
	}

	/**
	 * Return updates date
	 * @return Updates date
	 */
	public Date getUpdatedAt() {
		return updatedAt;
	}

	/**
	 * Changes updates date
	 * @param updatedAt Updated timestamp
	 */
	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}

}
