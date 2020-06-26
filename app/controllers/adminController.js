import moment from 'moment';
import dbQuery from '../db/dev/dbQuery';
import {hashPassword, isValidEmail,validatePassword,isEmpty, generateUserToken} from '../helpers/validations';

import {errorResponse, successResponse, status} from '../helpers/status-codes';

/**
 * Create an Admin
 */
const createAdmin = async(req,res) =>{
    const {email, fullname,password} = req.body;
    const {is_admin} = req.user;
    const isAdmin = true;
    const created_on = moment(new Date());
    if(!is_admin === false){
        errorResponse.error = 'Unauthorized to Carry Out this Operation';
        return res.status(status.bad).send(errorResponse);
    }

    if(isEmpty(email) ||isEmpty(fullname) || isEmpty(password)){
        errorResponse.error = 'Email, Fullname, Password fields cannot be empty';
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
    const createUserQuery = `INSERT INTO 
        users(email, fullname, password, is_admin, created_on)
        VALUES($1,$2,$3,$4,$5)
        returning *`;
    const values = [email, fullname, hashedPassword, isAdmin, created_on];
    try{
        const {rows} = await dbQuery.query(createUserQuery, values);
        const dbResponse = rows[0];
        delete dbResponse.password;
        const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.fullname);
        successResponse.data = dbResponse;
        successResponse.data.token = token;
        return res.status(status.created).send(successResponse);
    }catch(error){
        if(error.routine === '_bt_check_unique'){
            errorResponse.error = 'An admin user with that email already exists';
            return res.status(status.conflict).send(errorResponse);
        }
    }
};

const updateUserToAdmin = async(req,res) => {
    const {id} = req.params;
    const {isAdmin} = req.body;
    const {is_admin} = req.user;
    if(!is_admin === true){
        errorResponse.error = 'Sorry you are not authorized for this operation';
        return res.status(status.bad).send(errorResponse);
    } 
    if(isAdmin === ''){
        errorResponse.error = 'Admin status is required';
        return res.status(status.bad).send(errorResponse);
    }

    const findUserQuery = 'SELECT * FROM users WHERE id=$1';
    const updateUser = `UPDATE users SET is_admin=$1 WHERE id=$2 returning *`;
    try {
        const {rows} = await dbQuery.query(findUserQuery, [id]);
        const dbResponse = rows[0];
        if(!dbResponse){
            errorResponse.error = 'User not found';
            return res.status(status.notfound).send(errorResponse);
        }
        const values = [
            isAdmin,
            id
        ];
        const response = await dbQuery.query(updateUser, values);
        const dbResult = response.rows[0];
        delete dbResult.password;
        successResponse.data = dbResult;
        return res.status(status.success).send(successResponse);
    } catch (error) {
        errorResponse.error = 'Operation was not successful';
        return res.status(status.error).send(errorResponse);
    }
};

export {createAdmin,updateUserToAdmin};