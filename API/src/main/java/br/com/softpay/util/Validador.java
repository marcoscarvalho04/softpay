package br.com.softpay.util;

public class Validador {
	
	public static boolean isEmptyOrNull(String validate) {
		return (validate == null || validate.isEmpty()) ? true : false; 
	}
	
	public static boolean isGreaterOrEqualsZero(double number) {
		return number >= 0 ? true: false; 
	}
	
	public static boolean isObjectNull(Object object) {
		return object == null? true:false; 
	}

}
