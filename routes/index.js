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

// Get a specific post
router.get('/get/:postId', async(req,res) => {
	var params = [req.params.postId]
	var select = "SELECT * from sessions WHERE id= ?;"

	connection.execute(select,params,function(err, rows){
		if(!!err){
			console.log(err);
			res.json(err);
		}else{
			res.json(rows);
		}
	});
});

// Submit a post
router.post('/post', async(req,res) => {
	var id = req.body.id;
	var title = req.body.title;
	var description = req.body.description;
	var professionalid = req.body.professionalid;
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

	var insert = "INSERT INTO sessions(id,title,description,professionalid,maincomplaint,historyofcurrentdesease,historyofpastdesease,diagnosis,relateddeseases,medications,physicalevaluation,patientage,patientheight,patientweight,patientsessionnumber,sessionduration,numberofregisters,artindexpattern,sessiondata,insertionDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,textAsBlob(?),toTimeStamp(now())) IF NOT EXISTS";
	var params = [id,title,description,professionalid,maincomplaint,historyofcurrentdesease,historyofpastdesease,diagnosis,relateddeseases,medications,physicalevaluation,patientage,patientheight,patientweight,patientsessionnumber,sessionduration,numberofregisters,artindexpattern,sessiondata];
	
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
	var id = req.body.id;
	var title = req.body.title;
	var description = req.body.description;
	var professionalid = req.body.professionalid;
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

	var update = "UPDATE sessions SET title=?,description=?,professionalid=?,maincomplaint=?,historyofcurrentdesease=?,historyofpastdesease=?,diagnosis=?,relateddeseases=?,medications=?,physicalevaluation=?,patientage=?,patientheight=?,patientweight=?,patientsessionnumber=?,sessionduration=?,numberofregisters=?,artindexpattern=?,sessiondata=textAsBlob(?) WHERE id=?";
	var params = [title,description,professionalid,maincomplaint,historyofcurrentdesease,historyofpastdesease,diagnosis,relateddeseases,medications,physicalevaluation,patientage,patientheight,patientweight,patientsessionnumber,sessionduration,numberofregisters,artindexpattern,sessiondata,id];
		
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

// Delete a post
router.delete('/delete/:id',function(req,res){
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

module.exports = router;
