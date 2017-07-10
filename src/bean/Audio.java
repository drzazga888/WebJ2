package bean;

public class Audio {
	
	private int id;
	private String name;
	private double[] amplitudeOverTime;
	private boolean available;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public double[] getAmplitudeOverTime() {
		return amplitudeOverTime;
	}
	public void setAmplitudeOverTime(double[] amplitudeOverTime) {
		this.amplitudeOverTime = amplitudeOverTime;
	}
	public boolean isAvailable() {
		return available;
	}
	public void setAvailable(boolean available) {
		this.available = available;
	}
	
	@Override
	public String toString() {
		return String.format("Audio(id=%d, name=%s, available=%s)", id, name, available ? "yes" : "no");
	}
	
}
