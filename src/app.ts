import express = require("express");
import setRoutes from './routes';
import dotenv = require("dotenv");
import * as path from 'path';
import * as mongoose from 'mongoose';

const app = express();
dotenv.config({ path: '.env' });
app.set("port", process.env.PORT || 3000);
app.set("mode", process.env.ENV_MODE || 'dev');
app.use('/', express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



let mongodbURI;
if (process.env.ENV_MODE === 'test') {
    mongodbURI = process.env.MONGODB_TEST_URI;
} else {
    mongodbURI = process.env.MONGODB_URI;
}

mongoose.Promise = global.Promise;
mongoose.connect(mongodbURI, {useNewUrlParser: true})
    .then(db => {
        console.log('Connected to MongoDB');
        setRoutes(app);
    })
    .catch(err => console.error(err));

export default app;