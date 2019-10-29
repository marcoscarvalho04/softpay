IF NOT EXISTS (SELECT 1 FROM SYS.databases WHERE NAME = 'SoftPay')
BEGIN 
	CREATE DATABASE SoftPay
END
GO
USE SoftPay
GO


IF EXISTS(SELECT 1 FROM SYS.tables WHERE NAME = 'PaymentOrder') 
BEGIN 
	DROP TABLE PaymentOrder 
END

IF EXISTS (SELECT 1 FROM SYS.TABLES WHERE NAME  = 'Banks') 
BEGIN 
 DROP TABLE Banks;
END

IF EXISTS(SELECT 1 FROM SYS.tables WHERE NAME = 'Merchant') 
BEGIN 
	DROP TABLE Merchant 
END


CREATE TABLE Merchant
	(
		MerchantId VARCHAR(255) NOT NULL PRIMARY KEY, 
		CNPJ VARCHAR(14) NOT NULL, 
		SocialName VARCHAR(200) NOT NULL, 
		OpeningDate DATE NOT NULL, 
		FantasyName VARCHAR(200) NOT NULL, 
		Address VARCHAR(200) NOT NULL, 
		AddressComplement VARCHAR(200), 
		AddressCity VARCHAR(200) NOT NULL, 
		AddressUf VARCHAR(2) NOT NULL,
		Email VARCHAR(255) NOT NULL, 
		Password VARCHAR(255),
		Cash MONEY NOT NULL DEFAULT 0
	)


IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'IX_EMAIL') 
BEGIN 
	DROP INDEX IX_EMAIL ON Merchant
END

CREATE NONCLUSTERED INDEX IX_EMAIL ON Merchant(Email) INCLUDE (Password) 

IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_CATALOG = 'IX_MERCHANTFINDING')
BEGIN 
	DROP INDEX IX_MERCHANTFINDING ON Merchant
END

CREATE NONCLUSTERED INDEX IX_MERCHANTFINDING ON Merchant(CNPJ) INCLUDE (SocialName,FantasyName)

IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK_CASH')
BEGIN
	ALTER TABLE Merchant DROP CONSTRAINT CK_CASH 
END

ALTER TABLE Merchant ADD CONSTRAINT CK_CASH CHECK (CASH >= 0)


CREATE TABLE Banks (
	BankId INT NOT NULL PRIMARY KEY IDENTITY(1,1),
	BankNumber INT NOT NULL, 
	BankCode INT NOT NULL, 
	BankAgency INT NOT NULL, 
	BankAgencyValidation VARCHAR(20) NOT NULL,
	BankType VARCHAR(20) NOT NULL DEFAULT 'Merchant', 
	BankStatus VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
	BankWallet INT NOT NULL DEFAULT 0,
	MerchantId VARCHAR(255) FOREIGN KEY REFERENCES Merchant(MerchantId)
)

IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK_BankType')
BEGIN 
	ALTER TABLE Banks DROP CONSTRAINT CK_BankType
END

ALTER TABLE Banks ADD CONSTRAINT Ck_BankType CHECK (BankType IN ('Merchant','System'))


IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK_BankStatus')
BEGIN 
	ALTER TABLE Banks DROP CONSTRAINT CK_BankStatus
END

ALTER TABLE Banks ADD CONSTRAINT CK_BankStatus CHECK (BankStatus IN ('ACTIVE','DEACTIVE'))

IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_CATALOG = 'IX_MERCHANTID')
BEGIN 
	DROP INDEX IX_MERCHANTID ON Banks
END

CREATE NONCLUSTERED INDEX IX_MERCHANTID ON Banks(MerchantId)


IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_CATALOG = 'IX_FINDINGBANK')
BEGIN 
	DROP INDEX IX_FINDINGBANK ON Banks
END

CREATE NONCLUSTERED INDEX IX_FINDINGBANK ON Banks(BankNumber) INCLUDE(BankAgency,BankCode)

CREATE TABLE PaymentOrder 
(
	PaymentOrder VARCHAR(255) NOT NULL PRIMARY KEY,
	BankId INT NOT NULL FOREIGN KEY REFERENCES Banks(BankId),
	MerchantId VARCHAR(255) NOT NULL FOREIGN KEY REFERENCES Merchant(MerchantId),
	Value MONEY,
	CreateDate SMALLDATETIME NOT NULL, 
	ValidDate SMALLDATETIME NOT NULL, 
	PaymentStatus VARCHAR(30) NOT NULL DEFAULT 'PENDING_REGISTRATION',
	RegistrationStatus VARCHAR(30) NOT NULL DEFAULT 'PENDING_REGISTRATION',
	PaymentOrderDescription VARCHAR(255),
	PaymentQRCode BINARY,
	PaymentFullOrderNumber VARCHAR(50),
	ErrorRegistration VARCHAR(255)
)


IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_CATALOG = 'IX_PAYMENT_BANKID')
BEGIN 
	DROP INDEX IX_PAYMENT_BANKID ON PaymentOrder
END

CREATE NONCLUSTERED INDEX IX_PAYMENT_BANKID ON PaymentOrder(BankId)


IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_CATALOG = 'IX_PAYMENT_MERCHANTID')
BEGIN 
	DROP INDEX IX_PAYMENT_MERCHANTID ON PaymentOrder
END

CREATE NONCLUSTERED INDEX IX_PAYMENT_MERCHANTID ON PaymentOrder(MerchantId)


IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_CATALOG = 'IX_PAYMENT_STATUS')
BEGIN 
	DROP INDEX IX_PAYMENT_STATUS ON PaymentOrder
END

CREATE NONCLUSTERED INDEX IX_PAYMENT_STATUS ON PaymentOrder(PaymentStatus)


IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_CATALOG = 'IX_REGISTRATION_STATUS')
BEGIN 
	DROP INDEX IX_REGISTRATION_STATUS ON PaymentOrder
END

CREATE NONCLUSTERED INDEX IX_REGISTRATION_STATUS ON PaymentOrder(RegistrationStatus)

IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK_Value')
BEGIN 
	ALTER TABLE PaymentOrder DROP CONSTRAINT CK_Value
END

ALTER TABLE PaymentOrder ADD CONSTRAINT CK_Value CHECK( Value > 0 )

IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK_PaymentStatus')
BEGIN 
	ALTER TABLE PaymentOrder DROP CONSTRAINT CK_PaymentStatus
END

ALTER TABLE PaymentOrder ADD CONSTRAINT CK_PaymentStatus CHECK (PaymentStatus IN ('PENDING_REGISTRATION',
'WAITING_PAYMENT','PAID'))

IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK_RegistrationStatus')
BEGIN 
	ALTER TABLE PaymentOrder DROP CONSTRAINT CK_RegistrationStatus
END

ALTER TABLE PaymentOrder ADD CONSTRAINT CK_RegistrationStatus CHECK (RegistrationStatus IN ('PENDING_REGISTRATION',
'SEND_REGISTRATION','REGISTERED'))