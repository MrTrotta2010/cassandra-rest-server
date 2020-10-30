// Creating a KEYSPACE named 'sessionsdb' with class and replication factor.
// ========================================================================


CREATE KEYSPACE sessionsdb WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 1};

// To access the created KEYSPACE
// ================================

USE sessionsdb;

// Creating a table named 'session' with following columns
// =======================================================

CREATE TABLE sessions(
	id text, title text, description text, patientAge int, patientHeight float, patientWeight float,
	patientPatology text, patientSessionNumber int, doctorName text, doctorRegistryNumber int,
	medicalClinic text, sessionDuration float, numberOfRegisters int, artIndexPattern text,
	sessionData blob, PRIMARY KEY(id)
);

// Adding sessions to the sessions database
// =================================================================

INSERT INTO sessions(id, title, description, patientAge, patientHeight, patientWeight, patientPatology, patientSessionNumber, doctorName, doctorRegistryNumber, medicalClinic, sessionDuration, numberOfRegisters, artIndexPattern,	sessionData) VALUES('0', 'Teste DB', 'Testando a criação do banco de dados', 21, 1.75, 62.0, 'Loving too much', 1, 'Dr. Strangelove', 12, 'Unimed USA', 30.0, 0, 'a1;a2;a3', intAsBlob(0));

// To list all the sessions available in the sessions database
// ========================================================

SELECT * FROM sessions;