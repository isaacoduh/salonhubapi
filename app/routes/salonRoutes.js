import express from 'express';

import {createSalon,getAllSalons} from '../controllers/salonController';
import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

router.post('/salons', verifyAuth, createSalon);
router.get('/salons', verifyAuth, getAllSalons);

export default router;