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
	
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
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
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<Track> getTracks() {
		return tracks;
	}
	public void setTracks(List<Track> tracks) {
		this.tracks = tracks;
	}
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	public Date getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public Float getDuration() {
		return duration;
	}
	public void setDuration(Float duration) {
		this.duration = duration;
	}
	
	public int countSamples() {
		int n = 0;
		for (Track track : getTracks()) {
			n += track.getSamples().size();
		}
		return n;
	}
	
	public String resultPath() {
		return id != null ? "./projects/" + id + ".wav" : null;
	}
	
	public void deleteAudioFile() {
		File audioFile = new File(resultPath());
		audioFile.delete();
	}
	
	@Override
	public String toString() {
		return String.format(
				"Project(id=%d, name=%s, tracks=%d, createdAt=%s, updatedAt=%s)",
				id, name, tracks != null ? tracks.size() : null, createdAt, updatedAt
		);
	}
	
	@Override
	public void sanitize() {
		if (name == null || name.length() == 0) {
			throw new BadParameterException("name must be provided");
		}
		if (name.length() > MAX_PROJECT_NAME_LENGTH) {
			throw new BadParameterException("max length of name is " + MAX_PROJECT_NAME_LENGTH);
		}
	}
	
	public void deepSanitize() {
		sanitize();
		for (Track track : tracks) {
			track.sanitize();
		}
	}
	
	public Project prepareForResponse() {
		Project project = new Project();
		project.setId(id);
		project.setName(name);
		project.setCreatedAt(createdAt);
		project.setUpdatedAt(updatedAt);
		project.setDuration(computeDuration());
		return project;
	}
	
	public Object prepareForExtendedResponse() {
		Project project = new Project();
		project.setName(name);
		project.setCreatedAt(createdAt);
		project.setUpdatedAt(updatedAt);
		project.setTracks(tracks.stream().map(a -> a.prepareForResponse()).collect(Collectors.toCollection(ArrayList<Track>::new)));
		return project;
	}
	
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