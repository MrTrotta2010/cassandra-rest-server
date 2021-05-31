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

module.exports = {
    getAllSessions: async (req, res) => {
        let select = "SELECT * from sessions";
    
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
    },

    getAllSessionsByProfessionalID: async (req, res) => {
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
    },

    getAllSessionsByPatientID: async (req, res) => {
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
    },

    getAllSessionsByProfessionalPatientID: async (req, res) => {
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
    },

    uploadSession: async (req, res) => {
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
    },

    updateSession: async (req, res) => {
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
    },

    deleteSession: async (req, res) => {
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
    }

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
}