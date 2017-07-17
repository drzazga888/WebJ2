package util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import net.beadsproject.beads.analysis.SegmentListener;
import net.beadsproject.beads.analysis.featureextractors.Power;
import net.beadsproject.beads.analysis.segmenters.ShortFrameSegmenter;
import net.beadsproject.beads.core.AudioContext;
import net.beadsproject.beads.core.TimeStamp;
import net.beadsproject.beads.data.Sample;
import net.beadsproject.beads.ugens.SamplePlayer;

import net.beadsproject.beads.events.AudioContextStopTrigger;

public class RmsPowerOverTime {
	
	private String filename;

	public RmsPowerOverTime(String filename) {
		this.filename = filename;
	}
	
	public float[] generate() {
		try {

			AudioContext ac = new AudioContext();
			
			ShortFrameSegmenter sfs = new ShortFrameSegmenter(ac);
			sfs.addInput(ac.out);
			ac.out.addDependent(sfs);
			
			SamplePlayer sp = new SamplePlayer(ac, new Sample(filename));
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
									
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

}
