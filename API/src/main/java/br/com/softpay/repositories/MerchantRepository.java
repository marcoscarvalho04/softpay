package br.com.softpay.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.softpay.entities.MerchantEntity;

public interface MerchantRepository extends CrudRepository<MerchantEntity,String> {
	
	public List<MerchantEntity> findByCNPJ(String CNPJ); 
	
	public List<MerchantEntity> findByEmail(String email);
	
	public boolean existsByCNPJ(String CNPJ);
	
	public boolean existsByEmail(String Email);
}
