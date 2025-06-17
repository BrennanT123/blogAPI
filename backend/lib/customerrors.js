//Custom error class taken from https://javascript.info/custom-errors
class CustomErr extends Error {
    constructor(statusCode = 500, msgs = 'Server error'){
        super(msgs);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomErr;