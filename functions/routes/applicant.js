// const express = require("express");
// const router = express.Router();
// const admin = require("firebase-admin");

// // Ensure Firebase Admin is initialized
// if (!admin.apps.length) {
//   admin.initializeApp();
// }

// const db = admin.firestore();
// const multer = require("multer");
// const upload = multer();
// const { v4: uuidv4 } = require('uuid');
// // If checkToken is not used, you can comment it out or remove it:
// // const checkToken = require('../middlewares/checkToken');

// // GET /getAllApplicants route
// router.get('/getAllApplicants', async (req, res) => {
//   try {
//     const applicantsRef = db.collection('applications');
//     const snapshot = await applicantsRef.get();

//     if (snapshot.empty) {
//       return res.status(404).json({ error: 'No applicants found' });
//     }

//     const applicants = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
//     return res.status(200).json(applicants);
//   } catch (error) {
//     console.error('Error fetching applicants:', error);
//     return res.status(500).json({ error: error.message });
//   }
// });

// // POST /addApplicant route
// router.post('/addApplicant', upload.none(), async (req, res) => {
//   console.log("Received application data:", req.body);

//   const {
//     firstName,
//     lastName,
//     middleName,
//     avatar,
//     birthDay,
//     birthMonth,
//     birthYear,
//     email,
//     phone,
//     registrationCode,
//     city,
//     state,
//     street1,
//     street2,
//     zip,
//     degree,
//     institution,
//     graduationYear,
//     referralSource,
//     resumeUrl
//   } = req.body;

//   if (
//     !firstName ||
//     !lastName ||
//     !avatar ||
//     !birthDay ||
//     !birthMonth ||
//     !birthYear ||
//     !email ||
//     !phone ||
//     !registrationCode ||
//     !street1 ||
//     !city ||
//     !state ||
//     !zip ||
//     !degree ||
//     !institution ||
//     !graduationYear ||
//     !resumeUrl
//   ) {
//     return res.status(400).json({ error: 'Please fill up all of the fields' });
//   }

//   try {
//     const pad = (n) => n.toString().padStart(2, '0');
//     const birthDateString = `${birthYear}-${pad(birthMonth)}-${pad(birthDay)}`;
//     const parsedBirthDate = new Date(birthDateString);
//     if (isNaN(parsedBirthDate.getTime())) {
//       return res.status(400).json({ error: 'Invalid birth date format' });
//     }

//     const randomUID = Math.random().toString(36).substring(2, 15);
//     console.log("Generated UID:", randomUID);

//     await db.collection('applications').doc(randomUID).set({
//       firstName,
//       lastName,
//       middleName,
//       photoUrl: avatar,
//       birthDate: admin.firestore.Timestamp.fromDate(parsedBirthDate),
//       email,
//       phone,
//       registrationCode,
//       city,
//       state,
//       street1,
//       street2,
//       zip,
//       degree,
//       institution,
//       graduationYear,
//       referralSource,
//       resumeUrl,
//       uid: randomUID,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     return res.status(201).json({ message: 'Application created successfully' });
//   } catch (error) {
//     console.error('Error creating Application:', error);
//     return res.status(500).json({ error: error.message });
//   }
// });

// // GET /getCode route
// router.get('/getCode', async (req, res) => {
//   const { code } = req.query;

//   if (!code) {
//     return res.sendStatus(400);
//   }

//   try {
//     const docRef = db.collection('code').doc('registrationCode');
//     const docSnapshot = await docRef.get();

//     if (!docSnapshot.exists) {
//       return res.sendStatus(404);
//     }

//     const registrationCode = docSnapshot.data().code;

//     if (registrationCode !== code) {
//       return res.sendStatus(401);
//     }

//     return res.sendStatus(200);
//   } catch (error) {
//     console.error("Error verifying code:", error);
//     return res.sendStatus(500);
//   }
// });

// module.exports = router;
