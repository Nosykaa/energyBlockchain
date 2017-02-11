const database = require('./db');

class UserService {

  save (login, user) {
    return new Promise((resolve, reject) => {
      database.getDb().then(db => {

        db.collection('user').findOne({ login: login }, (err, result) => {
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
              db.collection('user').updateOne({ "login": login }, { $set: user }, (err, result) => {
                if (err) {
                  return reject(err);
                }
                if (result.nb === 0) {
                  return reject('Unable to update the user');
                }
                resolve();
              });
            }
          });
      }).catch(reject);
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
}

module.exports = new UserService();

