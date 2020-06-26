import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../../env';

/**
 * Hash password
 */
const saltRounds = 10;
const salt = bcrypt.genSalt(saltRounds);
const hashPassword = password => bcrypt.hashSync(password,salt);

/**
 * compare Password
 */
const comparePassword = (hashPassword,password) => {
    return bcrypt.compare(password,hashedPassword);
};

/**
 * valid email helper
 */
const isValidEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
};

/**
 * validatePassword method
 */
const validatePassword = (password) => {
    if(password.length <= 5 || password === ''){
        return false;
    }
    return true;
}

/**
 * 
 * @param {string, integer} input
 * @returns {Boolean} True or False 
 */
const isEmpty = (input) => {
    if(input === undefined || input === ''){
        return true;
    }
    if(input.replace(/\s/g,'').length){
        return false;
    }
    return true;
};


const empty =(input) =>{
    if(input === undefined || input === ''){
        return true;
    } 
};

const generateUserToken = (email, id, is_admin, fullname) => {
    const token = jwt.sign({email,user_id:id, is_admin, fullname}, env.secret, {expiresIn: '3d'});
    return token;
}


export {
    hashPassword,
    comparePassword,
    isValidEmail,
    validatePassword,
    isEmpty,
    empty,
    generateUserToken
};