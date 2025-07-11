import * as UserController from '../controllers/userController';
import { Router, Request, Response } from 'express';
import authMidd from '../middlewares/authMidd';

export default function () {
    const router = Router();

    console.log(`🚀 ~ userRoutes.ts:8 ~ router: `);
    router.get('/ping', (req: Request, res: Response): any => res.send('pong'));
    router.post('/signup', UserController.signup);
    router.post('/signin', UserController.signin);

    //Authenticated Routes
    router.use(authMidd);
    router.get('/all?', UserController.getUsers);
    router.post('/update', UserController.updateUser);
    router.get('/signout',UserController.signout);
    router.get('/:id?', UserController.getUser);
    return router;

}
