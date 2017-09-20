package util;


/**
 * Interface that is used as a marker that class is
 * able to produce custom response to the client
 * e.g. in case when you want to have different JSON
 * schema returned.
 * 
 * @author kdrzazga
 *
 */
public interface ResponsePreparable {
	
	/**
	 * Creates new object, that could be easily
	 * customized to the desired JSON format.
	 * @return Prepared object
	 */
	Object prepareForResponse();

}
