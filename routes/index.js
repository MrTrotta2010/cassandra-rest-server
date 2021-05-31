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
	res.json({ data: "Bem vindo ao ReBase!" });
});

// Get back all the posts
router.get('/get', async (req, res) => {
	let select = "SELECT * from sessions";

	try {
		connection.execute(select, function(err, rows) {
			if(!!err){
				console.log("[ERRO] Erro ao recuperar Sessões: " + err);
				res.status(500).send({ status: 0, message: "Não foi possível recuperar as Sessões", erro: err });
			}
			else {
				let sessionList = rows['rows'];
				sortSessionList(sessionList);
				res.send({ satus: 0, sessionList });
			}
		});
	} catch(e) {
		console.log("[ERRO] Erro ao recuperar Sessões: " + e.message);
		res.status(500).send({ status: 0, message: "Não foi possível recuperar as Sessões", erro: e.message });
	}
});

// Get posts by a specific professional 
router.get('/get/professionalid/:professionalid', async (req, res) => {
	let params = [req.params.professionalid]
	let select = "SELECT * from sessions WHERE professionalid=? ALLOW FILTERING;"

	connection.execute(select,params,function(err, rows){
		if(!!err){
			console.log(err);
			res.json(err);
		} else {
			let sessionList = rows['rows'];
			sortSessionList(sessionList);
			res.json(sessionList);
		}
	});
});

// Get posts by a specific patientid 
router.get('/get/patientid/:patientid', async (req, res) => {
	let params = [req.params.patientid]
	let select = "SELECT * from sessions WHERE patientid=? ALLOW FILTERING;"

	connection.execute(select,params,function(err, rows){
		if(!!err){
			console.log(err);
			res.json(err);
		} else {
			let sessionList = rows['rows'];
			sortSessionList(sessionList);
			res.json(sessionList);
		}
	});
});

// Get posts by a specific professionalid and patientid
router.get('/get/professionalpatient/:professionalid/:patientid', async (req, res) => {
	let params = [req.params.professionalid, req.params.patientid]
	let select = "SELECT * from sessions WHERE professionalid=? and patientid=? ALLOW FILTERING;"

	connection.execute(select,params,function(err, rows){
		if(!!err){
			console.log(err);
			res.json(err);
		} else {
			let sessionList = rows['rows'];
			sortSessionList(sessionList);
			res.json(sessionList);
		}
	});
});

// Submit a post
router.post('/post', async (req, res) => {
	let id = req.body.id;
	let title = req.body.title;
	let device = req.body.device;
	let description = req.body.description;
	let professionalid = req.body.professionalid;
	let movementlabel = req.body.movementlabel;
	let patientid = req.body.patientid;
	let maincomplaint = req.body.maincomplaint;
	let historyofcurrentdesease = req.body.historyofcurrentdesease;
	let historyofpastdesease = req.body.historyofpastdesease;
	let diagnosis = req.body.diagnosis;
	let relateddeseases = req.body.relateddeseases;
	let medications = req.body.medications;
	let physicalevaluation = req.body.physicalevaluation;
	let patientage = req.body.patientage;
	let patientheight = req.body.patientheight;
	let patientweight = req.body.patientweight;
	let patientsessionnumber = req.body.patientsessionnumber;
	let sessionduration = req.body.sessionduration;
	let numberofregisters = req.body.numberofregisters;
	let artindexpattern = req.body.artindexpattern;
	let sessiondata = req.body.sessiondata;

	let insertiondate = getFormattedDate()

	let insert = "INSERT INTO sessions(id,title,device,description,professionalid,patientid,movementlabel,maincomplaint,historyofcurrentdesease,historyofpastdesease,diagnosis,relateddeseases,medications,physicalevaluation,patientage,patientheight,patientweight,patientsessionnumber,sessionduration,numberofregisters,artindexpattern,sessiondata,insertionDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,textAsBlob(?),?) IF NOT EXISTS";
	let params = [id,title,device,description,professionalid,patientid,movementlabel,maincomplaint,historyofcurrentdesease,historyofpastdesease,diagnosis,relateddeseases,medications,physicalevaluation,patientage,patientheight,patientweight,patientsessionnumber,sessionduration,numberofregisters,artindexpattern,sessiondata,insertiondate];
	
	connection.execute(insert, params, { prepare: true }, function(err, rows) {
		if(!!err){
			console.log(err);
			res.json(err);
		} else {
			res.json(rows['rows'][0]);
		}
	});
});

// Update a specific Session
router.patch('/patch/movement/:id/:movementlabel/:insertiondate', async (req, res) => {
	let description = req.body.description;
	let maincomplaint = req.body.maincomplaint;
	let historyofcurrentdesease = req.body.historyofcurrentdesease;
	let historyofpastdesease = req.body.historyofpastdesease;
	let diagnosis = req.body.diagnosis;
	let relateddeseases = req.body.relateddeseases;
	let medications = req.body.medications;
	let physicalevaluation = req.body.physicalevaluation;
	let patientage = req.body.patientage;
	let patientheight = req.body.patientheight;
	let patientweight = req.body.patientweight;
	let patientsessionnumber = req.body.patientsessionnumber;

	let update = "UPDATE sessions SET description=?,maincomplaint=?,historyofcurrentdesease=?,historyofpastdesease=?,diagnosis=?,relateddeseases=?,medications=?,physicalevaluation=?,patientage=?,patientheight=?,patientweight=?,patientsessionnumber=? WHERE id=? AND movementlabel=? AND insertiondate=?";
	let params = [description,maincomplaint,historyofcurrentdesease,historyofpastdesease,diagnosis,relateddeseases,medications,physicalevaluation,patientage,patientheight,patientweight,patientsessionnumber,req.params.id,req.params.movementlabel,req.params.insertiondate];
		
	connection.execute(update, params, { prepare: true }, function(err, rows){
		if(!!err){
			console.log(err);
			res.json(err);
		} else {
			res.json(rows);
		}
	});
});

// Delete a specific Session
router.delete('/delete/movement/:id/:movementlabel/:insertiondate', async (req, res) => {
	let id = req.params.id;
	let movementlabel = req.params.movementlabel;
	let insertiondate = req.params.insertiondate;
	
	if(!!id){
		let delet = "DELETE FROM sessions WHERE id=? AND movementlabel=? AND insertiondate=?";
		connection.execute(delet, [id, movementlabel, insertiondate], function(err, rows){
			if(!!err){
				console.log(err);
				res.json(err);
			} else {
				res.json(rows);
			}
		});
	} else {
		console.log("Please, be sure to provide the id, the movementlabel and the insertiondate on your json");
		res.json({"error": "Please, be sure to provide the id, the movementlabel and the insertiondate on your json"});	
	}
});

// DeleteAllSessions: async (req, res) =>{
//     let delet = "TRUNCATE sessions;";
//     connection.execute(delet, function(err, rows){
//         if(!!err){
//             console.log(err);
//             res.json(err);
//         } else {
//             res.json(rows);
//         }
//     });
// }

function getFormattedDate() {
	let date = new Date();

	let month = date.getMonth() + 1;
	let day = date.getDate();
	let hour = date.getHours();
	let min = date.getMinutes();
	let sec = date.getSeconds();
	let mil = date.getMilliseconds();

	month = (month < 10 ? "0" : "") + month;
	day = (day < 10 ? "0" : "") + day;
	hour = (hour < 10 ? "0" : "") + hour;
	min = (min < 10 ? "0" : "") + min;
	sec = (sec < 10 ? "0" : "") + sec;

	return date.getFullYear() + "-" + month + "-" + day +
			"T" +  hour + ":" + min + ":" + sec + "." + mil + "Z";
}

function sortSessionList(sessionList) {
	sessionList.sort((a, b) => {
		return new Date(a.insertiondate) - new Date(b.insertiondate)
	});
	sessionList.forEach(element => {
		console.log(element.insertiondate)
	});
}

module.exports = router;
