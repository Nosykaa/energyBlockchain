const Database = require('./db');

class OracleService {

  getRisk (contractAddress) {
    return new Promise((resolve, reject) => {
      Database.getDb().then(db => {
          db.collection('identity').find().limit(1).toArray((err, doc) => {
            if (err) {
              return reject(err);
            }

            resolve({
              validatorAddress: doc[0].keystore_public_address,
              risk: digitalid.risk
            });
          });
      })
      .catch(reject);
    });
  }



}

module.exports = new OracleService();
