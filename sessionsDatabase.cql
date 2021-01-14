// Creating a KEYSPACE named 'sessionsdb' with class and replication factor.
// ========================================================================


CREATE KEYSPACE sessionsdb WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 1};

// To access the created KEYSPACE
// ================================

USE sessionsdb;

// Creating a table named 'session' with following columns
// =======================================================

CREATE TABLE sessions(
	id text, title text, description text, professionalid text, maincomplaint text, historyofcurrentdesease text,
	historyofpastdesease text, diagnosis text, relateddeseases text, medications text,
	physicalevaluation text, patientage int, patientheight float, patientweight float,
	patientsessionnumber int, sessionduration float, numberofregisters int, artindexpattern text,
	sessiondata blob, insertiondate timestamp, PRIMARY KEY(id, insertiondate)
);
