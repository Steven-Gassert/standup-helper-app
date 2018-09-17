const config = require('./config');

module.exports = {
  dbConnectionString: function(env) {
    if (env === 'prod'){
      return `mongodb://${config.prodUsername}:${config.prodPassword}@ds157742.mlab.com:57742/standup_helper`;
    } else {
      return `mongodb://${config.devUsername}:${config.devPassword}@ds157742.mlab.com:57742/standup_helper_dev`;
    }
  }
};