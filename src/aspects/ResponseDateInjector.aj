package aspects;

import bean.SuccessMessage;

import java.text.SimpleDateFormat;
import java.util.Date;

import bean.ErrorMessage;
import bean.SuccessMessage;

public aspect ResponseDateInjector {
	
	private String injectDate(String msg) {
		return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(new Date()) + ": " + msg;
	}
	
	pointcut errorMessagePointcut(ErrorMessage msg): target(msg) && execution(ErrorMessage.new(String));
	
	pointcut successMessagePointcut(SuccessMessage msg): target(msg) && execution(SuccessMessage.new(String, Long));

	after(ErrorMessage msg): errorMessagePointcut(msg) {
		msg.setError(injectDate(msg.getError()));
	}
	
	after(SuccessMessage msg): successMessagePointcut(msg) {
		msg.setMessage(injectDate(msg.getMessage()));
	}

}
