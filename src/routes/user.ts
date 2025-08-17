import { Router } from 'express';
import { blockUser, getAllUsers, getUserById } from '../controllers/user';
import auth from '../middlewares/auth';
import { validateBlockUser, validateObjId } from '../middlewares/validatons';

const router = Router();

router.get('/', auth, getAllUsers);
router.get('/:id', auth, validateObjId, getUserById);
router.patch('/:id', auth, validateBlockUser, blockUser);

export default router;
