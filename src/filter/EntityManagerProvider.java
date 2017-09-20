package filter;

import javax.enterprise.context.RequestScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Used in application-based entities to
 * inject request-based EntityManager to the object
 * @author kdrzazga
 *
 */
@RequestScoped
public class EntityManagerProvider {

	@PersistenceContext(name = "WebJ2")
    private EntityManager entityManager;

	/**
	 * Provides EntityManager for DB connection
	 * @return Entity manager
	 */
    public EntityManager get() {
        return entityManager;
    }

}