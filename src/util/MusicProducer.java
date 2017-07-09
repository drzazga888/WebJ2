package util;

import java.io.File;
import java.io.IOException;

import bean.Project;
import bean.ProjectSample;
import net.beadsproject.beads.core.AudioContext;
import net.beadsproject.beads.core.Bead;
import net.beadsproject.beads.core.UGen;
import net.beadsproject.beads.data.Sample;
import net.beadsproject.beads.ugens.Envelope;
import net.beadsproject.beads.ugens.Gain;
import net.beadsproject.beads.ugens.SamplePlayer;
import net.beadsproject.beads.ugens.GranularSamplePlayer;
import net.beadsproject.beads.ugens.RecordToSample;


public class MusicProducer {
	
	protected Project project;
	protected static String SAMPLES_LOCATION = "resources/samples/";
	protected static String PRODUCT_OUTPUT = "temp/result.wav";
	
	public MusicProducer(Project project) {
		this.project = project;
	}
	
	public void record(final AudioContext ac, UGen input) throws IOException {
		
		final Sample s = new Sample(project.duration * 1000); 
		RecordToSample rts = new RecordToSample(ac, s, RecordToSample.Mode.FINITE);
		ac.out.addDependent(rts);
		rts.addInput(input);
		rts.setKillListener(new Bead() {
			public void messageReceived(Bead message) {
				try {
					s.write(PRODUCT_OUTPUT);
				} catch (IOException e) {
					e.printStackTrace();
				}
				ac.stop();
			}
		});
		ac.runNonRealTime();

	}
	
	public void createFromProject() throws IOException {
			
		final AudioContext ac = new AudioContext();
		
		Gain masterGain = new Gain(ac, project.samples.length, (float) 0.5);
		
		for (ProjectSample mysample : project.samples) {
	
			SamplePlayer gsp = new GranularSamplePlayer(ac, new Sample(SAMPLES_LOCATION + mysample.resource));
			gsp.setLoopType(SamplePlayer.LoopType.LOOP_FORWARDS);
			gsp.setPosition((mysample.start + mysample.position) * 1000);
			
			Envelope env = new Envelope(ac, 0);
			env.addSegment(0, (float) (mysample.start * 1000));
			env.addSegment((float) mysample.gain, 0);
			env.addSegment((float) mysample.gain, (float) (mysample.duration * 1000));
			env.addSegment(0, 0);
			
			Gain g = new Gain(ac, 1, env);
			g.addInput(gsp);
			
			masterGain.addInput(g);
			
		}
		
		record(ac, masterGain);
		
	}
	
	public File getResult() {
		return new File(PRODUCT_OUTPUT);
	}

}
	