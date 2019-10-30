package br.com.softpay.util;

import java.util.logging.Level;

@lombok.extern.java.Log
public class LogUtils {

	public static void logar(Level level, StackTraceElement[] elements) {
		for(StackTraceElement element: elements) { 
			log.log(level, element.toString());
		}
	}
	
	public static void logar(Level level, String message) {
		log.log(level,message);
	}
	
}
