// Creating a KEYSPACE named 'sessionsdb' with class and replication factor.
// ========================================================================

CREATE KEYSPACE sessionsdb WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 1};

// To access the created KEYSPACE
// ================================

USE sessionsdb;

// Creating a table named 'sessions' with following columns
// =======================================================

CREATE TABLE sessions(
        id text, title text, device text, description text, professionalid text, patientid text,
        movementlabel text, maincomplaint text, historyofcurrentdesease text,
        historyofpastdesease text, diagnosis text, relateddeseases text, medications text,
        physicalevaluation text, patientage int, patientheight float, patientweight float,
        patientsessionnumber int, sessionduration float, numberofregisters int, artindexpattern text,
        sessiondata blob, insertiondate text, PRIMARY KEY(id, movementlabel, insertiondate)
);

CREATE INDEX IF NOT EXISTS professionalid_index ON sessionsdb.sessions (professionalid);
CREATE INDEX IF NOT EXISTS patientid_index ON sessionsdb.sessions (patientid);
