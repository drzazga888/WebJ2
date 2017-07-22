package bean;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

@Entity
public class Project {
	
	private static final int MAX_PROJECT_NAME_LENGTH = 40;

	@Id
	@GeneratedValue
	private Long id;
	
	@Column(length = MAX_PROJECT_NAME_LENGTH, nullable = false)
	private String name;
	
	@OneToMany(fetch = FetchType.EAGER)
	private List<Track> tracks;
	
	@Column(nullable = false)
	private Date createdAt;
	
	@Column(nullable = false)
	private Date updatedAt;
	
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	private User user;
	
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
	
	public int countSamples() {
		int n = 0;
		for (Track track : getTracks()) {
			n += track.getSamples().size();
		}
		return n;
	}
	
	public String getResultPath() {
		return id != null ? "./projects/" + id + ".wav" : null;
	}
	
}