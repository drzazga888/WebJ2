package filter;

import javax.enterprise.context.RequestScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@RequestScoped
public class EntityManagerProvider {

	@PersistenceContext(name = "WebJ2")
    private EntityManager entityManager;

    public EntityManager get() {
        return entityManager;
    }

}