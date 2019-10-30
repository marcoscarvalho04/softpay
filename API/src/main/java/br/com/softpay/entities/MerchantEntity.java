package br.com.softpay.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="Merchant")
@Getter
@Setter

public class MerchantEntity {
	
	@Id
	@Column(name="merchantId")
	private String merchantId; 
	
	@Column(name="CNPJ", nullable = false)
	private String CNPJ; 
	
	@Column(name="SocialName", nullable = false)
	private String socialName; 
	
	@Column(name="OpeningDate", nullable = false)
	private Date openingDate; 
	
	@Column(name="FantasyName", nullable = false)
	private String fantasyName; 
	
	@Column(name="Address", nullable = false)
	private String address; 
	
	@Column(name="AddressComplement")
	private String addressComplement; 
	
	@Column(name="AddressCity", nullable = false)
	private String addressCity; 
	
	@Column(name="AddressUf", nullable = false)
	private String addressUf; 

	@Column(name="email",nullable = false, unique = true)
	private String email; 
	
	@Column(name="password",nullable = false)
	private String password; 
	
	@Column(name="cash",nullable = false)
	private double cash; 
	
}
