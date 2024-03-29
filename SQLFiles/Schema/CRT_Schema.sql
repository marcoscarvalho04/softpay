IF NOT EXISTS (SELECT 1 FROM SYS.databases WHERE NAME = 'SoftPay')
BEGIN 
	CREATE DATABASE SoftPay
END
GO
USE SoftPay
GO


IF EXISTS(SELECT 1 FROM SYS.tables WHERE NAME = 'Payment_Order') 
BEGIN 
	DROP TABLE Payment_Order 
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
		Merchant_Id VARCHAR(255) NOT NULL PRIMARY KEY, 
		CNPJ VARCHAR(14) NOT NULL, 
		Social_Name VARCHAR(200) NOT NULL, 
		Opening_Date DATE NOT NULL, 
		Fantasy_Name VARCHAR(200) NOT NULL, 
		Address VARCHAR(200) NOT NULL, 
		Address_Complement VARCHAR(200), 
		Address_City VARCHAR(200) NOT NULL, 
		Address_Uf VARCHAR(2) NOT NULL,
		Email VARCHAR(255) NOT NULL UNIQUE, 
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

CREATE NONCLUSTERED INDEX IX_MERCHANTFINDING ON Merchant(CNPJ) INCLUDE (Social_Name,Fantasy_Name)

IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK_CASH')
BEGIN
	ALTER TABLE Merchant DROP CONSTRAINT CK_CASH 
END

ALTER TABLE Merchant ADD CONSTRAINT CK_CASH CHECK (CASH >= 0)


CREATE TABLE Banks (
	Bank_Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
	Bank_Number INT NOT NULL, 
	Bank_Code INT NOT NULL, 
	Bank_Agency INT NOT NULL, 
	Bank_Agency_Validation VARCHAR(20) NOT NULL,
	Bank_Type VARCHAR(20) NOT NULL DEFAULT 'Merchant', 
	Bank_Status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
	Bank_Wallet INT NOT NULL DEFAULT 0,
	Merchant_Id VARCHAR(255) FOREIGN KEY REFERENCES Merchant(Merchant_Id)
)

IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK_Bank_Type')
BEGIN 
	ALTER TABLE Banks DROP CONSTRAINT CK_Bank_Type
END

ALTER TABLE Banks ADD CONSTRAINT Ck_Bank_Type CHECK (Bank_Type IN ('Merchant','System'))


IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK_Bank_Status')
BEGIN 
	ALTER TABLE Banks DROP CONSTRAINT CK_Bank_Status
END

ALTER TABLE Banks ADD CONSTRAINT CK_Bank_Status CHECK (Bank_Status IN ('ACTIVE','DEACTIVE'))

IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_CATALOG = 'IX_Merchant_Id')
BEGIN 
	DROP INDEX IX_Merchant_Id ON Banks
END

CREATE NONCLUSTERED INDEX IX_Merchant_Id ON Banks(Merchant_Id)


IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_CATALOG = 'IX_FINDINGBANK')
BEGIN 
	DROP INDEX IX_FINDINGBANK ON Banks
END

CREATE NONCLUSTERED INDEX IX_FINDINGBANK ON Banks(Bank_Number) INCLUDE(Bank_Agency,Bank_Code)

CREATE TABLE Payment_Order 
(
	Payment_Order VARCHAR(255) NOT NULL PRIMARY KEY,
	Bank_Id INT NOT NULL FOREIGN KEY REFERENCES Banks(Bank_Id),
	Merchant_Id VARCHAR(255) NOT NULL FOREIGN KEY REFERENCES Merchant(Merchant_Id),
	Value MONEY,
	Create_Date SMALLDATETIME NOT NULL, 
	Valid_Date SMALLDATETIME NOT NULL, 
	Payment_Status VARCHAR(30) NOT NULL DEFAULT 'PENDING_REGISTRATION',
	Registration_Status VARCHAR(30) NOT NULL DEFAULT 'PENDING_REGISTRATION',
	Payment_Order_Description VARCHAR(255),
	Payment_Qr_Code BINARY,
	Payment_Full_Order_Number VARCHAR(50),
	Error_Registration VARCHAR(255)
)


IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_CATALOG = 'IX_PAYMENT_Bank_Id')
BEGIN 
	DROP INDEX IX_PAYMENT_Bank_Id ON Payment_Order
END

CREATE NONCLUSTERED INDEX IX_PAYMENT_Bank_Id ON Payment_Order(Bank_Id)


IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_CATALOG = 'IX_PAYMENT_Merchant_Id')
BEGIN 
	DROP INDEX IX_PAYMENT_Merchant_Id ON Payment_Order
END

CREATE NONCLUSTERED INDEX IX_PAYMENT_Merchant_Id ON Payment_Order(Merchant_Id)


IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_CATALOG = 'IX_PAYMENT_STATUS')
BEGIN 
	DROP INDEX IX_PAYMENT_STATUS ON Payment_Order
END

CREATE NONCLUSTERED INDEX IX_PAYMENT_STATUS ON Payment_Order(Payment_Status)


IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_CATALOG = 'IX_REGISTRATION_STATUS')
BEGIN 
	DROP INDEX IX_REGISTRATION_STATUS ON Payment_Order
END

CREATE NONCLUSTERED INDEX IX_REGISTRATION_STATUS ON Payment_Order(Registration_Status)

IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK_Value')
BEGIN 
	ALTER TABLE Payment_Order DROP CONSTRAINT CK_Value
END

ALTER TABLE Payment_Order ADD CONSTRAINT CK_Value CHECK( Value > 0 )

IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK_Payment_Status')
BEGIN 
	ALTER TABLE Payment_Order DROP CONSTRAINT CK_Payment_Status
END

ALTER TABLE Payment_Order ADD CONSTRAINT CK_Payment_Status CHECK (Payment_Status IN ('PENDING_REGISTRATION',
'WAITING_PAYMENT','PAID'))

IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK_Registration_Status')
BEGIN 
	ALTER TABLE Payment_Order DROP CONSTRAINT CK_Registration_Status
END

ALTER TABLE Payment_Order ADD CONSTRAINT CK_Registration_Status CHECK (Registration_Status IN ('PENDING_REGISTRATION',
'SEND_REGISTRATION','REGISTERED'))

