package bean;

public interface Sanitizable {
	
	void sanitizeForDbCreate();
	void sanitizeForDbUpdate();

}
