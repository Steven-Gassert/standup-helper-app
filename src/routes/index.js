const slack = require('./slack');
const callbacks = require('./callbacks');

module.exports = function (app) {
  slack(app);
  callbacks(app);
};