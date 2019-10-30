package br.com.softpay.controllers;

import java.util.UUID;
import java.util.logging.Level;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.softpay.entities.MerchantEntity;
import br.com.softpay.repositories.MerchantRepository;
import br.com.softpay.util.LogUtils;
import br.com.softpay.util.Validador;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@RestController

public class MerchantController {
	
	@Autowired
	private MerchantRepository merchantRepository; 
	
	@ApiOperation(value = "Retorna um estabelecimento específico")
	@ApiResponses(value = {
			@ApiResponse (code =  200 , message = "Retorna com sucesso um estabelecimento"),
			@ApiResponse (code =  404,  message = "Estabelecimento não existe e deve ser cadastrado!"),
			@ApiResponse( code =  500 , message = "Um erro interno específico interrompeu a pesquisa do estabelecimento!")
			
	})
	@GetMapping(value="/merchant/{merchantId}")
	public ResponseEntity<Object> get(@PathVariable(value="merchantId") String merchantId){
		if(Validador.isEmptyOrNull(merchantId)) {
			return new ResponseEntity<Object>("MerchantId deve ser devidamente preenchido!",HttpStatus.BAD_REQUEST);
		}
		try {
			LogUtils.logar(Level.FINE,("Consultado: ".concat(merchantId)));
			return merchantRepository.existsById(merchantId) ? new ResponseEntity<Object>(merchantRepository.findById(merchantId).get(),HttpStatus.OK) : new ResponseEntity<Object>(HttpStatus.NOT_FOUND); 
		}catch(Exception e) {
			LogUtils.logar(Level.SEVERE, e.getStackTrace());
			return new ResponseEntity<Object>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
	@ApiOperation(value = "Cadastra um estabelecimento. Atenção a todos os campos obrigatórios!")
	@ApiResponses(value = {
			@ApiResponse(code = 200 , message= "Cadastro concluído com sucesso!"),
			@ApiResponse(code = 400,  message = "Sua requisição falhou. Verificar todos os campos obrigatórios ou verificar se este estabelecimento já não existe!"),
			@ApiResponse(code = 500,  message = "Erro interno ao cadastrar o estabelecimento!")
	})
	@PostMapping(value="/merchant")
	public ResponseEntity<Object> addMerchant(@RequestBody MerchantEntity merchantEntity){
		try {
			if(Validador.isEmptyOrNull(merchantEntity.getMerchantId())) {
				merchantEntity.setMerchantId(UUID.randomUUID().toString());
			}
			if(Validador.isEmptyOrNull(merchantEntity.getCNPJ())) {
				return new ResponseEntity<Object>("CNPJ deve ser preenchido corretamente!",HttpStatus.BAD_REQUEST);
			}
			if(Validador.isEmptyOrNull(merchantEntity.getSocialName())) {
				return new ResponseEntity<Object>("Razão social deve ser preenchida!",HttpStatus.BAD_REQUEST);
			}
			if(Validador.isEmptyOrNull(merchantEntity.getFantasyName())) {
				return new ResponseEntity<Object>("Nome fantasia deve ser preenchido!",HttpStatus.BAD_REQUEST);
			}
			if(Validador.isEmptyOrNull(merchantEntity.getAddress())) {
				return new ResponseEntity<Object>("Endereço deve ser preenchido!",HttpStatus.BAD_REQUEST);
			}
			if(Validador.isEmptyOrNull(merchantEntity.getAddressCity())) {
				return new ResponseEntity<Object>("Cidade do endereço deve ser informada!",HttpStatus.BAD_REQUEST);
			}
			if(Validador.isEmptyOrNull(merchantEntity.getAddressUf())) {
				return new ResponseEntity<Object>("UF do endereço deve ser informada!",HttpStatus.BAD_REQUEST);
			}
			if(Validador.isEmptyOrNull(merchantEntity.getEmail())) {
				return new ResponseEntity<Object>("Email deve ser informado!",HttpStatus.BAD_REQUEST);
			}
			if(Validador.isEmptyOrNull(merchantEntity.getPassword())) {
				return new ResponseEntity<Object>("Senha deve ser informada!",HttpStatus.BAD_REQUEST);
			}
			if(!Validador.isGreaterOrEqualsZero(merchantEntity.getCash())) {
				merchantEntity.setCash(0); // deve ser maior do que ou igual a 0. Nunca menor. 
			}
			if(Validador.isObjectNull(merchantEntity.getOpeningDate())) {
				return new ResponseEntity<Object>("Data de abertura da empresa deve ser informada!",HttpStatus.BAD_REQUEST);
			}
			if(merchantEntity.getAddressUf().length() > 2) {
				return new ResponseEntity<Object>("UF deve conter apenas dois caracteres!",HttpStatus.BAD_REQUEST);
			}
			
			if(merchantRepository.existsByCNPJ(merchantEntity.getCNPJ())) {
				LogUtils.logar(Level.FINE, "CNPJ: ".concat(merchantEntity.getCNPJ()).concat(" já existe na base!"));
				return new ResponseEntity<Object>("CNPJ: ".concat(merchantEntity.getCNPJ()).concat(" já existe na base!"),HttpStatus.BAD_REQUEST);
			}
			if(merchantRepository.existsById(merchantEntity.getMerchantId())) {
				LogUtils.logar(Level.FINE, "ID: ".concat(merchantEntity.getMerchantId()).concat(" já existe na base!"));
				return new ResponseEntity<Object>("ID: ".concat(merchantEntity.getMerchantId()).concat(" já existe na base!"),HttpStatus.BAD_REQUEST);
			}
			if(merchantRepository.existsByEmail(merchantEntity.getEmail())) {
				LogUtils.logar(Level.FINE, "Email: ".concat(merchantEntity.getEmail()).concat(" já existe na base!"));
				return new ResponseEntity<Object>("Email: ".concat(merchantEntity.getEmail()).concat(" já existe na base!"),HttpStatus.BAD_REQUEST);
			}
			
			
			// validações terminadas, salvar. 
			
			merchantRepository.save(merchantEntity);
			return new ResponseEntity<Object>(merchantEntity, HttpStatus.OK);
		}catch(Exception e) {
			LogUtils.logar(Level.SEVERE, e.getStackTrace());
			return new ResponseEntity<Object>("Erro interno ao processar a requisição!",HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		 
	}

}
