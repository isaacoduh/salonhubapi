import pool from '../db/dev/pool';

pool.on('connect', () => {
    console.log('connected to the db');
});

const seed  = () => {
    const seedUserQuery = `INSERT INTO users VALUES (default, 'mendez@gmail.com', 'Isaac Mendez', 'password', true, NOW())`;
    pool.query(seedUserQuery).then((res) => {
        console.log(res);
        pool.end();
    }).catch((error) => {
        console.log(error);
        pool.end();
    });
};

const seedUser = () => {seed()};
pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
});
export {seedUser};
require('make-runnable');