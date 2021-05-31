/////////////////////////////////
// Require the modules
/////////////////////////////////
var cassandra 		= require("cassandra-driver");
var express 		= require('express');
const { UpdateSession } = require("../controllers/SessionController");
var router 			= express.Router();
const Controller	= require('../controllers/SessionController');
////////////////////////////////////
// Cassandra database config
////////////////////////////////////
var dbConfig = {
	 	contactPoints : ['127.0.0.1'],
	 	keyspace:'sessionsdb'
	};

var connection = new cassandra.Client(dbConfig);

connection.connect(function(err,result){
	console.log('Cassandra connected');
});

router.get('/',function(req,res){
	var data = {
		"Data":""
	};
	data["Data"] = "Bem vindo!";
	res.json(data);
});

// Get back all the posts
router.get('/get', Controller.getAllSessions);

// Get posts by a specific professional 
router.get('/get/professionalid/:professionalid', Controller.getAllSessionsByProfessionalID);

// Get posts by a specific patientid 
router.get('/get/patientid/:patientid', Controller.getAllSessionsByPatientID);

// Get posts by a specific professionalid and patientid
router.get('/get/professionalpatient/:professionalid/:patientid', Controller.getAllSessionsByProfessionalPatientID);

// Submit a post
router.post('/post', Controller.uploadSession);

// Update a specific Session
router.patch('/patch/movement/:id/:movementlabel/:insertiondate', Controller.updateSession);

// Delete a specific Session
router.delete('/delete/movement/:id/:movementlabel/:insertiondate', Controller.deleteSession);

module.exports = router;
