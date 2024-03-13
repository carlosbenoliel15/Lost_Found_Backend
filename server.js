const app = require('./app');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server runnning on port ${PORT}`);
});
