const express = require('express');
const userConfig = require('../../../models/userConfig');
const client_id_pub = process.env.CLIENT_ID_PUB;
const client_secret_pub = process.env.CLIENT_SECRET_PUB;
const client_id_enterprise = process.env.CLIENT_ID_ENTERPRISE;
const client_secret_enterprise = process.env.CLIENT_SECRET_ENTERPRISE;
const axios = require('axios');
const cfenv = require('cfenv');

require('dotenv').config();
const appEnv = cfenv.getAppEnv();
if(appEnv.url.indexOf('local') > -1) { //if appEnv cannont find cfenv 'local', then we are running locally
  appEnv.url = undefined;
  //mongo_env = 'dev';
}
const host = appEnv.url || process.env.NGROK;

const ent_host = 'ibm';

module.exports = function(app) {
  const router = express.Router();
  
  app.use('/callback',router);

  router.get('/github', function(req,res) {
    let code = req.query.code;
    let state = req.query.state;
    let parsed_state = state.split('also');
    let user_id = parsed_state[1];
    let type = parsed_state[2];
    //console.log(`code = ${code}, type = ${type} state = ${state}`);
    //console.log(`response_url = ${response_url}, user_id = ${user_id}`);
    getToken(type, code, state)
      .then((result) => {
        let token = result.data.access_token;
        saveToken(type,user_id,token);
      })
      .catch((error) => {
        console.log(`there was an error retrieving token information: ${error}`);
        res.send('There was an error trying to authorize you to use Standup Helper, please follow the authorization link again');
      });
    res.send(`You are now authorized to use ${type} Standup-helper!`);
  });
};

async function getToken(type, code, state) {
  console.log(`in getToken, type=${type}, code = ${code}, state = ${state}`);
  try {
    if (type === 'public') {
      let response = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: client_id_pub,
        client_secret: client_secret_pub,
        code: code,
        redirect_uri: `${host}/callback/github`,
        state: state
      }, {
        headers: {'Accept': 'application/json'}
      });
      console.log(`getToken response = ${response}`);
      return response;
    } else if (type === 'enterprise') {
      let response = await axios.post(`https://github.${ent_host}.com/login/oauth/access_token`, {
        client_id: client_id_enterprise,
        client_secret: client_secret_enterprise,
        code: code,
        redirect_uri: `${host}/callback/github`,
        state: state
      }, {
        headers: {'Accept': 'application/json'}
      });
      return response;
    }
  } catch (error) {
    console.log(`there was an error trying to retireve a token for ${type} user`);
    console.log(error);
  }
}

async function saveToken(type, user_id, token) {
  userConfig.find({ userId: user_id }, function(err, results) {
    if (err) {
      console.log('There was an error retrieving user info from mongoDB');
    }
    else {
      if(!results.length) {
        if (type === 'public') {
          getUsername('https://api.github.com', token)
            .then((username) => {
              let usr = new userConfig({
                userId: user_id,
                use_enterprise: false,
                enterprise_url: 'url',
                enterprise_un: 'username',
                enterprise_token: 'token',
                use_public: true,
                public_un: username,
                public_token: token,
                hours: 100,
                issues: true,
                pull_requests: true,
                commits: true
              });
              usr.save(function (err, result) {
                if (err) {
                  console.error(err);
                } else {
                  console.log(`New user, ${type}, user_id ${user_id}, was saved to db, result ${result}`);
                }
              });
            })
            .catch((error) => {
              console.log(`Throw an Error, we were not able to save a new user token: ${error}`);
            });
        } else if (type === 'enterprise') {
          getUsername(`https://api.github.${ent_host}.com`, token)
            .then((username) => {
              let usr = new userConfig({
                userId: user_id,
                use_enterprise: true,
                enterprise_url: `https://api.github.${ent_host}.com`,
                enterprise_un: username,
                enterprise_token: token,
                use_public: false,
                public_un: 'username',
                public_token: 'token',
                hours: 100,
                issues: true,
                pull_requests: true,
                commits: true
              });
              usr.save(function (err, result) {
                if (err) {
                  console.error(err);
                } else {
                  console.log(`New user, ${type}, user_id ${user_id}, was saved to db. result: ${result}`);
                }
              });
            })
            .catch((error) => {
              console.log(`Throw an Error, we were not able to save a new user token: ${error}`);
            }); 
        }
      } else if(results.length === 1) { // There is already a user in our DB wth this user_id
        if (type === 'public') {
          getUsername('https://api.github.com', token)
            .then((username) => {
              userConfig.updateOne({ userId: user_id },{ use_public: true, public_un: username, public_token: token, },(err, results) => {
                if (!err) {
                  console.log(`sucessfully updated user_id ${user_id} with a public token, result: ${results}`);
                } else {
                  console.log(`there was an error attempting to update ${user_id} with a public token`);
                }
              });
            })
            .catch((error) => {
              console.log(`there was an error trying to authorize a user who had other authorizations ${error}`);
            });
        }
        else if (type === 'enterprise') {
          // update the enterprise user if there is already one with the specified id
          getUsername(`https://api.github.${ent_host}.com`, token)
            .then((username) => {
              userConfig.updateOne({ userId: user_id },{
                use_enterprise: true,
                enterprise_url: `https://api.github.${ent_host}.com`,
                enterprise_un: username,
                enterprise_token: token
              }, (err, results) => {
                if (!err) {
                  console.log(`sucessfully updated user_id ${user_id} with an enterprise token. ${results}`);
                } else {
                  console.log(`there was an error attempting to update ${user_id} with a enterprise token`);
                }
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        console.log('Unexpected case, results should either have no length or a length of 1 since user_id should be unique');
      }
    }

  });
}

async function getUsername(endpoint, token) {
  try{
    let response = await axios.get(`${endpoint}/user`,{
      headers: {'Authorization': `token ${token}`}
    });
    return response.data.login;
  } catch(error) {
    console.log(`there was an error while attempting to retrieve a user info from the access token created: ${error}`);
    return 'error';
  }
}