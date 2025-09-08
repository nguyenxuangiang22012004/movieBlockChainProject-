// routes/tvseries.routes.js
import express from 'express';
import * as tvSeriesController from '../controllers/upload/uploadTVSeriesController.js';

const router = express.Router();

router.post('/tvseries', tvSeriesController.createTVSeries);

router.get('/tvseries', tvSeriesController.getAllTVSeries);

export default router;