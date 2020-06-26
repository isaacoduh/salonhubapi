import pool  from './pool';


pool.on('connect', () => {
    console.log('connected to the db');
});

/**
 * Create user Table
 */
const createUserTable = () => {
    const userCreateQuery = `CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email VARCHAR(100) UNIQUE NOT NULL, fullname VARCHAR(100), password VARCHAR NOT NULL, is_admin BOOL DEFAULT(false), created_on DATE NOT NULL)`;
    pool.query(userCreateQuery).then((res) => {
        console.log(res);
        pool.end();
    }).catch((error) => {
        console.log(error);
        pool.end();
    });
};

const createSalonTable = () => {
    const salonCreateQuery = `CREATE TABLE IF NOT EXISTS salon (id SERIAL PRIMARY KEY, name VARCHAR(100), owner VARCHAR(100), phone VARCHAR(100), email VARCHAR(100), address VARCHAR(100), city VARCHAR(100), created_on DATE NOT NULL)`;
    pool.query(salonCreateQuery).then((res) => {
        console.log(res);
        pool.end();
    }).catch((error) => {
        console.log(error);
        pool.end();
    });
};

const createSlotTable = () => {
    const slotCreateQuery = `CREATE TABLE IF NOT EXISTS slot (id SERIAL PRIMARY KEY, 
        salon_id INTEGER REFERENCES salon(id) ON DELETE CASCADE, 
        slot_name VARCHAR(300) NOT NULL,
        slot_date DATE NOT NULL, 
        status float DEFAULT(1.00), 
        created_on DATE NOT NULL)`;
    pool.query(slotCreateQuery).then((res) => {
        console.log(res);
        pool.end();
    }).catch((error) => {
        console.log(error);
        pool.end();
    });
};

const createBookingTable = () => {
    const bookingCreateQuery = `CREATE TABLE IF NOT EXISTS booking(id SERIAL, 
        slot_id INTEGER REFERENCES slot(id) ON DELETE CASCADE, 
        user_id INTEGER REFERENCES users(id) ON  DELETE CASCADE, 
        salon_id INTEGER REFERENCES salon(id) ON DELETE CASCADE, 
        booking_date DATE, 
        fullname VARCHAR (100) NOT NULL, 
        email VARCHAR(100) NOT NULL, 
        created_on DATE NOT NULL, 
        PRIMARY KEY (id, slot_id, user_id))`;
    pool.query(bookingCreateQuery).then((res) =>{
        console.log(res);
        pool.end();
    }).catch((error) => {
        console.log(error);
        pool.end();
    });
};


// Drop Tables
const dropUserTable = () => {
    const usersDropQuery = 'DROP TABLE IF EXISTS users';
    pool.query(usersDropQuery).then((res) => {
        console.log(res);
        pool.end();
    }).catch((error) => {
        console.log(error);
        pool.end();
    });
};


const dropSalonTable = () => {
    const salonDropQuery = 'DROP TABLE IF EXISTS salon';
    pool.query(salonDropQuery).then((res) => {
        console.log(res);
        pool.end();
    }).catch((error) => {
        console.log(error);
        pool.end();
    });
};

const dropSlotTable = () => {
    const slotDropQuery = 'DROP TABLE IF EXISTS slot';
    pool.query(slotDropQuery).then((res) => {
        console.log(res);
        pool.end();
    }).catch((error) => {
        console.log(error);
        pool.end();
    });
};


const dropBookingTable = () => {
    const bookingDropQuery = 'DROP TABLE IF EXISTS booking';
    pool.query(bookingDropQuery).then((res) => {
        console.log(res);
        pool.end();
    }).catch((error) => {
        console.log(error);
        pool.end();
    });
};


// Create all tables
const createAllTables = () => {
    createUserTable();
    createSalonTable();
    createSlotTable();
    createBookingTable();
}


const dropAllTables = () => {
    dropUserTable();
    dropSalonTable();
    dropSlotTable();
    dropBookingTable();
}

pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
});

export {createAllTables,dropAllTables};

require('make-runnable');