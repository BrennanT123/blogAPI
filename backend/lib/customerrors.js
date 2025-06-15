//Custom error class taken from https://javascript.info/custom-errors
class CustomErr extends Error {
    constructor(statusCode = 500, message = 'Server error'){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomErr;