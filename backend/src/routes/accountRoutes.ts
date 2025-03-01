import { Router } from 'express';
import * as AccountController from '../controllers/accountController';
import authMidd from '../middlewares/authMidd'
const router = Router();

router.use(authMidd);
router.get('/balance', AccountController.GetBalance);
router.post('/transfer', AccountController.Transfer);
export default router;