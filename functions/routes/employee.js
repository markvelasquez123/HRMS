const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const checkToken = require('../middlewares/checkToken');


router.post('/addEmployee', checkToken, async (req, res) => {
  console.log("Received employee data:", req.body);

  const {
      firstName,
      lastName,
      middleName,
      avatar,
      birthDay,
      birthMonth,
      birthYear,
      email,
      phone,
      gender,
      idNumber,
      position,
      department,
      dateHired,
      city,
      state,
      street1,
      street2,
      zip,
      resumeUrl,
      employeeType
  } = req.body;


  const requiredFields = {
      firstName: 'First name',
      lastName: 'Last name',
      avatar: 'Profile photo',
      birthDay: 'Birth day',
      birthMonth: 'Birth month',
      birthYear: 'Birth year',
      email: 'Email',
      phone: 'Phone',
      idNumber: 'ID Number',
      gender: '',
      position: 'Position',
      department: 'Department',
      dateHired: 'Date hired',
      street1: 'Street address',
      city: 'City',
      state: 'State',
      zip: 'ZIP code',
      employeeType: 'Employee Type',
      resumeUrl: 'Resume'
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

      const parsedDateHired = new Date(dateHired);
      if (isNaN(parsedDateHired.getTime())) {
          return res.status(400).json({
              error: 'Invalid hire date',
              receivedDate: dateHired
          });
      }

      const employeeId = uuidv4();

      

      const employeeData = {
          firstName,
          lastName,
          middleName: middleName || '',
          photoUrl: avatar,
          birthDate: admin.firestore.Timestamp.fromDate(parsedBirthDate),
          email,
          phone,
          idNumber,
          gender,
          position,
          department,
          dateHired: admin.firestore.Timestamp.fromDate(parsedDateHired),
          city,
          state,
          street1,
          street2: street2 || '',
          zip,
          status: 'employed',
          resumeUrl,
          employeeType,
          passport: req.body.passport || '',
          diploma: req.body.diploma || '',
          tor: req.body.tor || '',
          medical: req.body.medical || '',
          tinId: req.body.tinId || '',
          nbiClearance: req.body.nbiClearance || '',
          policeClearance: req.body.policeClearance || '',
          pagibigNumber: req.body.pagibigNumber || '',
          philhealthNumber: req.body.philhealthNumber || '',
          uid: employeeId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection('employees').doc(employeeId).set(employeeData);
      
      return res.status(201).json({
          message: 'Employee added successfully',
          employeeId
      });

  } catch (error) {
      console.error('Error adding employee:', error);
      return res.status(500).json({
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
  }
});




router.get('/getEmployee', async (req, res) => {
    try {
        const employeesRef = db.collection("employees");
        const snapshot = await employeesRef.get();
        const employees = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            // Log the raw data for debugging
            console.log("Raw employee data:", data);
            
            const employee = {
                uid: doc.id,
                id: doc.id,
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                idNumber: data.idNumber || "",
                position: data.position || "",
                dateHired: data.dateHired || "",
                email: data.email || "",
                phone: data.phone || "",
                gender: data.gender || "",
                employeeType: data.employeeType || "",
                department: data.department || "",
                status: data.status || "",
                resumeUrl: data.resumeUrl || "",
                passport: data.passport || "",
                diploma: data.diploma || "",
                tor: data.tor || "",
                medical: data.medical || "",
                tinId: data.tinId || "",
                nbiClearance: data.nbiClearance || "",
                policeClearance: data.policeClearance || "",
                pagibigNumber: data.pagibigNumber || "",
                philhealthNumber: data.philhealthNumber || "",
                photoUrl: data.photoUrl || data.avatar || "",
                birthDate: data.birthDate || "",
                street1: data.street1 || "",
                street2: data.street2 || "",
                city: data.city || "",
                state: data.state || "",
                zip: data.zip || "",
                educations: data.educations || [],
                workExperiences: data.workExperiences || []
            };
            
            // Log the processed employee data
            console.log("Processed employee data:", employee);
            
            employees.push(employee);
        });
        res.json(employees);
    } catch (error) {
        console.error("Error getting employees:", error);
        res.status(500).json({ error: "Failed to get employees" });
    }
});

module.exports = router;
