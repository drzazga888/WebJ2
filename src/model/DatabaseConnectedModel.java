package model;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

public abstract class DatabaseConnectedModel {

	protected EntityManagerFactory entityManagerFactory =  Persistence.createEntityManagerFactory("testjpa");
	protected EntityManager em = entityManagerFactory.createEntityManager();
	protected EntityTransaction userTransaction = em.getTransaction();
	
	public void update(Object object) {
	    userTransaction.begin();
	    em.persist(object);
	    userTransaction.commit();
	    em.close();
	    entityManagerFactory.close();
	}

}
