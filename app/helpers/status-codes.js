const successResponse = {status: 'success'};
const errorResponse = {status: 'error'};
const status = {
    success: 200,
    error: 500,
    notfound: 404,
    unauthorized: 401,
    conflict: 409,
    created: 201,
    bad: 400,
    nocontent: 204
};

const bookingStatuses = {
    active: 1.00,
    cancelled: 2.00,
    completed: 3.00,
}

export {
    successResponse,
    errorResponse,
    status,
    bookingStatuses
}