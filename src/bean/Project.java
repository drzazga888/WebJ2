package bean;
public class Project {
	
	public Project(ProjectSample[] samples, double duration, String name) {
		this.samples = samples;
		this.duration = duration;
		this.name = name;
	}
	
	public ProjectSample[] samples;
	public double duration;
	public String name;
}