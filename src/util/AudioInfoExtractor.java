package util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import net.beadsproject.beads.analysis.SegmentListener;
import net.beadsproject.beads.analysis.featureextractors.Power;
import net.beadsproject.beads.analysis.segmenters.ShortFrameSegmenter;
import net.beadsproject.beads.core.AudioContext;
import net.beadsproject.beads.core.TimeStamp;
import net.beadsproject.beads.core.io.NonrealtimeIO;
import net.beadsproject.beads.data.Sample;
import net.beadsproject.beads.ugens.SamplePlayer;

import net.beadsproject.beads.events.AudioContextStopTrigger;

/**
 * This class is able to extract array of amplitudes over time and durations
 * of the provided audio. It's generally better for performance if extractor will
 * be called once for results (and than save then to the DB) instead of calling methods
 * on every request.
 * 
 * @author kdrzazga
 *
 */
public class AudioInfoExtractor {
	
	private final int CHUNK_AND_HOP_SIZE = 1024;
	
	private Sample sample;

	/**
	 * Class (only) constructor
	 * @param filename Path to the audio file you want to process
	 * @throws IOException Exception thrown when file cannot be opened
	 */
	public AudioInfoExtractor(String filename) throws IOException {
		this.sample = new Sample(filename);
	}
	
	/**
	 * Method that returns length of the audio
	 * @return Length of the audio
	 */
	public double getLength() {
		return sample.getLength() / 1000;
	}
	
	private ShortFrameSegmenter getSegmentator(AudioContext ac) {
		ShortFrameSegmenter sfs = new ShortFrameSegmenter(ac);
		sfs.setChunkSize(CHUNK_AND_HOP_SIZE);
		sfs.setHopSize(CHUNK_AND_HOP_SIZE);
		return sfs;
	}
	
	/**
	 * Computes amplitude over time. It's based on the segmentator that
	 * cuts audio data to smaller pieces, that can be processed individually
	 * to get RMS.
	 * @return RMS of all chunk'ed audio data
	 */
	public float[] getRmsOverTime() {
		AudioContext ac = new AudioContext(new NonrealtimeIO());
		
		ShortFrameSegmenter sfs = getSegmentator(ac);
		sfs.addInput(ac.out);
		ac.out.addDependent(sfs);
		
		SamplePlayer sp = new SamplePlayer(ac, sample);
		sp.setEndListener(new AudioContextStopTrigger(ac));
		ac.out.addInput(sp);

		Power pow = new Power();
		sfs.addListener(pow);
		
		List<Float> powerOverTime = new ArrayList<Float>();

		sfs.addSegmentListener(new SegmentListener() {
		    @Override
		    public void newSegment(TimeStamp timeStamp, TimeStamp timeStamp1) {
		    	powerOverTime.add(pow.getFeatures());
		    }
		});
		
		ac.runNonRealTime();
		int i = 0;
		
		float[] floats = new float[powerOverTime.size()];
		for (Float f : powerOverTime) {
			floats[i++] = f;
		}
		
		return floats;
	}

}
