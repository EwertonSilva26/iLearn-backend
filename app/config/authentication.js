const bcrypt = require('bcrypt');
const res = require('express/lib/response');

module.exports = {
     encryptPassword:async function (password) {

        let value = new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    if(err){
                        reject(err);
                    }
    
                    return resolve(hash);
                });
            });
          })
      
        return await value;
    },
    decryptPassword(password, hash) {
       return bcrypt.compareSync(password, hash);
    }
}