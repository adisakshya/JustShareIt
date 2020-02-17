const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const auth = require('../middleware/adminAuth');

/* List of users */
router.route('/users')
  .post(auth, controller.usersList);

/* Approve request for a user */
router.route('/approve')
  .post(auth, controller.approveUser);

/* Reject request for a user */
router.route('/reject')
  .post(auth, controller.rejectUser);

/* Admin Index Page */
router.route('/')
  .get(auth, controller.adminIndex);

module.exports = router