const catchAsync = (callback) => {
    return (req, res, next) => {
       callback(req, res, next).catch((error) => {
          next(error);
       });
    };
 };
 
 module.exports = catchAsync;