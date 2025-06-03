// functions/routes/products.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();
//REACT_APP_BACKEND_URL=https://api-xm6lhi6uuq-uc.a.run.app/

// Ensure admin is initialized. (This is usually done in your index.js once.)
// if (!admin.apps.length) {
//   admin.initializeApp(); 
// }
router.post('/', async (req, res) => {
  const { email, password, companyId } = req.body;

  // Validate required fields
  if (!email || !password || !companyId) {
    return res
      .status(400)
      .json({ error: 'Missing required fields: email, password, and companyId' });
  } 

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Store additional user data in Firestore
// Instead of using admin.firestore().collection(...):
await db.collection('users').doc(userRecord.uid).set({
  email,
  companyId,
  isVerified:false,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
});


    return res.status(201).json({
      message: 'User created successfully',
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/checkVerified', async (req, res) => {
  const { email } = req.body;

  // Validate the email is provided
  if (!email) {
    return res.status(400).json({ error: 'Missing required field: email' });
  }

  try {
    // Query Firestore for a user document with the provided email
    const querySnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve the first (and expected only) matching document
    const userDoc = querySnapshot.docs[0];
    const { isVerified } = userDoc.data();

    return res.status(200).json({ email, isVerified });
  } catch (error) {
    console.error('Error checking verification status:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/update-info', async (req, res) => {
  const { email, password, companyId } = req.body;

  // Validate required fields
  if (!email || !password || !companyId) {
    return res
      .status(400)
      .json({ error: 'Missing required fields: email, password, and companyId' });
  } 

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Store additional user data in Firestore
// Instead of using admin.firestore().collection(...):
await db.collection('users').doc(userRecord.uid).update({
  email,
  companyId,


});


    return res.status(201).json({
      message: 'User created successfully',
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: error.message });
  }
});



module.exports = router;
