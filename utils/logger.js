// Um exemplo simples de logger para registrar mensagens
const logger = (message) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
  };
  
  module.exports = logger;
  