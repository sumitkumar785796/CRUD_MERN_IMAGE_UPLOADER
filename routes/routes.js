const express = require('express');
const router = express.Router();
const link = require('../controllers/controllers');

router.route("/").get(link.MainPage);
router.route('/insert').get(link.InsertPage);
router.route('/add').post(link.handleImageUploadAndInsert);
router.route('/update/:id').get(link.UpdatePage);
router.route('/edit/:id').put(link.handleImageUploadAndUpdate);
router.route('/view').get(link.ViewPage);
router.route('/delete/:id').delete(link.deleteRecord);
router.route('*').get(link.PageNotFound);

module.exports = router;
