const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbconfig = require('../dbconfig');
const port = process.env.VCAP_APP_PORT || 3000;
const routes = require('./routes');

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();
let mongo_env = 'prod';
if(appEnv.url.indexOf('local') > -1) { //if appEnv cannont find cfenv 'local', then we are running locally
  mongo_env = 'dev';
}

app.use(bodyParser.urlencoded({ type: 'application/x-www-form-urlencoded' }));
mongoose.connect(dbconfig.dbConnectionString(mongo_env));
//setupController(app); // seed database

routes(app);

app.listen(port);

// Cases
// - */slack should always send back a response, good or bad* whether there an uncaught error propegating up to this call, or an error during execution, or a success
// - if use public we should always call github once with public visa versa
// - if use both we should call both
// - we should get output which mentions either one or both types

//Cases /callback/github
// - If there is an error trying to save user info you should get a response.
// - If there is no error you should get a response.

// Cases getToken
// if public we should make the appropriate call
// if there was an error we should return an error?

// Cases saveToken
// - if type is public we should try to save a public token
// - if type is enterprise we should try to save an enterprise token
// - if a user already exist's we should update a record
// - if this is a new user we should create a new record
// - if there is an error we should return an error
// - if there was an error getting the username we should log this
// - if there was an error saving to the db we should log this

// Cases getUsername
// if there is an error getting the username we should return an error
// if there is no error we should return a username