const app = require('express')();
const bodyParser = require('body-parser');
const github = require('./github');
const setupController = require('../controllers/setupController');
const mongoose = require('mongoose');
const dbconfig = require('../dbconfig');
const userConfig = require('../models/userConfig');

// user configs will be stored in a mongoDB

// server pseudo code
// request recieved (at slack or github endpoint)
//   if there is an entry for this username in config
//      make appropriate request's to github.js
//      format for output
//      send back to webook for either slack or github

const port = process.env.VCAP_APP_PORT || 3000;
app.use(bodyParser.json({ type: 'application/json' }));
mongoose.connect(dbconfig.dbConnectionString('dev'));
setupController(app);

app.get('/slack/:uid', function(req,res) {
  let user_id = req.params.uid;
  userConfig.find({ userId: user_id }, function(err, config) {
    // parse out not found errors and init user config
    if (err) res.send('there was an error retriving your config info');
    else {
      try{
        // config will be an array of matching documents, put in error handeling if multiple docs returned for one id
        config = config[0];
        let response = '';
        if (config.use_enterprise) {
          let options = {
            url: config.enterprise_url,
            token: config.enterprise_token,
            hours: config.hours,
            username: config.enterprise_un,
            issues: config.issues,
            pull_requests: config.pull_requests,
            commits: config.commits
          };
          github(options).getActivity()
            .then(results => {
              console.log('Enterprise Standup:');
              console.log(JSON.stringify(results));
              //sendToSlack(message);
            })
            .catch(error => {
              console.log('Enterprise Standup:');
              console.log('there was an error getting your Enterprise Standup');
              console.log(error);
              //sendToSlack(error);
            });
        }

        if (config.use_public) {
          let options = {
            url: 'https://api.github.com',
            token: config.public_token,
            hours: config.hours,
            username: config.public_un,
            issues: config.issues,
            pull_requests: config.pull_requests,
            commits: config.commits
          };
          github(options).getActivity()
            .then(results => {
              console.log('Public Standup:');
              console.log(JSON.stringify(results));
              //sendToSlack(message);
            })
            .catch(error => {
              console.log('Public Standup');
              console.log(JSON.stringify(error));
              //sendToSlack(error);
            });
        }
        console.log(response);
        res.send(response);
      } catch(error) {
        console.log(error);
        res.send('there was an error getting your events');
      }
    }
  });
});

app.get('/github', function(req,res) {
  console.log('recieved request at github endpoint');
});

app.listen(port);