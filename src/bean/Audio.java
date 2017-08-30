package bean;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Base64;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import javax.ws.rs.InternalServerErrorException;

import exception.BadParameterException;
import util.ResponsePreparable;
import util.Sanitizable;

@Entity
@NamedQueries({
	@NamedQuery(name = "Audio.getByUser", query = "SELECT a FROM Audio a WHERE a.user.id = :id"),
	@NamedQuery(name = "Audio.getByUserAndName", query = "SELECT a FROM Audio a WHERE a.user.id = :id and a.name = :name")
})
@Table(uniqueConstraints={ @UniqueConstraint(columnNames={"user_id", "name"}) })
public class Audio implements Sanitizable, ResponsePreparable {
	
	private static final int MAX_NAME_LENGTH = 40;
	private static final String AUDIO_FILES_FOLDER = "./audios/";
	private static final String TEMP_AUDIO_FILE_POSTFIX = "_temp";
	private static final String AUDIO_EXTENSION = "wav";

	@Id
	@GeneratedValue
	private Long id;
	
	@Column(name = "name", length = MAX_NAME_LENGTH, nullable = false)
	private String name;
	
	@Column
	private double length;

	@Column(nullable = true)
	private float[] amplitudeOverTime;
	
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;
	
	@Transient
	private String base64StringAudio;
	
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
	public double getLength() {
		return length;
	}
	public void setLength(double length) {
		this.length = length;
	}
	public float[] getAmplitudeOverTime() {
		return amplitudeOverTime;
	}
	public void setAmplitudeOverTime(float[] amplitudeOverTime) {
		this.amplitudeOverTime = amplitudeOverTime;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public String getBase64StringAudio() {
		return base64StringAudio;
	}
	public void setBase64StringAudio(String base64StringAudio) {
		this.base64StringAudio = base64StringAudio;
	}
	
	@Override
	public String toString() {
		return String.format("Audio(id=%d, name=%s, available=%s)", id, name, amplitudeOverTime != null ? "yes" : "no");
	}
	
	@Override
	public void sanitize() {
		if (name == null || name.length() == 0) {
			throw new BadParameterException("name must be provided");
		}
		if (name.length() > MAX_NAME_LENGTH) {
			throw new BadParameterException("max length of name is " + MAX_NAME_LENGTH);
		}
	}
	
	@Override
	public Object prepareForResponse() {
		Audio audio = new Audio();
		audio.setId(id);
		audio.setName(name);
		audio.setAmplitudeOverTime(amplitudeOverTime);
		audio.setLength(length);
		return audio;
	}
	
	public String audioIdPath() {
		return id != null ? (AUDIO_FILES_FOLDER + id + "." + AUDIO_EXTENSION) : null;
	}
	
	public String audioTempPath() {
		return user != null ? (AUDIO_FILES_FOLDER + user.getEmail() + TEMP_AUDIO_FILE_POSTFIX + "." + AUDIO_EXTENSION) : null;
	}
	
	public String audioAttachmentName() {
		return name + "." + AUDIO_EXTENSION;
	}
	
	public void deleteAudioFile() {
		File target = new File(audioIdPath());
		target.delete();
	}
	
	public void assignIdToTempAudioFile() {
		Path source = FileSystems.getDefault().getPath(audioTempPath());
		Path target = FileSystems.getDefault().getPath(audioIdPath());
		try {
			Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			e.printStackTrace();
			throw new InternalServerErrorException();
		}
	}
	
	public void saveBase64AudioStringToTempFile() {
		byte[] decoded = Base64.getDecoder().decode(base64StringAudio);
		try (FileOutputStream fos = new FileOutputStream(audioTempPath())) {
			fos.write(decoded);
		} catch (IOException e) {
			e.printStackTrace();
			throw new InternalServerErrorException();
		}
	}
		
}
