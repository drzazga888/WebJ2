package bean;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

import exception.BadParameterException;
import util.Sanitizable;

/**
 * JPA entity that holds song project details
 * @author kdrzazga
 *
 */
@Entity
@NamedQueries({
	@NamedQuery(name = "Project.getByUser", query = "SELECT p FROM Project p WHERE p.user.id = :id"),
	@NamedQuery(name = "Project.getByUserAndName", query = "SELECT p FROM Project p WHERE p.user.id = :id AND p.name = :name")
})
@Table(uniqueConstraints={ @UniqueConstraint(columnNames={"user_id", "name"}) })
public class Project implements Sanitizable {
	
	private static final int MAX_PROJECT_NAME_LENGTH = 40;

	@Id
	@GeneratedValue
	private Long id;
	
	@Column(name = "name", length = MAX_PROJECT_NAME_LENGTH, nullable = false)
	private String name;
	
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
	private List<Track> tracks;
	
	@Column(nullable = false)
	private Date createdAt;
	
	@Column(nullable = false)
	private Date updatedAt;
	
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;
	
	@Transient
	private Float duration;
	
	/**
	 * Project ID getter
	 * @return Project ID
	 */
	public Long getId() {
		return id;
	}
	
	/**
	 * Project ID setter
	 * @param id Project ID
	 */
	public void setId(Long id) {
		this.id = id;
	}
	
	/**
	 * Project name getter
	 * @return Project name
	 */
	public String getName() {
		return name;
	}
	
	/**
	 * Changes project name
	 * @param name New project name
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * Returns list of tracks that belogs to the project
	 * @return List of tracks
	 */
	public List<Track> getTracks() {
		return tracks;
	}
	
	/**
	 * Allows to set new list of tracks
	 * @param tracks List of tracks
	 */
	public void setTracks(List<Track> tracks) {
		this.tracks = tracks;
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
	 * @param createdAt Creation date
	 */
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	
	/**
	 * Getter of project update timestamp
	 * @return Update date
	 */
	public Date getUpdatedAt() {
		return updatedAt;
	}
	
	/**
	 * Setter ot the project update date
	 * @param updatedAt New update date
	 */
	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}
	
	/**
	 * Reurns user that is connected to the project
	 * @return User JPA object if connected
	 */
	public User getUser() {
		return user;
	}
	
	/**
	 * This method allows to replace user of this project 
	 * @param user New user object
	 */
	public void setUser(User user) {
		this.user = user;
	}
	
	/**
	 * Allows to set new duration (in seconds) of the project,
	 * it's not persistant, only generated when need
	 * to return JSON request with this info
	 * @return Duration of the project song
	 */
	public Float getDuration() {
		return duration;
	}
	
	/**
	 * Sets new project duration (in seconds). This field is
	 * transient so it will be not persisted to the DB
	 * @param duration New duratuon of the project song
	 */
	public void setDuration(Float duration) {
		this.duration = duration;
	}
	
	/**
	 * Counts all of the samples that belongs to the project.
	 * @return Count of samples entries
	 */
	public int countSamples() {
		int n = 0;
		for (Track track : getTracks()) {
			n += track.getSamples().size();
		}
		return n;
	}
	
	/**
	 * Returns path to the result project song
	 * @return
	 */
	public String resultPath() {
		return id != null ? "./projects/" + id + ".wav" : null;
	}
	
	/**
	 * Deletes all temp project songs
	 */
	public void deleteAudioFile() {
		File audioFile = new File(resultPath());
		audioFile.delete();
	}
	
	/**
	 * Convert object ot string (for debug)
	 */
	@Override
	public String toString() {
		return String.format(
				"Project(id=%d, name=%s, tracks=%d, createdAt=%s, updatedAt=%s)",
				id, name, tracks != null ? tracks.size() : null, createdAt, updatedAt
		);
	}
	
	/**
	 * Goes through all constrained fields and does validation.
	 * On error BadParameterException with appropriate error is throwed.
	 */
	@Override
	public void sanitize() {
		if (name == null || name.length() == 0) {
			throw new BadParameterException("name must be provided");
		}
		if (name.length() > MAX_PROJECT_NAME_LENGTH) {
			throw new BadParameterException("max length of name is " + MAX_PROJECT_NAME_LENGTH);
		}
	}
	
	/**
	 * Does the same as sanitize(), but also goes deeper to the tracks and sanmples
	 */
	public void deepSanitize() {
		sanitize();
		for (Track track : tracks) {
			track.sanitize();
		}
	}
	
	/**
	 * Creates payload for project list (not detailed information)
	 * @return Object that could be used as entry in list response
	 */
	public Project prepareForResponse() {
		Project project = new Project();
		project.setId(id);
		project.setName(name);
		project.setCreatedAt(createdAt);
		project.setUpdatedAt(updatedAt);
		project.setDuration(computeDuration());
		return project;
	}
	
	/**
	 * Creates extended object with information, contains also tracks and samples.
	 * @return Object that could be used as response
	 */
	public Object prepareForExtendedResponse() {
		Project project = new Project();
		project.setName(name);
		project.setCreatedAt(createdAt);
		project.setUpdatedAt(updatedAt);
		project.setTracks(tracks.stream().map(a -> a.prepareForResponse()).collect(Collectors.toCollection(ArrayList<Track>::new)));
		return project;
	}
	
	/**
	 * Computes song duration of the project
	 * @return Duration of the project
	 */
	public float computeDuration() {
		float duration = 0;
		for (Track track : getTracks()) {
			for (bean.Sample sample : track.getSamples()) {
				float end = sample.getDuration() + sample.getStart();
				if (end > duration) {
					duration = end;
				}
			}
		}
		return duration;
	}
	
}