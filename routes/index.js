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
		}else{
			res.json(rows['rows']);
		}
	});
});

// Get posts by a specific professional 
router.get('/get/professionalid/:professionalid', async(req,res) => {
	var params = [req.params.professionalid]
	var select = "SELECT * from sessions WHERE professionalid=?;"

	connection.execute(select,params,function(err, rows){
		if(!!err){
			console.log(err);
			res.json(err);
		}else{
			res.json(rows['rows']);
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
		}else{
			res.json(rows['rows']);
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
		}else{
			res.json(rows['rows']);
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

	var insert = "INSERT INTO sessions(id,title,device,description,professionalid,patientid,movementlabel,maincomplaint,historyofcurrentdesease,historyofpastdesease,diagnosis,relateddeseases,medications,physicalevaluation,patientage,patientheight,patientweight,patientsessionnumber,sessionduration,numberofregisters,artindexpattern,sessiondata,insertionDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,textAsBlob(?),toTimeStamp(now())) IF NOT EXISTS";
	var params = [id,title,device,description,professionalid,patientid,movementlabel,maincomplaint,historyofcurrentdesease,historyofpastdesease,diagnosis,relateddeseases,medications,physicalevaluation,patientage,patientheight,patientweight,patientsessionnumber,sessionduration,numberofregisters,artindexpattern,sessiondata];
	
	connection.execute(insert, params, { prepare: true }, function(err, rows) {
		if(!!err){
			console.log(err);
			res.json(err);
		}else{
			res.json(rows['rows'][0]);
		}
	});
});

// Update a post
router.patch('/patch/:id', async(req,res) => {
	var title = req.body.title;
	var description = req.body.description;
	var movementlabel = req.body.movementlabel;
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

	var update = "UPDATE sessions SET title=?,description=?,movementlabel=?,maincomplaint=?,historyofcurrentdesease=?,historyofpastdesease=?,diagnosis=?,relateddeseases=?,medications=?,physicalevaluation=?,patientage=?,patientheight=?,patientweight=?,patientsessionnumber=? WHERE id=?";
	var params = [title,description,movementlabel,maincomplaint,historyofcurrentdesease,historyofpastdesease,diagnosis,relateddeseases,medications,physicalevaluation,patientage,patientheight,patientweight,patientsessionnumber,id];
		
	connection.execute(update, params, { prepare: true }, function(err, rows){
		if(!!err){
			console.log(err);
			res.json(err);
		}else{
			res.json(rows);
		}
	});
});

// Delete all post
router.delete('/deleteall', function(req,res){
	var delet = "TRUNCATE sessions;";
	connection.execute(delet, function(err, rows){
		if(!!err){
			console.log(err);
			res.json(err);
		}else{
			res.json(rows);
		}
	});
});

// Delete a Session
router.delete('/delete/session/:id',function(req,res){
	var id = req.params.id;
	
	if(!!id){
		var delet = "DELETE FROM sessions WHERE id=?";
		connection.execute(delet, [id], function(err, rows){
			if(!!err){
				console.log(err);
				res.json(err);
			}else{
				res.json(rows);
			}
		});
	}else{
		console.log("Please, be sure to provide the id on your json");
		res.json({"error": "Please, be sure to provide the id on your json"});	
	}
});

// Delete a movement from a Session
router.delete('/delete/movement/:id/:movementlabel/:insertiondate',function(req,res){
	var id = req.params.id;
	var movementlabel = req.params.movementlabel;
	var insertiondate = req.params.insertiondate;
	
	if(!!id){
		var delet = "DELETE FROM sessions WHERE id=?,movementlabel=?,insertiondate=?";
		connection.execute(delet, [id, movementlabel, insertiondate], function(err, rows){
			if(!!err){
				console.log(err);
				res.json(err);
			}else{
				res.json(rows);
			}
		});
	}else{
		console.log("Please, be sure to provide the id, the movementlabel and the insertiondate on your json");
		res.json({"error": "Please, be sure to provide the id, the movementlabel and the insertiondate on your json"});	
	}
});

module.exports = router;
