import express from 'express';
import seedUser from '../controllers/seedController';
const router = express.Router();
router.get('/user/seed', seedUser);
export default router;