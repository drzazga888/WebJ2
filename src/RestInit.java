import java.util.Arrays;
import java.util.Set;
 
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

import controller.AudioController;
import controller.ProjectController;
import controller.UserController;
import exceptionMapper.BadCredentialsMapper;
import exceptionMapper.BadParameterMapper;
import exceptionMapper.UserAlreadyExistsMapper;
import filter.BasicAuthFilter;
 
@ApplicationPath("api")
public class RestInit extends Application {
     
    @Override
    public Set<Class<?>> getClasses() {
        return new java.util.HashSet<Class<?>>(Arrays.asList(
        	BadCredentialsMapper.class,
        	BadParameterMapper.class,
        	UserAlreadyExistsMapper.class,
        	BasicAuthFilter.class,
        	AudioController.class,
        	ProjectController.class,
        	UserController.class
        ));
    }
 
}