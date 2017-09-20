package util;

/**
 * This interface marks class as a sanitazable.
 * That means you can call sanitize when you want to
 * make sure all parameters are in the correct form.
 * When something is wrong, this function should throw
 * BadParameterException. It will be catched by exception
 * mapper and mapped to the 400 Bad Request response.
 * @author kdrzazga
 *
 */
public interface Sanitizable {
	
	/**
	 * Call it when you want to make sure all data are right
	 */
	void sanitize();

}
