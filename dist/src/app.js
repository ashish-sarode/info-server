"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const routes_1 = require("./routes");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
dotenv.config({ path: '.env' });
app.set("port", process.env.PORT || 3000);
app.set("mode", process.env.ENV_MODE || 'dev');
app.use('/', express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
let mongodbURI;
if (process.env.ENV_MODE === 'test') {
    mongodbURI = process.env.MONGODB_TEST_URI;
}
else {
    mongodbURI = process.env.MONGODB_URI;
}
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(mongodbURI, { useNewUrlParser: true })
    .then(db => {
    console.log('Connected to MongoDB');
    routes_1.default(app);
})
    .catch(err => console.error(err));
exports.default = app;
//# sourceMappingURL=app.js.map