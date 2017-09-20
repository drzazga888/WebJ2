package exceptionMapper;

import javax.sound.sampled.UnsupportedAudioFileException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;

import bean.ErrorMessage;

/**
 * Maps UnsupportedAudioFileException to UNSUPPORTED_MEDIA_TYPE response
 * @author kdrzazga
 *
 */
public class UnsupportedAudioFileMapper implements ExceptionMapper<UnsupportedAudioFileException> {
	
	private final static String UNSUPPOETED_AUDIO_DESCRIPTION = "audio file is not supported";

	/**
	 * Returns UNSUPPORTED_MEDIA_TYPE error with information that wav file is only allowed
	 */
	@Override
	public Response toResponse(UnsupportedAudioFileException arg0) {
		return Response
				.status(Status.UNSUPPORTED_MEDIA_TYPE)
				.entity(new ErrorMessage(UNSUPPOETED_AUDIO_DESCRIPTION))
				.type(MediaType.APPLICATION_JSON)
				.build();
	}

}
