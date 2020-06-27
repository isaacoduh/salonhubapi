import momemnt from 'moment';
import dbQuery from '../db/dev/dbQuery';

import {empty} from '../helpers/validations';

import {errorResponse,successResponse,status} from '../helpers/status-codes';

const createBooking = async (req, res) => {
    const {slot_id, salon_id,booking_date, status, created_on } = req.body;
    const {fullname, user_id, email} = req.user;
    const created_on = momemnt(new Date());
    if(empty(slot_id)){
        errorResponse.error = 'Slot is required';
        return res.status(400).send(errorResponse);
    }
    const createBookingQuery = `INSERT INTO booking(slot_id,salon_id,user_id,booking_date,fullname,email,status,created_on) VALUES($1,$2,$3,$4,$5,$6,$7,$8) returning *`;
    const values = [slot_id,salon_id,user_id, booking_date,fullname,email,created_on];
    try {
        const {rows} = await dbQuery.query(createBookingQuery,values);
        const dbResponse = rows[0];
        successResponse.data = dbResponse;
        return res.status(201).send(successResponse);
    } catch (error) {
        if(error.routine === '_bt_check_unique'){
            errorResponse.error = 'Booking slot is not unique';
            return res.status(status.conflict).send(errorMessage);
        }
        errorMessage.error = 'Unable to create a booking';
        return res.status(500).send(errorResponse);
    }
};

const getAllBookings = async(req, res) =>{
    const {is_admin, user_id} = req.user;
    if(!is_admin === true){
        const getAllBookingsQuery = 'SELECT * FROM booking WHERE user_id =$1';
        try {
            const {rows} = await dbQuery.query(getAllBookingsQuery,[user_id]);
            const dbResponse = rows;
            if(dbResponse[0] === undefined){
                errorResponse.error = 'You have no bookings';
                return res.status(404).send(errorResponse);
            }
            successResponse.data = dbResponse;
            return res.status(status.success).send(successResponse);
        } catch (error) {
            errorResponse.error = 'An error occured';
            return res.status(status.error).send(errorResponse);
        }
    }
    const getAllBookingsQuery = 'SELECT * FROM booking ORDER BY id DESC';
    try{
        const {rows} = await dbQuery.query(getAllBookingsQuery);
        const dbResponse = rows;
        if(dbResponse[0] === undefined){
            errorResponse.error = 'There are no bookings';
            return res.status(status.bad).send(errorResponse);
        }
        successResponse.data = dbResponse;
        return res.status(status.success).send(successResponse);
    }catch(error){
        errorResponse.error = 'An error occured';
        return res.status(status.error).send(errorResponse);
    }
};

const deleteBooking = async(req,res) =>{
    const {bookingId} = req.params;
    const {user_id} = req.user;
    const deleteBookingQuery = 'DELETE FROM booking WHERE id=$1 AND user_id = $2 returning *';
    try {
        const {rows} = await dbQuery.query(deleteBookingQuery,[bookingId, user_id]);
        const dbResponse = rows[0];
        if(!dbResponse){
            errorResponse.error = 'You have no bookings with that id';
            return res.status(status.notfound).send(errorResponse);
        }
        successResponse.data = {};
        successResponse.data.message = 'Booking Deleted Successfully';
        return res.status(status.success).send(successResponse);
    } catch (error) {
        return res.status(status.error).send(error);
    }
};

export {createBooking,getAllBookings,deleteBooking};