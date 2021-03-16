const errorHandler = (err, req, res, next) => {
    if (err.type) {


      res.status(err.status).json({
        error: {
          message: err.message,
          status: err.status,
          developerMessage: err.developerMessage
        }
      });
    } else { 
        req.returnTemplate(err, err.message,500);


    //   res.status(500).json(err);
    }
  };
  
  module.exports = errorHandler;