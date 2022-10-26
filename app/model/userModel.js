let sql;

module.exports = {

  /** Faz login de usuario **/
  login: function (body, connection, callback) {
    sql = `select id_user from tb_user where user_email = '${body.email}' and user_pwd = '${body.password}'`;
    connection.query(sql, callback);
  },

  /** Retorna senha hash salva no banco e dados */
  getHash: async function (email, connection) {

    let hash = new Promise((resolve, reject) => {
      sql = `select user_pwd from tb_user where user_email = '${email}'`;
      connection.query(sql, function (error, result) {
        if (!error) {
          resolve(result[0].user_pwd);
        }
        reject(error);
      });
    })

    return await hash;
  },

  /** Verifica se e-mail passado existe no banco de dados **/
  checkEmail: async function (email, connection) {
    sql = `select count(*) as value from tb_user where user_email = '${email}'`;

    let value = new Promise((resolve, reject) => {
      connection.query(sql, function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result[0].value);
      })
    })

    return await value;
  },

    /** Cria novo usuario **/
    createUser: function (body, connection, callback) {
      if(body.email.includes("@aluno")) {
        sql = `CALL insert_user_student(
          '${body.email}', '${body.password}', '${body.name}', 
          '${body.middleName}', '${body.lastName}')`;
      } 
      else if(body.email.includes("@professor")){
        sql = `CALL insert_user_teacher(
          '${body.email}', '${body.password}', '${body.name}', 
          '${body.middleName}', '${body.lastName}')`;
      }
      connection.query(sql, callback);
    }
    
}