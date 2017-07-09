package api;
import java.util.Set;
 
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
 
@ApplicationPath("api")
public class RestInit extends Application {
     
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        resources.add(BadParameterMapper.class);
        resources.add(UserAlreadyExistsMapper.class);
        resources.add(UserController.class);
        resources.add(ProjectController.class);
        return resources;
    }
 
}