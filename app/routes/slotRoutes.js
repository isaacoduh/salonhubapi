import express from 'express';

import {createSlot,getAllSlots} from '../controllers/slotController';

import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

router.post('/slots', verifyAuth,createSlot);
router.get('/slots', verifyAuth,getAllSlots);

export default router;