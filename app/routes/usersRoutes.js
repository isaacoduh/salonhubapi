import express from 'express';
import {createUser, signinUser,searchFullName} from '../controllers/usersController';
import router from './salonRoutes';

router.post('/auth/signup', createUser);
router.post('/auth/signin', signinUser);
router.get('/users/fullname', searchFullName);

export default router;