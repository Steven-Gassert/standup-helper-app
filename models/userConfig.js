
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userConfigSchema = new Schema({
  userId: String,
  use_enterprise: Boolean,
  enterprise_url: String,
  enterprise_un: String,
  enterprise_token: String,
  use_public: String,
  public_un: String,
  public_token: String,
  hours: Number,
  issues: Boolean,
  pull_requests: Boolean,
  commits: Boolean
});

const userConfig = mongoose.model('userConfig',userConfigSchema);

module.exports = userConfig;
