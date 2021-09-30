const express = require('express');
const router = express.Router();
const getQueues = require('../controllers/getQueues');
const pending = require('../controllers/pending');
const active = require('../controllers/active');
const completed = require('../controllers/completed');
const failed = require('../controllers/failed');
const delayed = require('../controllers/delayed');
const { count } = require('../controllers/count');
const jobInfo = require('../controllers/jobInfo');
const deleteJobById = require('../controllers/deleteJobById');
const retryJob = require('../controllers/retryJob');

router.get('/queues', getQueues);
router.get('/pending', pending);
router.get('/active', active);
router.get('/completed', completed);
router.get('/failed', failed);
router.get('/delayed', delayed);
router.get('/count', count);
router.get('/job/:queue/:jobId', jobInfo);
router.delete('/job/:queue/:jobId', deleteJobById);
router.put('/job/:queue/:jobId', retryJob);

module.exports = router;
