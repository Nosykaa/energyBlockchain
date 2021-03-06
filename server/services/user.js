const database = require('./db');

class UserService {

  save (login, user) {
    return new Promise((resolve, reject) => {
      database.getDb().then(db => {

        db.collection('user').findOne({ "login": login }, (err, result) => {
            if (err) {
              return reject(err);
            }
            if (!result) {
              db.collection('user').insertOne(user, (err, result) => {
                if (err) {
                  return reject(err);
                }
                resolve(result._id);
              });
            }
            else {
                    delete user._id;
              db.collection('user').updateOne({ "login": login }, { $set: user }, (err, result) => {
                if (err) {
                  return reject(err);
                }
                if (result.nb === 0) {
                  return reject('Unable to update the user');
                }
                resolve(result);
              });
            }
          });
      }).catch(err => reject(err));
    });
  }

  findByLogin(login) {
    return new Promise((resolve, reject) => {

      database.getDb().then(db => {
        db.collection('user').findOne({ "login": login }, (err, user) => {
          if (err) {
            return reject(err);
          }
          if (!user) {
            return reject({
              code: 404,
              message: 'User not found. Invalid address'
            });
          }
          resolve(user);
        });
      }).catch(reject);
    });
  }

  findHomeGridAddress(){
    return new Promise((resolve, reject) => {

      database.getDb().then(db => {
        db.collection('app').findOne({"login": "homeGrid"}, (err, contract) => {
          if (err) {
            return reject(err);
          }
          resolve(contract.homeGridAddress);
        });
      }).catch(reject);
    });
  }
}

module.exports = new UserService();

