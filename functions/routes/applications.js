const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const checkToken = require('../middlewares/checkToken');

router.post('/addApplicant', async (req, res) => {
  console.log("Received application data:", req.body);

  const {
    firstName,
    lastName,
    middleName,
    avatar,
    birthDay,
    birthMonth,
    birthYear,
    gender,
    email,
    phone,
    city,
    state,
    street1,
    street2,
    zip,
    resumeUrl,       
    position,
    passport,
    diploma,
    tor,
    medical,
    tinId,
    nbiClearance,
    policeClearance,
    pagibigNumber,
    philhealthNumber
    
  } = req.body;

  const requiredFields = {
    firstName: 'First name',
    lastName: 'Last name',
    avatar: 'Profile photo',
    birthDay: 'Birth day',
    birthMonth: 'Birth month',
    birthYear: 'Birth year',
    email: 'Email',
    gender: 'Gender',
    phone: 'Phone',
    street1: 'Street address',
    city: 'City',
    state: 'State',
    zip: 'ZIP code',
    resumeUrl: 'Resume',
    position: 'Position',
    passport: 'Passport',
    diploma: 'Diploma',
    tor: 'TOR',
    medical: 'Medical',
    tinId: 'TIN ID',
    nbiClearance: 'NBI Clearance',
    policeClearance: 'Police Clearance',
    pagibigNumber: 'Pag-ibig Number ',
    philhealthNumber: 'Philhealth Number'

  };

  const missingFields = Object.entries(requiredFields)
    .filter(([key]) => !req.body[key])
    .map(([_, value]) => value);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields,
      receivedBody: req.body
    });
  }

  try {
    const pad = (n) => String(n).padStart(2, '0');
    const birthDateString = `${birthYear}-${pad(birthMonth)}-${pad(birthDay)}`;
    const parsedBirthDate = new Date(birthDateString);

    if (isNaN(parsedBirthDate.getTime())) {
      return res.status(400).json({
        error: 'Invalid birth date',
        receivedDate: birthDateString
      });
    }

    const applicantId = uuidv4();

    const applicantData = {
      firstName,
      lastName,
      middleName: middleName || '',
      photoUrl: avatar,
      birthDate: admin.firestore.Timestamp.fromDate(parsedBirthDate),
      email,
      phone,
      city,
      gender,
      state,
      street1,
      street2: street2 || '',
      zip,
      status: 'hiringInProcess',
      resumeUrl,
      uid: applicantId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      position,
      passport,
      diploma,
      tor,
      medical,
      tinId,
      nbiClearance,
      policeClearance,
      pagibigNumber,
      philhealthNumber

    };

    await db.collection('applications').doc(applicantId).set(applicantData);

    return res.status(201).json({
      message: 'Application created successfully',
      applicantId
    });

  } catch (error) {
    console.error('Error creating application:', error);
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.get('/getAllApplicants', async (req, res) => {
  try {
    const applicantsRef = db.collection('applications');
    const snapshot = await applicantsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No applicants found' });
    }

    const applicants = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(applicants);

  } catch (error) {
    console.error('Error fetching applicants:', error);
    return res.status(500).json({ error: error.message });
  }
});
router.get('/getResignedEmployees', async (req, res) => {
  try {
    const employeesRef = db.collection("employees");
    const snapshot = await employeesRef.where("status", "==", "Resigned").get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No resigned employees found" });
    }

    const resignedEmployees = snapshot.docs.map(doc => ({
      employeeId: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(resignedEmployees);
  } catch (error) {
    console.error("Error fetching resigned employees:", error);
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});


// Add new route for updating applicant status
router.put('/updateApplicantStatus/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { status, employeeType, department } = req.body;

    const applicantRef = db.collection('applications').doc(uid);
    const applicantDoc = await applicantRef.get();

    if (!applicantDoc.exists) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    await applicantRef.update({
      status,
      employeeType,
      department,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({ message: 'Applicant status updated successfully' });
  } catch (error) {
    console.error('Error updating applicant status:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
