/*
 * Handle routes from endpoints.
 */
var profileRouter = require('express').Router();
var userController = require('../controllers/userController');
var groupController = require('../controllers/groupController');
var characterProfileController = require('../controllers/characterProfileController');
var groupProfileController = require('../controllers/groupProfileController');
var util = require('../lib/utility');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + '/../../client/uploads/');
  },
  filename: function(req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + '.' +  util.mimeExtension[file.mimetype])
  }
});

var upload = multer({storage: storage});

profileRouter
  .route('/users')
  .get(userController.findUsers);

profileRouter
  .route('/users/:uid')
  .get(userController.findUser)
  .put(util.restrictUserOwnerOnly, userController.updateUser);

profileRouter
  .route('/users/:uid/characterProfiles')
  .get(userController.findCharacterProfiles)
  .post(util.restrictUserOwnerOnly, userController.createCharacterProfile);

profileRouter
  .route('/users/:uid/characterProfiles/:cpid')
  .get(userController.findCharacterProfile)
  .put(util.restrictUserOwnerOnly, userController.updateCharacterProfile);

profileRouter
  .route('/users/:uid/photos')
  .post(util.restrictUserOwnerOnly, upload.single('userPhoto'), userController.uploadPhoto);

profileRouter
  .route('/characterProfiles')
  .get(characterProfileController.findCharacterProfiles);

profileRouter
  .route('/characterProfiles/:cpid')
  .get(characterProfileController.findCharacterProfileByProfileId);

profileRouter
  .route('/characterProfiles/:cpid/messages')
  .post(util.checkUser, characterProfileController.postMessage);

profileRouter
  .route('/groups')
  .get(groupController.findGroups);

profileRouter
  .route('/groups/:gid')
  .get(groupController.findGroup)
  .put(groupController.updateGroup);

profileRouter
  .route('/groups/:gid/photos')
  .post(util.restrictGroupOwnerOnly, upload.single('groupPhoto'), groupController.uploadPhoto);

profileRouter
  .route('/groups/:gid/groupProfiles')
  .get(groupController.findGroupProfilesById)
  .post(util.restrictGroupOwnerOnly, groupController.createGroupProfile);

profileRouter
  .route('/groups/:gid/groupProfiles/:gpid')
  .get(groupController.findGroupProfile)
  .put(util.restrictGroupOwnerOnly, groupController.updateGroupProfile);

profileRouter
  .route('/groupProfiles')
  .get(groupProfileController.findGroupProfiles);

profileRouter
  .route('/groupProfiles/:gpid')
  .get(groupProfileController.findGroupProfileByProfileId);

profileRouter
  .route('/groupProfiles/:gpid/messages')
  .post(util.checkUser, groupProfileController.postMessage);

mimeExtension = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/gif': 'gif'
};

module.exports = profileRouter;
