const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

/* Login route */
router.route('/')
  .get(controller.loginIndex)
  .post(controller.loginIndex);

/* Handle user request */
router.route('/request')
  .post(controller.userRequests);

/* List of users */
router.route('/users')
  .post(controller.usersList);

/* Approve request for a user */
router.route('/approve')
  .post(controller.approveUser);

/* Reject request for a user */
router.route('/reject')
  .post(controller.rejectUser);

/* Verify access for a user */
router.route('/verify')
  .post(controller.verifyUser);

/* Client index page */
router.route('/client')
  .post(controller.clientIndex);

/* Admin Index Page */
router.route('/admin')
  .get(controller.adminIndex);

/* QR Code */
router.route('/qr')
  .get(controller.qrCode);

module.exports = router;
