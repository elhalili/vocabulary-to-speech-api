const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT | 1000;

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api/generate-audio/', require('./routes/api'));

app.listen(PORT, () => {
    console.log(`API is now running on port ${PORT}`);
});
