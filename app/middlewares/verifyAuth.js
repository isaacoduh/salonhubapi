import jwt, { decode } from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
    errorResponse,status
} from '../helpers/status-codes';

dotenv.config();

/***
 * verify token passed
 */
const verifyToken = async (req, res, next) => {
    const {token} = req.headers;
    if(!token) {
        errorResponse.error = 'No Token Provided';
        return res.status(status.bad).send(errorResponse);
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = {
            email: decoded.email,
            user_id: decoded.user_id,
            is_admin: decoded.is_admin,
            fullname: decoded.fullname,
        };
        next();
    } catch (error) {
        errorResponse.error = 'Authentication Failed';
        return res.status(status.unauthorized).send(errorResponse);
    }
}

export default verifyToken;