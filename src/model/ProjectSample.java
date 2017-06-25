package model;
public class ProjectSample {
	public ProjectSample(String resource, double gain, double position, double start, double duration) {
		this.resource = resource;
		this.gain = gain;
		this.position = position;
		this.start = start;
		this.duration = duration;
	}
	//public int id;
	public String resource;
	public double gain;
	public double position;
	public double start;
	public double duration;
}