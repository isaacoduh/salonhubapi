import pool from '../db/dev/pool';
import {hashPassword} from '../helpers/validations';

import {status} from '../helpers/status-codes';

const seedUser = async(req,res) => {
    const seedUserQuery = `INSERT INTO users VALUES (default, 'mendez@gmail.com', 'Isaac Mendez', '${hashPassword('password')}', true, NOW())`;
    try {
        const {rows} = await pool.query(seedUserQuery);
        const dbResponse = rows;
        if(!dbResponse){
            return res.status(status.bad).send('Seeding is not successful');
        }
        return res.status(status.created).send('Seeding users table done');
    } catch (error) {
        return res.status(status.error).send('Error Occured!');
    }
};
export default seedUser;