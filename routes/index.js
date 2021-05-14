/////////////////////////////////
// Require the modules
/////////////////////////////////
var cassandra 		= require("cassandra-driver");
var express 		= require('express');
var router 			= express.Router();
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
router.get('/get', async(req,res) => {
	var select = "SELECT * from sessions";

	connection.execute(select,function(err, rows){
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

// Get posts by a specific professional 
router.get('/get/professionalid/:professionalid', async(req,res) => {
	var params = [req.params.professionalid]
	var select = "SELECT * from sessions WHERE professionalid=? ALLOW FILTERING;"

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
router.get('/get/patientid/:patientid', async(req,res) => {
	var params = [req.params.patientid]
	var select = "SELECT * from sessions WHERE patientid=? ALLOW FILTERING;"

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
router.get('/get/professionalpatient/:professionalid/:patientid', async(req,res) => {
	var params = [req.params.professionalid, req.params.patientid]
	var select = "SELECT * from sessions WHERE professionalid=? and patientid=? ALLOW FILTERING;"

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
router.post('/post', async(req,res) => {
	var id = req.body.id;
	var title = req.body.title;
	var device = req.body.device;
	var description = req.body.description;
	var professionalid = req.body.professionalid;
	var movementlabel = req.body.movementlabel;
	var patientid = req.body.patientid;
	var maincomplaint = req.body.maincomplaint;
	var historyofcurrentdesease = req.body.historyofcurrentdesease;
	var historyofpastdesease = req.body.historyofpastdesease;
	var diagnosis = req.body.diagnosis;
	var relateddeseases = req.body.relateddeseases;
	var medications = req.body.medications;
	var physicalevaluation = req.body.physicalevaluation;
	var patientage = req.body.patientage;
	var patientheight = req.body.patientheight;
	var patientweight = req.body.patientweight;
	var patientsessionnumber = req.body.patientsessionnumber;
	var sessionduration = req.body.sessionduration;
	var numberofregisters = req.body.numberofregisters;
	var artindexpattern = req.body.artindexpattern;
	var sessiondata = req.body.sessiondata;

	var insertiondate = getFormattedDate()

	var insert = "INSERT INTO sessions(id,title,device,description,professionalid,patientid,movementlabel,maincomplaint,historyofcurrentdesease,historyofpastdesease,diagnosis,relateddeseases,medications,physicalevaluation,patientage,patientheight,patientweight,patientsessionnumber,sessionduration,numberofregisters,artindexpattern,sessiondata,insertionDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,textAsBlob(?),?) IF NOT EXISTS";
	var params = [id,title,device,description,professionalid,patientid,movementlabel,maincomplaint,historyofcurrentdesease,historyofpastdesease,diagnosis,relateddeseases,medications,physicalevaluation,patientage,patientheight,patientweight,patientsessionnumber,sessionduration,numberofregisters,artindexpattern,sessiondata,insertiondate];
	
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
router.patch('/patch/movement/:id/:movementlabel/:insertiondate', async(req,res) => {
	var description = req.body.description;
	var maincomplaint = req.body.maincomplaint;
	var historyofcurrentdesease = req.body.historyofcurrentdesease;
	var historyofpastdesease = req.body.historyofpastdesease;
	var diagnosis = req.body.diagnosis;
	var relateddeseases = req.body.relateddeseases;
	var medications = req.body.medications;
	var physicalevaluation = req.body.physicalevaluation;
	var patientage = req.body.patientage;
	var patientheight = req.body.patientheight;
	var patientweight = req.body.patientweight;
	var patientsessionnumber = req.body.patientsessionnumber;

	var update = "UPDATE sessions SET description=?,maincomplaint=?,historyofcurrentdesease=?,historyofpastdesease=?,diagnosis=?,relateddeseases=?,medications=?,physicalevaluation=?,patientage=?,patientheight=?,patientweight=?,patientsessionnumber=? WHERE id=? AND movementlabel=? AND insertiondate=?";
	var params = [description,maincomplaint,historyofcurrentdesease,historyofpastdesease,diagnosis,relateddeseases,medications,physicalevaluation,patientage,patientheight,patientweight,patientsessionnumber,req.params.id,req.params.movementlabel,req.params.insertiondate];
		
	connection.execute(update, params, { prepare: true }, function(err, rows){
		if(!!err){
			console.log(err);
			res.json(err);
		} else {
			res.json(rows);
		}
	});
});

// Delete all post
// router.delete('/deleteall', function(req,res){
// var delet = "TRUNCATE sessions;";
// connection.execute(delet, function(err, rows){
// 		if(!!err){
// 			console.log(err);
// 			res.json(err);
// 		} else {
// 			res.json(rows);
// 		}
// 	});
// });

// Delete a specific Session
router.delete('/delete/movement/:id/:movementlabel/:insertiondate',function(req,res){
	var id = req.params.id;
	var movementlabel = req.params.movementlabel;
	var insertiondate = req.params.insertiondate;
	
	if(!!id){
		var delet = "DELETE FROM sessions WHERE id=? AND movementlabel=? AND insertiondate=?";
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

function getFormattedDate() {
	var date = new Date();

	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();
	var mil = date.getMilliseconds();

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
