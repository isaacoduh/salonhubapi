import moment from 'moment';
import dbQuery from '../db/dev/dbQuery';

import {isEmpty, empty} from '../helpers/validations';
import {errorResponse, successResponse, status, } from '../helpers/status-codes';

const createSlot = async(req, res) => {
    const {salon_id, slot_name, slot_date} = req.body;
    const {is_admin} = req.user;
    if (!is_admin === true) {
        errorMessage.error = 'Sorry You are unauthorized to create a trip';
        return res.status(status.bad).send(errorMessage);
    }
    const created_on = moment(new Date());
    if(empty(salon_id) || isEmpty(slot_name) || empty(slot_date)){
        errorResponse.error = 'Please make sure all fields are filled in';
        return res.status(status.bad).send(errorResponse);
    }
    const createSlotQuery = `INSERT INTO salon(salon_id, slot_name, slot_date, created_on) VALUES($1,$2,$3,$4) returning *`;
    const values = [salon_id, slot_name, slot_date, created_on];
    try {
        const {rows} = await dbQuery.query(createSlotQuery, values);
        const dbResponse = rows[0];
        successResponse.data = dbResponse;
        return res.status(status.created).send(successResponse);
    } catch (error) {
        errorResponse.error = 'Unable to create a slot';
        return res.status(status.error).send(errorResponse);
    }
};

const getAllSlots = async(req, res) => {
    const getAllSlotQuery = 'SELECT * FROM slot ORDER BY id DESC';
    try{
        const {rows} = await dbQuery.query(getAllSlotQuery);
        const dbResponse = rows;
        if(!dbResponse[0]){
            errorResponse.error = 'There are no slots';
            return res.status(status.notfound).send(successResponse);
        }
        successResponse.data = dbResponse;
        return res.status(status.success).send(successResponse);
    }catch(error){
        errorResponse.error = 'Operation not successful';
        return res.status(status.error).send(errorResponse);
    }
}

export {createSlot, getAllSlots};