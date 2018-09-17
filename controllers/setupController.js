const userConfig = require('../models/userConfig');

module.exports = function(app) {

  app.get('/api/setupConfigdb', function(req,res) {

    // seed database
    const starterConfigs = [
      {
        userId: '4',
        use_enterprise: true,
        enterprise_url: 'https://api.github.ibm.com',
        enterprise_un: 'Steven-Gassert',
        enterprise_token: '0ab904d803c4499425d8952e7f8ae98f229383c4',
        use_public: true,
        public_un: 'stevengassert94',
        public_token: 'a24c5eb94956d1c371a3e5985b998c0cbe7e1ef2',
        hours: 150
      },
      {
        userId: '5',
        use_enterprise: true,
        enterprise_url: 'https://api.github.ibm.com',
        enterprise_un: 'Steven-Gassert',
        enterprise_token: '0ab904d803c4499425d8952e7f8ae98f229383c4',
        use_public: false,
        public_un: 'stevengassert94',
        public_token: 'a24c5eb94956d1c371a3e5985b998c0cbe7e1ef2',
        hours: 150
      },
      {
        userId: '6',
        use_enterprise: false,
        enterprise_url: 'https://api.github.ibm.com',
        enterprise_un: 'Steven-Gassert',
        enterprise_token: '0ab904d803c4499425d8952e7f8ae98f229383c4',
        use_public: true,
        public_un: 'stevengassert94',
        public_token: 'a24c5eb94956d1c371a3e5985b998c0cbe7e1ef2',
        hours: 150
      },
      {
        userId: '7',
        use_enterprise: false,
        enterprise_url: 'https://api.github.ibm.com',
        enterprise_un: 'germanatt',
        enterprise_token: '0ab904d803c4499425d8952e7f8ae98f229383c4',
        use_public: true,
        public_un: 'germanattanasio',
        public_token: 'a24c5eb94956d1c371a3e5985b998c0cbe7e1ef2',
        hours: 150
      },
      {
        userId: '8',
        use_enterprise: false,
        enterprise_url: 'https://api.github.ibm.com',
        enterprise_un: 'germanatt',
        enterprise_token: '0ab904d803c4499425d8952e7f8ae98f229383c4',
        use_public: true,
        public_un: 'germanattanasio',
        public_token: 'a24c5eb94956d1c371a3e5985b998c0cbe7e1ef2',
        hours: 150
      },
      {
        userId: '12',
        use_enterprise: true,
        enterprise_url: 'https://api.github.ibm.com',
        enterprise_un: 'germanatt',
        enterprise_token: '0ab904d803c4499425d8952e7f8ae98f229383c4',
        use_public: true,
        public_un: 'germanattanasio',
        public_token: 'a24c5eb94956d1c371a3e5985b998c0cbe7e1ef2',
        hours: 150,
        issues: true,
        pull_requests: true,
        commits: true
      }
    ];

    // if there is already seed data, we want to delete the old seed data before inputting new see data
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
