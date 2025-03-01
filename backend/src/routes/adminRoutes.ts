import AdminController from '../controllers/adminController';

import { Router } from 'express';

export default function () {
    const router = Router();

    console.log(`🚀 ~ adminRoutes.ts:8 ~ router:`);

    
    router.post('/signup', AdminController.signup);

    return router;
}
