const express = require('express');
const router = express.Router(); 
const Post = require('../models/Post');

// @diegodias
// Get back all the posts
router.get('/', async (req,res) => {
	try{
		const posts = await Post.find();
		res.json(posts);
	}catch(err){
		res.json({message: err});
	}
});

// @diegodias
// Submit a post
router.post('/', async (req,res) => {
	const post = new Post({
		title: req.body.title,
		description: req.body.description,
		numberOfDocuments: req.body.numberOfDocuments,
		previousDocument: req.body.previousDocument,
		patientAge: req.body.patientAge,
		patientHeight: req.body.patientHeight,
		patientWeight: req.body.patientWeight,
		patientPatology: req.body.patientPatalogy,
		patientSessionNumber: req.body.patientSessionNumber,
		doctorName: req.body.doctorName,
		doctorRegistryNumber: req.body.doctorRegistryNumber,
		medicalClinic: req.body.medicalClinic,
		sessionDuration: req.body.sessionDuration,
		numberOfRegisters: req.body.numberOfRegisters,
		artIndexPattern: req.body.artIndexPattern,
		sessionData: req.body.sessionData,
		
		// Rogerio's fields		
		userId: req.body.userId,
		userName: req.body.userName,
		userTypeId: req.body.userTypeId,
		userTypeDescription: req.body.userTypeDescription,
		exerciseId: req.body.exerciseId,
		exerciseName: req.body.exerciseName,
		axisId: req.body.axisId,
		axisName: req.body.axisName,
		frameNumber: req.body.frameNumber,
		leftShoulderX: req.body.leftShoulderX,
		leftShoulderY: req.body.leftShoulderY,
		leftShoulderZ: req.body.leftShoulderZ,
		leftElbowX: req.body.leftElbowX,
		leftElbowY: req.body.leftElbowY,
		leftElbowZ: req.body.leftElbowZ,
		leftWristX: req.body.leftWristX,
		leftWristY: req.body.leftWristY,
		leftWristZ: req.body.leftWristZ,
		leftShoulderElbowWristAngle: req.body.leftShoulderElbowWristAngle
	});
	try {
		const savedPost = await post.save();
		res.json(savedPost);
	}catch(err) {
		res.json({message: err});	  
	}
});

// @diegodias
// Specific post
// host:port/posts/idpost
router.get('/:postId', async (req,res) => {
	try{
		const post = await Post.findById(req.params.postId);
		res.json(post);
	} catch(err) {
		 res.json({message: err});
	}
});


// @diegodias
// Delete all posts
router.delete('/deleteall', async (req,res)=> {
	try{
                const removedAll = await Post.remove();
                res.json(removedAll);
        }catch(err){
                res.json({message: err});
        }


})


// @diegodias
// Delete a post
router.delete('/:postId', async (req,res) => {
	try {
		const removedPost = await Post.remove({_id: req.params.postId});
		res.json(removedPost);
	} catch(err) {	
		res.json({message: err});
	}
});

// @diegodias
// Update a post
router.patch('/:postId', async (req,res) => {
	try {
		const updatedPost = await Post.updateOne({_id: req.params.postId}, 
			{ $set: {title: req.body.title, 
				description: req.body.description}}
		);
		res.json(updatedPost);
	} catch(err) {
		res.json({message: err});
	}
});

module.exports = router;

