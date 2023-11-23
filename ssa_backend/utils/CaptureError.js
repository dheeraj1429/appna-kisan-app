class CaptureError extends Error {
    constructor(message, error) {
       super(message);
       this.name = this.constructor.name;
       this.message = message;
       Error.captureStackTrace(this, this.constructor);
       this.statusCode = error || 500;
    }
 }
 
 module.exports = CaptureError;