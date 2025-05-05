import express from 'express';
import * as routesController from '../controllers/routesController';

const router = express.Router();


router.get('/authenticate', routesController.authenticateAPI);

export default router;