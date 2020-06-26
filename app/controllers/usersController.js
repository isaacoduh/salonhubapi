import moment from 'moment';
import dbQuery from '../db/dev/dbQuery';

import {hashPassword, comparePassword, isValidEmail, validatePassword, isEmpty, generateUserToken} from '../helpers/validations';
import {errorResponse, successResponse,status} from '../helpers/status-codes';


const createUser = async(req, res) => {
    const {email,fullname,password} = req.body;
    const created_on = moment(new Date());
    if(isEmpty(email) || isEmpty(fullname) || isEmpty(password)){
        errorResponse.error = 'Email, password, cannot be empty';
        return res.status(status.bad).send(errorResponse);
    }
    if(!isValidEmail(email)){
        errorResponse.error = 'Please enter a valid email';
        return res.status(status.bad).send(errorResponse);
    }
    if(!validatePassword(password)){
        errorResponse.error = 'Password must be more than five(5) characters';
        return res.status(status.bad).send(errorResponse);
    }
    const hashedPassword = hashPassword(password);
    const createUserQuery = `INSERT INTO users(email, fullname, password, created_on)
        VALUES($1, $2, $3, $4)
        returning *`;
    const values = [email, fullname, hashedPassword, created_on];
    try {
        const {rows} = await dbQuery.query(createUserQuery, values);
        const dbResponse = rows[0];
        delete dbResponse.password;
        const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.fullname);
        delete dbResponse.password;
        successResponse.data = token;
        successResponse.data.token = token;
        return res.status(status.created).send(successResponse);
    } catch (error) {
        if (error.routine === '_bt_check_unique') {
            errorMessage.error = 'User with that EMAIL already exist';
            return res.status(status.conflict).send(errorMessage);
        }
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const signinUser = async(req, res) => {
    const {email, password} = req.body;
    if(isEmpty(email) || isEmpty(password)){
        errorResponse.error = 'Email or Password detail is missing';
        return res.status(status.bad).send(errorResponse);
    }
    if(!isValidEmail(email) || !validatePassword(password)){
        errorResponse.error = 'Please enter a valid email or password';
        return res.status(status.bad).send(errorResponse);
    }
    const signinUserQuery = 'SELECT * FROM user WHERE email = $1';
    try {
        const {rows} = await dbQuery.query(signinUserQuery, [email]);
        const dbResponse = rows[0];
        if(!dbResponse){
            errorResponse.error = 'User with this email does not exist';
            return res.status(status.notfound).send(errorResponse);
        }
        if(!comparePassword(dbResponse.password, password)){
            errorResponse.error = 'The password you provided is incorrect';
            return res.status(status.bad).send(errorResponse);
        }
        const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.fullname);
        delete dbResponse.password;
        successResponse.data = dbResponse;
        successResponse.data.token = token;
        return res.status(status.success).send(successResponse);
    } catch (error) {
        errorResponse.error = 'Operation was not successful';
        return res.status(status.error).send(errorResponse);
    }
}

const searchFullName = async(req, res) => {
    const {fullname} = req.query;
    const searchQuery = 'SELECT * from users WHERE fullname = $1 ORDER BY id DESC';
    try{
        const {rows} = await dbQuery.query(searchQuery, [fullname]);
        const dbResponse = rows;
        if(!dbResponse[0]){
            errorResponse.error = 'No user with such name';
            return res.status(status.notfound).send(errorResponse);
        }
        successResponse.data = dbResponse;
        return res.status(status.success).send(successResponse);
    }catch(error){
        errorResponse = 'Operation not successful';
        return res.status(status.error).send(errorResponse);
    }
}

export {createUser, signinUser, searchFullName};