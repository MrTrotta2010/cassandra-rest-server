// Creating a KEYSPACE named 'sessionsdb' with class and replication factor.
// ========================================================================


CREATE KEYSPACE sessionsdb WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 1};

// To access the created KEYSPACE
// ================================

USE sessionsdb;

// Creating a table named 'session' with following columns
// =======================================================

CREATE TABLE sessions(
	id text, title text, description text, mainComplaint text, historyOfCurrentDesease text,
	historyOfPastDesease text, diagnosis text, relatedDeseases text, medications text,
	physicalEvaluations text, patientAge int, patientHeight float, patientWeight float,
	patientSessionNumber int, sessionDuration float, numberOfRegisters int, artIndexPattern text,
	sessionData blob, PRIMARY KEY(id)
);