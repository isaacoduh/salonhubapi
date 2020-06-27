import express from 'express';
import 'babel-polyfill';
import cors from 'cors';
import env from './env';
import usersRoutes from './app/routes/usersRoutes';
import seedRoutes from './app/routes/seedRoutes';
import adminRoutes from './app/routes/adminRoutes';
import slotRoutes from './app/routes/slotRoutes';
import salonRoutes from './app/routes/salonRoutes';
import bookingRoutes from './app/routes/bookingRoutes';

const app = express();

app.use(cors());

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/api/v1', usersRoutes);
app.use('/api/v1', seedRoutes);
app.use('/api/v1', adminRoutes);
app.use('/api/v1', adminRoutes);
app.use('/api/v1', slotRoutes);
app.use('/api/v1',salonRoutes);
app.use('/api/v1', bookingRoutes);

app.listen(env.port).on('listening', () => {
    console.log(`Listening on ${env.port}`);
});

export default app;