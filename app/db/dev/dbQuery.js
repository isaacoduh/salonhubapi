import pool from './pool';

export default {
    /**
     * DB Query
     * 
     */
    query(queryText, params){
        return new Promise((resolve, reject) => {
            pool.query(queryText, params).then((response) => {
                resolve(res);
            }).catch((error) => {
                reject(error);
            });
        });
    },
};