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

/**
 * JPA entity that maps audio details to the DB
 * @author kdrzazga
 *
 */
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
	
	/**
	 * Audio ID getter
	 * @return ID of the audio
	 */
	public Long getId() {
		return id;
	}
	
	/**
	 * Audio ID setter
	 * @param id ID of the audio
	 */
	public void setId(Long id) {
		this.id = id;
	}
	
	/**
	 * Audio name setter
	 * @return Name
	 */
	public String getName() {
		return name;
	}
	
	/**
	 * Audio name getter
	 * @param name Audio name
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * Audio length getter
	 * @return Duration of the audio
	 */
	public double getLength() {
		return length;
	}
	
	/**
	 * Audio length setter
	 * @param length Audio duration
	 */
	public void setLength(double length) {
		this.length = length;
	}
	
	/**
	 * Audio amplitudes getter
	 * @return Amplitudes of the audio
	 */
	public float[] getAmplitudeOverTime() {
		return amplitudeOverTime;
	}
	
	/**
	 * Audio amplitudes setter
	 * @param amplitudeOverTime Amplitudes of the audio
	 */
	public void setAmplitudeOverTime(float[] amplitudeOverTime) {
		this.amplitudeOverTime = amplitudeOverTime;
	}
	
	/**
	 * Returns audio owner
	 * @return Audio owner
	 */
	public User getUser() {
		return user;
	}
	
	/**
	 * Allows to set audio owner
	 * @param user New audio owner
	 */
	public void setUser(User user) {
		this.user = user;
	}
	
	/**
	 * Returns audio content encoded to base64 string
	 * @return Audio as base64 string
	 */
	public String getBase64StringAudio() {
		return base64StringAudio;
	}
	
	/**
	 * Allows to set audio content (format: base64 string)
	 * @param base64StringAudio Base64 audio string
	 */
	public void setBase64StringAudio(String base64StringAudio) {
		this.base64StringAudio = base64StringAudio;
	}
	
	/**
	 * Returns stringified audio instance
	 */
	@Override
	public String toString() {
		return String.format("Audio(id=%d, name=%s, available=%s)", id, name, amplitudeOverTime != null ? "yes" : "no");
	}
	
	/**
	 * When called, sanitizes all fields and throws BadParameterException on audio fields errors
	 */
	@Override
	public void sanitize() {
		if (name == null || name.length() == 0) {
			throw new BadParameterException("name must be provided");
		}
		if (name.length() > MAX_NAME_LENGTH) {
			throw new BadParameterException("max length of name is " + MAX_NAME_LENGTH);
		}
	}
	
	/**
	 * It could be used to create JSON detail response, without unnecessary user field and contents
	 */
	@Override
	public Object prepareForResponse() {
		Audio audio = new Audio();
		audio.setId(id);
		audio.setName(name);
		audio.setAmplitudeOverTime(amplitudeOverTime);
		audio.setLength(length);
		return audio;
	}
	
	/**
	 * Returns possible path to the saved audio
	 * @return Path to audio file
	 */
	public String audioIdPath() {
		return id != null ? (AUDIO_FILES_FOLDER + id + "." + AUDIO_EXTENSION) : null;
	}
	
	/**
	 * Returns path to the possible temporary audio file
	 * @return Path to temporary file
	 */
	public String audioTempPath() {
		return user != null ? (AUDIO_FILES_FOLDER + user.getEmail() + TEMP_AUDIO_FILE_POSTFIX + "." + AUDIO_EXTENSION) : null;
	}
	
	/**
	 * Produces name of the audio based on the name
	 * @return Name of the audio file
	 */
	public String audioAttachmentName() {
		return name + "." + AUDIO_EXTENSION;
	}
	
	/**
	 * Deletes audio file (if exists)
	 */
	public void deleteAudioFile() {
		File target = new File(audioIdPath());
		target.delete();
	}
	
	
	/**
	 * Renames existing temp audio file to the named one (named by ID)
	 */
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
	
	/**
	 * Converts base64 audio content to the wav representation
	 * and saves it to the temp file
	 */
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
