import moment from 'moment';

import dbQuery from '../db/dev/dbQuery';

import {empty} from '../helpers/validations';
import {errorResponse, successResponse, status} from '../helpers/status-codes';

const createSalon = async(req, res) => {
    const {name, owner, phone, email, address, city} = req.body;
    const {is_admin} = req.user;
    if(!is_admin === true){
        errorResponse.error = 'Sorry You are unauthorized to create a salon';
        return res.status(status.bad).send(errorResponse);
    }
    const created_on = moment(new Date());
    if(empty(name) || empty(owner) || empty(phone) || empty(email) || empty(address) || empty(city)){
        errorResponse.error = 'Please ensure all fields are supplied';
        return res.status(status.bad).send(errorResponse);
    }
    const createSalonQuery = `INSERT INTO salon(name, owner, phone, email, address, city) VALUES($1,$2, $3, $4, $5, $6) returning *`;
    const values = [name, owner,phone, email, address, city];
    try {
        const {rows} = await dbQuery.query(createSalonQuery, values);
        const dbResponse = rows[0];
        successResponse.data = dbResponse;
        return res.status(status.created).send(successResponse);
    } catch (error) {
        errorResponse.error = 'Unable to add salon';
        return res.status(status.error).send(errorResponse);
    }
};

const getAllSalons = async(req, res) => {
    const {is_admin} = req.user;
    if(!is_admin === true){
        errorResponse.error = 'Sorry you are not authorized for this operation';
        return res.status(status.bad).send(errorResponse);
    } 
    const getAllSalons = 'SELECT * FROM salon ORDER BY id DESC';
    try {
        const {rows} = await dbQuery.query(getAllSalons);
        const dbResponse = rows;
        if(dbResponse[0] === undefined){
            errorResponse.error = 'There are no salons';
            return res.status(status.notfound).send(errorResponse);
        }
        successResponse.data = dbResponse;
        return res.status(status.success).send(successResponse);
    } catch (error) {
        errorResponse.error = 'An error occured';
        return res.status(status.error).send(errorResponse);
    }
}

export {createSalon, getAllSalons};