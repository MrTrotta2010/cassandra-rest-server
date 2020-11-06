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
			res.json(rows);
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
	var mainComplaint = req.body.mainComplaint;
	var historyOfCurrentDesease = req.body.historyOfCurrentDesease;
	var historyOfPastDesease = req.body.historyOfPastDesease;
	var diagnosis = req.body.diagnosis;
	var relatedDeseases = req.body.relatedDeseases;
	var medications = req.body.medications;
	var physicalEvaluation = req.body.physicalEvaluation;
	var patientAge = req.body.patientAge;
	var patientHeight = req.body.patientHeight;
	var patientWeight = req.body.patientWeight;
	var patientSessionNumber = req.body.patientSessionNumber;
	var sessionDuration = req.body.sessionDuration;
	var numberOfRegisters = req.body.numberOfRegisters;
	var artIndexPattern = req.body.artIndexPattern;
	var sessionData = req.body.sessionData;

	if (!!id && !!title && !!description && !!mainComplaint && !!historyOfCurrentDesease &&
		!!historyOfPastDesease && !!diagnosis && !!relatedDeseases && !!medications && !!physicalEvaluation &&
		!!patientAge && !!patientHeight && !!patientWeight && !!patientSessionNumber && !!sessionDuration &&
		!!numberOfRegisters && !!artIndexPattern && !!sessionData) {
		
		var insert = "INSERT INTO sessions(id,title,description,mainComplaint,historyOfCurrentDesease,historyOfPastDesease,diagnosis,relatedDeseases,medications,physicalEvaluation,patientAge,patientHeight,patientWeight,patientSessionNumber,sessionDuration,numberOfRegisters,artIndexPattern,sessionData) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,textAsBlob(?))";
		var params = [id,title,description,mainComplaint,historyOfCurrentDesease,historyOfPastDesease,diagnosis,relatedDeseases,medications,physicalEvaluation,patientAge,patientHeight,patientWeight,patientSessionNumber,sessionDuration,numberOfRegisters,artIndexPattern,sessionData];
		
		connection.execute(insert, params, { prepare: true }, function(err, rows) {
			if(!!err){
				console.log(err);
				res.json(err);
			}else{
				res.json(rows);
			}
		});
	}else{
		console.log("Please, be sure to provide all the attributes on your json");
		res.json({"error": "Please, be sure to provide all the attributes on your json"});
	}
});

// Update a post
router.patch('/patch/:id', async(req,res) => {
	var id = req.body.id;
	var title = req.body.title;
	var description = req.body.description;
	var mainComplaint = req.body.mainComplaint;
	var historyOfCurrentDesease = req.body.historyOfCurrentDesease;
	var historyOfPastDesease = req.body.historyOfPastDesease;
	var diagnosis = req.body.diagnosis;
	var relatedDeseases = req.body.relatedDeseases;
	var medications = req.body.medications;
	var physicalEvaluation = req.body.physicalEvaluation;
	var patientAge = req.body.patientAge;
	var patientHeight = req.body.patientHeight;
	var patientWeight = req.body.patientWeight;
	var patientSessionNumber = req.body.patientSessionNumber;
	var sessionDuration = req.body.sessionDuration;
	var numberOfRegisters = req.body.numberOfRegisters;
	var artIndexPattern = req.body.artIndexPattern;
	var sessionData = req.body.sessionData;

	if (!!id && !!title && !!description && !!mainComplaint && !!historyOfCurrentDesease &&
		!!historyOfPastDesease && !!diagnosis && !!relatedDeseases && !!medications && !!physicalEvaluation &&
		!!patientAge && !!patientHeight && !!patientWeight && !!patientSessionNumber && !!sessionDuration &&
		!!numberOfRegisters && !!artIndexPattern && !!sessionData) {

			var update = "UPDATE sessions SET title=?,description=?,mainComplaint=?,historyOfCurrentDesease=?,historyOfPastDesease=?,diagnosis=?,relatedDeseases=?,medications=?,physicalEvaluation=?,patientAge=?,patientHeight=?,patientWeight=?,patientSessionNumber=?,sessionDuration=?,numberOfRegisters=?,artIndexPattern=?,sessionData=textAsBlob(?) WHERE id=?";
			var params = [id,title,description,mainComplaint,historyOfCurrentDesease,historyOfPastDesease,diagnosis,relatedDeseases,medications,physicalEvaluation,patientAge,patientHeight,patientWeight,patientSessionNumber,sessionDuration,numberOfRegisters,artIndexPattern,sessionData];
			
		connection.execute(update, params, { prepare: true }, function(err, rows){
			if(!!err){
				console.log(err);
				res.json(err);
			}else{
				res.json(rows);
			}
		});
	}else{
		console.log("Please, be sure to provide all the attributes on your json");
		res.json({"error": "Please, be sure to provide all the attributes on your json"});	
	}
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
