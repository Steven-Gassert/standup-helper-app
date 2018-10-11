const userConfig = require('../models/userConfig');

module.exports = function(app) {

  app.get('/api/setup_config_db', function(req,res) {

    // seed database
    const starterConfigs = [
      /*
      {
        userId: '1',
        use_enterprise: true,
        enterprise_url: process.env.SEED_GH_ENT_URL,
        enterprise_un: process.env.SEED_GH_ENT_UNsert',
        enterprise_token: 'process.env.',
        use_public: true,
        public_un: process.env.SEED_GH_PUB_UN,
        public_token: process.env.SEED_GH_PUB_TOKEN,
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      },
      {
        userId: '2',
        use_enterprise: true,
        enterprise_url: process.env.SEED_GH_ENT_URL,
        enterprise_un: process.env.SEED_GH_ENT_UNsert',
        enterprise_token: process.env.SEED_GH_ENT_TOKEN,
        use_public: false,
        public_un: process.env.SEED_GH_PUB_UN,
        public_token: process.env.SEED_GH_PUB_TOKEN,
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      },
      {
        userId: '3',
        use_enterprise: false,
        enterprise_url: process.env.SEED_GH_ENT_URL,
        enterprise_un: process.env.SEED_GH_ENT_UNsert',
        enterprise_token: process.env.SEED_GH_ENT_TOKEN,
        use_public: true,
        public_un: process.env.SEED_GH_PUB_UN,
        public_token: process.env.SEED_GH_PUB_TOKEN,
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      },
      {
        userId: '4',
        use_enterprise: true,
        enterprise_url: process.env.SEED_GH_ENT_URL,
        enterprise_un: process.env.SEED_GH_ENT_UN,
        enterprise_token: process.env.SEED_GH_ENT_TOKEN,
        use_public: true,
        public_un: process.env.SEED_GH_PUB_UN,
        public_token: process.env.SEED_GH_PUB_TOKEN,
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      },
      {
        userId: '5',
        use_enterprise: false,
        enterprise_url: process.env.SEED_GH_ENT_URL,
        enterprise_un: process.env.SEED_GH_ENT_UN,
        enterprise_token: process.env.SEED_GH_ENT_TOKEN,
        use_public: true,
        public_un: process.env.SEED_GH_PUB_UN,
        public_token: process.env.SEED_GH_PUB_TOKEN,
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      },
      {
        userId: '6',
        use_enterprise: true,
        enterprise_url: process.env.SEED_GH_ENT_URL,
        enterprise_un: process.env.SEED_GH_ENT_UN,
        enterprise_token: process.env.SEED_GH_ENT_TOKEN,
        use_public: false,
        public_un: process.env.SEED_GH_PUB_UN,
        public_token: process.env.SEED_GH_PUB_TOKEN,
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      }
      */
      {
        userId: '7',
        use_enterprise: true,
        enterprise_url: process.env.SEED_GH_ENT_URL,
        enterprise_un: process.env.SEED_GH_ENT_UN,
        enterprise_token: process.env.SEED_GH_ENT_TOKEN,
        use_public: true,
        public_un: process.env.SEED_GH_PUB_UN,
        public_token: process.env.SEED_GH_PUB_TOKEN,
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      }
    ];

    userConfig.create(starterConfigs, function(err, results) {
      if (err) {
        console.log('there was an error');
        res.send('there was an error populating seed data');
      } else {
        console.log(`the results are ${results}`);
        res.send(results);
      }
    });
  });
};
