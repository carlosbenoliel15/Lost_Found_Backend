const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack); // Log do erro no console ou em algum sistema de log
  
    // Verifica se o erro é um erro personalizado com um código HTTP definido
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      // Caso contrário, trata o erro como um erro interno do servidor (HTTP 500)
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = errorMiddleware;
  