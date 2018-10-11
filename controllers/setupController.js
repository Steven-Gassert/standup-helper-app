const userConfig = require('../models/userConfig');

module.exports = function(app) {

  app.get('/api/setup_config_db', function(req,res) {

    // seed database
    const starterConfigs = [
      /*
      {
        userId: '1',
        use_enterprise: true,
        enterprise_url: 'https://api.github.ibm.com',
        enterprise_un: 'Steven-Gassert',
        enterprise_token: '5091bf72f0d83513cf884d389b2bd2fc826afe44',
        use_public: true,
        public_un: 'stevengassert94',
        public_token: 'df9bdc6c3ca84d272b588d5c487a1baae1d7de92',
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      },
      {
        userId: '2',
        use_enterprise: true,
        enterprise_url: 'https://api.github.ibm.com',
        enterprise_un: 'Steven-Gassert',
        enterprise_token: '5091bf72f0d83513cf884d389b2bd2fc826afe44',
        use_public: false,
        public_un: 'stevengassert94',
        public_token: 'df9bdc6c3ca84d272b588d5c487a1baae1d7de92',
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      },
      {
        userId: '3',
        use_enterprise: false,
        enterprise_url: 'https://api.github.ibm.com',
        enterprise_un: 'Steven-Gassert',
        enterprise_token: '5091bf72f0d83513cf884d389b2bd2fc826afe44',
        use_public: true,
        public_un: 'stevengassert94',
        public_token: 'df9bdc6c3ca84d272b588d5c487a1baae1d7de92',
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      },
      {
        userId: '4',
        use_enterprise: true,
        enterprise_url: 'https://api.github.ibm.com',
        enterprise_un: 'germanatt',
        enterprise_token: '5091bf72f0d83513cf884d389b2bd2fc826afe44',
        use_public: true,
        public_un: 'germanattanasio',
        public_token: 'df9bdc6c3ca84d272b588d5c487a1baae1d7de92',
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      },
      {
        userId: '5',
        use_enterprise: false,
        enterprise_url: 'https://api.github.ibm.com',
        enterprise_un: 'germanatt',
        enterprise_token: '5091bf72f0d83513cf884d389b2bd2fc826afe44',
        use_public: true,
        public_un: 'germanattanasio',
        public_token: 'df9bdc6c3ca84d272b588d5c487a1baae1d7de92',
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      },
      {
        userId: '6',
        use_enterprise: true,
        enterprise_url: 'https://api.github.ibm.com',
        enterprise_un: 'germanatt',
        enterprise_token: '5091bf72f0d83513cf884d389b2bd2fc826afe44',
        use_public: false,
        public_un: 'germanattanasio',
        public_token: 'df9bdc6c3ca84d272b588d5c487a1baae1d7de92',
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      }
      */
      {
        userId: 'UCFJMBK44',
        use_enterprise: true,
        enterprise_url: 'https://api.github.ibm.com',
        enterprise_un: 'germanatt',
        enterprise_token: '5091bf72f0d83513cf884d389b2bd2fc826afe44',
        use_public: true,
        public_un: 'germanattanasio',
        public_token: 'df9bdc6c3ca84d272b588d5c487a1baae1d7de92',
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
