require("dotenv").config();
import cors from "cors";
import logger from "morgan";
import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import "./services/google";
const mongoose = require('mongoose')
var session = require('express-session');
var MongoStore = require('connect-mongo').default;

const app = express();
mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}).then(db => {
  console.log("Database connected");
});

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(logger("dev"));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});




routes(app);

const port = process.env.PORT || 2000;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
