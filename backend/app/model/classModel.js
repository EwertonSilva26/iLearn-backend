let sql;
let results;

module.exports = {

  /** Cria nova turma **/
  createClass: async function (body, connection, callback) {

    let number = await verifyIfHasClassName(body.className, connection);

    if (number === 0) {
      sql = `call insert_class ('${body.className}', '${body.classCode}', 
    ${body.userId})`;

    } else {
      sql = `SELECT COUNT(*) AS number FROM tb_class WHERE class_name = '${body.className}'`;
    }

    connection.query(sql, callback);
  },

  /** Busca todas as turmas **/
  getAllClasses: function (req, connection, callback) {
    console.log(`[MODEL] - Buscando todas as turmas com userId: ${req.params.id}`)

    sql = `CALL get_all_classes(${req.params.id});`;

    connection.query(sql, callback);
  },

  /** Deleta uma turma **/
  deleteClassModel: async function (req, connection, callback) {
    console.log(`[MODEL] - Deletando turma com código: ${req.params.code}`)

    results = await selectAllRelationshipByIdCode(req, connection);

    await deleteRelationship(req, connection);

    results.forEach(async item => {
      if (item.id_question !== null) {
        await deleteQuestion(item.id_question, connection);
      }

      if (item.id_answer !== null) {
        await deleteAnswer(item.id_answer, connection);
      }

    });

    sql = `DELETE FROM tb_class WHERE id_class = ${await getIdClass(req, connection)}`;
    connection.query(sql, callback);
  },


    /** Atualiza o nome da turma **/
    updateClassNameModel: async function (req, connection, callback) {
      console.log(`[MODEL] - Atualizando no da turma com código: ${req.params.code}`)
  
      sql = `UPDATE tb_class SET class_name = '${req.body.className}' WHERE id_class = ${await getIdClass(req, connection)}`;
      connection.query(sql, callback);
  
    },

  /** Insere aluno em um turma **/
  insertStudentInClass: function (body, connection, callback) {
    console.log(`[MODEL] - Inserindo aluno na turma de código: ${body.classCode}`)
    sql = `CALL insert_student_in_class(${body.idStudent}, '${body.classCode}')`;
    connection.query(sql, callback);
  },

  /** Busca todas informações sobre a turma e questões por 
   * id da questão e codigo da turma. **/
  getClassInformationModel: function (req, connection, callback) {
    console.log(`[MODEL] - Buscando todas informações sobre a questão com  
              id da questão: ${req.params.id}, codigo da classe: ${req.params.code}`)

    sql = `SELECT * FROM tb_class_question_answer_student_teacher AS tcqast
              INNER JOIN tb_class AS tc
              ON tcqast.id_class = tc.id_class
              INNER JOIN tb_question AS tq
              ON tcqast.id_question = tq.id_question
              INNER JOIN tb_answer AS ta
              ON tcqast.id_answer = ta.id_answer
              INNER JOIN tb_student AS ts
              ON tcqast.id_student = ts.id_student
              WHERE tc.class_code = '${req.params.code}' 
              AND tq.id_question = ${req.params.id} ;`

    connection.query(sql, callback);
  }

}

/** Retorna se já existe o nome da classe */
async function verifyIfHasClassName(className, connection) {
  console.log(`Contando numero de classes para verificar 
  se classe a ser criada ja existe! - ${className}`);

  let number = new Promise((resolve, reject) => {
    sql = `SELECT COUNT(class_name) AS number FROM tb_class where class_name = '${className}'`

    connection.query(sql, function (error, result) {
      if (!error) {
        resolve(result[0].number);
      }
      reject(error);
    });
  })

  return await number;
}

async function selectAllRelationshipByIdCode(req, connection) {
  console.log(`Buscando relacionamento com turmas com código: ${req.params.code}`);

  let results = new Promise(async (resolve, reject) => {
    sql = `SELECT * FROM tb_class_question_answer_student_teacher where id_class = ${await getIdClass(req, connection)}`

    connection.query(sql, function (error, result) {
      if (!error) {
        resolve(result);
      }
      reject(error);
    });
  })

  return await results;
}

/** Retorna o id_clasass pelo código da class, */
async function getIdClass(req, connection) {
  console.log("Buscando id da turma pelo código da classe: ", req.params.code);

  let idClass = new Promise((resolve, reject) => {
    sql = `SELECT id_class AS idClass FROM tb_class WHERE class_code = '${req.params.code}'`

    connection.query(sql, function (error, result) {
      if (!error) {
        resolve(result[0].idClass);
      }
      reject(error);
    });
  })

  return await idClass;

}

/** Deletar questão. */
async function deleteQuestion(idQuestion, connection) {
  console.log("Deletando questão com id da questao: ", idQuestion);

  let success = new Promise((resolve, reject) => {
    sql = `DELETE FROM tb_question WHERE id_question = ${idQuestion}`

    connection.query(sql, function (error, result) {
      if (!error) {
        resolve(result);
      }
      reject(error);
    });
  })

  console.log("Deletando questão: ", JSON.stringify(await success));

}

/** Deletar resposta. */
async function deleteAnswer(idAnswer, connection) {
  console.log("Deletando resposta com id da resposta: ", idAnswer);

  let success = new Promise((resolve, reject) => {
    sql = `DELETE FROM tb_answer WHERE id_answer = ${idAnswer}`

    connection.query(sql, function (error, result) {
      if (!error) {
        resolve(result);
      }
      reject(error);
    });
  })

  console.log("Deletando respostas: ", JSON.stringify(await success));

}

/** Deletar relacionamento das tabelas. */
async function deleteRelationship(req, connection) {
  console.log("Deletando relacionamento entre tabelas com id_class ", req.params.code);

  let success = new Promise(async (resolve, reject) => {
    sql = `DELETE FROM tb_class_question_answer_student_teacher WHERE id_class = ${await getIdClass(req, connection)}`

    connection.query(sql, function (error, result) {
      if (!error) {
        resolve(result);
      }
      reject(error);
    });
  })

  console.log("Deletando relacionamento entre as tabelas: ", JSON.stringify(await success));

}