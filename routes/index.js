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
router.get('/get', Controller.GetAllSessions);

// Get posts by a specific professional 
router.get('/get/professionalid/:professionalid', Controller.GetAllSessionsByProfessionalID);

// Get posts by a specific patientid 
router.get('/get/patientid/:patientid', Controller.GetAllSessionsByPatientID);

// Get posts by a specific professionalid and patientid
router.get('/get/professionalpatient/:professionalid/:patientid', Controller.GetAllSessionsByProfessionalPatientID);

// Submit a post
router.post('/post', Controller.UploadSession);

// Update a specific Session
router.patch('/patch/movement/:id/:movementlabel/:insertiondate', Controller.UpdateSession);

// Delete a specific Session
router.delete('/delete/movement/:id/:movementlabel/:insertiondate', Controller.DeleteSession);

module.exports = router;
