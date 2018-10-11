const userConfig = require('../../models/userConfig');
const axios = require('axios');
const github = require('../github');
const output = require('../output_slack');
const express = require('express');
const cfenv = require('cfenv');

require('dotenv').config();
const client_id_pub = process.env.CLIENT_ID_PUB;
const client_id_enterprise = process.env.CLIENT_ID_ENTERPRISE;
const bot_token = process.env.BOT_TOKEN;
const appEnv = cfenv.getAppEnv();
if(appEnv.url.indexOf('local') > -1) { //if appEnv cannont find cfenv 'local', then we are running locally
  appEnv.url = undefined;
}
const host = appEnv.url || process.env.NGROK;
let ent_host = 'ibm';

module.exports = function(app) {
  const route = express.Router();

  app.use(route);

  route.post('/slack', function (req,res) {
    let user_id = req.body.user_id;
    let response_url = req.body.response_url;
    userConfig.find({ userId: user_id }, function(err, config) {
      if (err) {
        res.send('there was an error retriving your config info');
        console.log(err);
      } else if (config.length == 0) { // this User has never authorized standup-helper
        let gh_auth_enterprise = `https://github.${ent_host}.com/login/oauth/authorize?client_id=${client_id_enterprise}&redirect_uri=${host}/callback/github&scope=notifications&state=${response_url}also${user_id}alsoenterprise&allow_signup=true`;
        let gh_auth_public = `https://github.com/login/oauth/authorize?client_id=${client_id_pub}&redirect_uri=${host}/callback/github&scope=notifications&state=${response_url}also${user_id}alsopublic&allow_signup=true`;
        res.send('Authorize Standup-Helper by following both links below');
        authMessage(req.body,gh_auth_public,gh_auth_enterprise);
      } else { // there is configuration info stored already for this user
        try { 
          config = config[0]; // config should never return more than one result if there is only one entry for a particular user_id
          let response = '';
          res.send('\n----------------------------*Your Standup*----------------------------\n\n');
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
                let message = output(results);
                message = '*Enterprise Activity:*\n'+message;
                axios.post(response_url,{
                  text: message
                }, {
                  headers: {'Content-type': 'application/json', 'Authorization':`Bearer ${process.env.BOT_TOKEN}`}
                }).then(function(response) {
                  console.log(`posted to slack, response: ${response}`);
                }).catch(function(error) {
                  console.log(`there was an error posting to slack: ${error}`);
                });
              })
              .catch(error => {
                console.log('there was an error getting an Enterprise Standup');
                console.log(error);
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
                let message = output(results);
                message = '*Public Activity:*\n'+message;
                axios.post(response_url,{
                  text: message
                }, {
                  headers: {'Content-type': 'application/json', 'Authorization':`Bearer ${process.env.BOT_TOKEN}`}
                }).then(function(response) {
                  console.log(`posted to slack, response: ${response}`);
                }).catch(function(error) {
                  console.log(`there was an error posting to slack: ${error}`);
                });
              })
              .catch(error => {
                console.log('*Public Standup:*');
                console.log(JSON.stringify(error));
                //sendToSlack(error);
              });
          }
          console.log(response);
          //res.send(response);
        } catch(error) {
          console.log(`uncaught error while trying to parse config info and retrieveing either or both standup's: ${error}`);
        }
      }
    });
  });
};

// maybe this should return the response we get from slack and we should handle it in /slack?
function authMessage(body,gh_auth_public,gh_auth_enterprise) {
  axios.post(body.response_url,{
    'attachments': [
      {
        'fallback': 'Authorize Standup-helper to access both your public and enterprise Github accounts',
        'actions': [
          {
            'type': 'button',
            'text': 'Public Github',
            'url': gh_auth_public
          },
          {
            'type': 'button',
            'text': 'Enterprise Github',
            'url': gh_auth_enterprise
          }
        ]
      }
    ]
  },{
    headers: {'Content-type': 'application/json', 'Authorization':`Bearer ${bot_token}`}
  }).then(function(results) {
    console.log(`posted a github auth link, results: ${results}`);
  }).catch(function(error) {
    console.log(`An error was sent back while trying to send auth message ${error}`);
  });
}