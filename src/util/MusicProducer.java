package util;

import java.io.File;
import java.io.IOException;

import bean.Project;
import bean.Track;
import net.beadsproject.beads.core.AudioContext;
import net.beadsproject.beads.core.Bead;
import net.beadsproject.beads.core.UGen;
import net.beadsproject.beads.core.io.NonrealtimeIO;
import net.beadsproject.beads.data.Sample;
import net.beadsproject.beads.ugens.Envelope;
import net.beadsproject.beads.ugens.Gain;
import net.beadsproject.beads.ugens.SamplePlayer;
import net.beadsproject.beads.ugens.GranularSamplePlayer;
import net.beadsproject.beads.ugens.RecordToSample;

/**
 * Utility class used for joining project definition
 * and audio files into result song
 * 
 * @author kdrzazga
 *
 */
public class MusicProducer {

	private static float MASTER_GAIN_VALUE = 0.5f;
	
	final private Project project;
	final private AudioContext ac = new AudioContext(new NonrealtimeIO());
	
	
	/**
	 * Constructor
	 * 
	 * @param project Project that will be used as a source of the truth
	 */
	public MusicProducer(Project project) {
		this.project = project;
	}
	
	private void record(final AudioContext ac, UGen input) throws IOException {
		final Sample s = new Sample(project.computeDuration() * 1000); 
		RecordToSample rts = new RecordToSample(ac, s, RecordToSample.Mode.FINITE);
		ac.out.addDependent(rts);
		rts.addInput(input);
		rts.setKillListener(new Bead() {
			public void messageReceived(Bead message) {
				try {
					s.write(project.resultPath());
				} catch (IOException e) {
					e.printStackTrace();
				}
				ac.stop();
			}
		});
		ac.runNonRealTime();
	}
	
	private Gain prepareSampleGain(final bean.Sample sample) throws IOException {
		SamplePlayer gsp = new GranularSamplePlayer(ac, new Sample(sample.getAudio().audioIdPath()));
		gsp.setLoopType(SamplePlayer.LoopType.LOOP_FORWARDS);
		gsp.setPosition((sample.getStart() + sample.getOffset()) * 1000);
		Envelope env = new Envelope(ac, 0);
		env.addSegment(0, (float) (sample.getStart() * 1000));
		env.addSegment((float) sample.getGain(), 0);
		env.addSegment((float) sample.getGain(), (float) (sample.getDuration() * 1000));
		env.addSegment(0, 0);
		Gain g = new Gain(ac, 1, env);
		g.addInput(gsp);
		return g;
	}
	
	/**
	 * Produces audio and saves it to the file
	 * @throws IOException Thrown when audio files are corrupted or blocked
	 */
	public void createFromProject() throws IOException {
		Gain masterGain = new Gain(ac, project.countSamples(), MASTER_GAIN_VALUE);
		for (Track track : project.getTracks()) {
			Gain trackGain = new Gain(ac, track.getSamples().size(), track.getGain());
			for (bean.Sample sample : track.getSamples()) {
				trackGain.addInput(prepareSampleGain(sample));
			}
			masterGain.addInput(trackGain);
		}
		record(ac, masterGain);
	}
	
	/**
	 * Returns audio as a File
	 * @return Audio file
	 */
	public File getResult() {
		return new File(project.resultPath());
	}

}
	