require('dotenv').config();
require('./Configurations/cron')
const app = require('./app');
const { createServer } = require('http');

const port = process.env.PORT || 5000;
const server = createServer(app);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

