let sql;

module.exports = {
  /** Busca questoẽs por codigo da turma e id do professor**/
  getQuestionsByClassCodeModel: async function (req, connection, callback) {
    console.log(`[MODEL] - Buscando todas questoẽs da turma! ${JSON.stringify(req.params)}`)

    sql = `CALL getAllQuestionsByClassCode('${req.params.code}')`;

    connection.query(sql, callback);
  },

  /** Busca questão por id da questão, codigo da turma e id do usuario**/
  getQuestionModel: async function (req, connection, callback) {
    console.log(`[MODEL] - Buscando questão com 
        class code: ${req.params.code}, 
        id da questão: ${req.params.id},
        id do usuario: ${req.params.userId}`);

    let idStudent = await getIdStudentByIdUser(req, connection);
    let value = await verifyIfUserHasAnswer(req, idStudent, connection);

    if (value === 0) {
      sql = `SELECT tq.question, tq.teacher_answer, tq.tip 
            FROM tb_class_question_answer_student_teacher AS tcqast
            INNER JOIN tb_class AS tc
            ON tcqast.id_class = tc.id_class
            INNER JOIN tb_question AS tq
            ON tcqast.id_question = tq.id_question
            WHERE tc.id_class = ${await getIdClassByClassCode(req, connection)} 
            AND tq.id_question = ${req.params.id};`

    } else {
      sql = `SELECT * FROM tb_class_question_answer_student_teacher AS tcqast
            INNER JOIN tb_class AS tc
            ON tcqast.id_class = tc.id_class
            INNER JOIN tb_question AS tq
            ON tcqast.id_question = tq.id_question
            INNER JOIN tb_answer AS ta
            ON tcqast.id_answer = ta.id_answer
            INNER JOIN tb_student AS ts
            ON tcqast.id_student = ts.id_student
            WHERE tc.id_class = ${await getIdClassByClassCode(req, connection)} 
            AND tq.id_question = ${req.params.id}
            AND ts.id_student = ${idStudent};`

    }

    connection.query(sql, callback);
  },


  /** Insere resposta do aluno**/
  postAnswerModel: function (req, connection, callback) {
    const body = req.body;
    console.log(`[MODEL] - Inserindo resposta: ${JSON.stringify(body)}`)

    sql = `CALL insert_answer('${body.answer}', ${body.userId}, 
            ${body.questionId},'${body.classCode}', '${body.percentage}')`;

    connection.query(sql, callback);
  },

  /** Edita resposta do aluno**/
  putAnswerModel: async function (req, connection, callback) {
    const body = req.body;
    console.log(`[PutAnswerModel: - Editando resposta com id da resposta: ${req.params.id}`)

    let updated = await UpdateRelationship(req, connection);

    if (updated) {
      sql = `UPDATE tb_answer SET student_answer = '${body.answer}' 
      WHERE id_answer = ${req.params.id}`;
    }
    connection.query(sql, callback);
  },

  /** Insere questão **/
  sendQuestionModel: function (req, connection, callback) {
    const body = req.body;
    console.log(`[MODEL] - Inserindo questão: ${JSON.stringify(body)}`)

    sql = `CALL insert_question('${body.title}', '${body.question}', 
                '${body.teacherAnswer}','${body.tip}','${body.classCode}', ${body.userId})`;

    connection.query(sql, callback);
  },

  /** Insere feedback a questão **/
  sendFeedbackModel: function (req, connection, callback) {
    const params = req.params;
    console.log(`[MODEL] - Inserindo feedback com 
        id_class = ${params.classId},
        id_question = ${params.questionId},
        id_answer = ${params.answerId},
        id_student = ${params.studentId}`)

    sql = `UPDATE tb_class_question_answer_student_teacher 
        SET feedback = '${req.body.feedback}' 
        WHERE id_class_question_answer_student_teacher = ${req.body.id} AND
        id_class = ${params.classId} 
        AND id_question = ${params.questionId} 
        AND id_answer = ${params.answerId} 
        AND id_student = ${params.studentId}`;

    setHasFeedback(connection, params.questionId)

    connection.query(sql, callback);

  },

  /** Busca o numero total de questões no banco de dados pelo código da classe. **/
  getQuestionsNumberByClassCodeCodeModel: function (req, connection, callback) {
    console.log(`[MODEL] - Busca o numero total de questões com código da classe:
         ${JSON.stringify(req.params.code)}`)

    sql = `SELECT count(*) AS total FROM 
        tb_class_question_answer_student_teacher AS tcqast
        INNER JOIN tb_class AS tc
        ON tcqast.id_class = tc.id_class
        INNER JOIN tb_question AS tq
        ON tcqast.id_question = tq.id_question
        WHERE tc.class_code = '${req.params.code}'`;

    connection.query(sql, callback);
  }
}
// Alterando hasFeedBack coluna na tb_question
function setHasFeedback(connection, questionId) {
  let strSql = `UPDATE tb_question SET hasFeedBack = true WHERE id_question = ${questionId};`

  connection.query(strSql, function (error, result) {
    if (error) {
      console.log(`[MODEL] - Coluna hasFeedBack não alterada para true: 
            ${JSON.stringify(error)}`);
    }

    console.log(`[MODEL] - Coluna hasFeedBack alterada para true: ${JSON.stringify(result)}`);
  });
}

/** Retorna o numero de usuário no banco com classCode, 
 * idQuestion e idStudent esperece retornar 1 ou 0, */
async function verifyIfUserHasAnswer(req, idStudent, connection) {
  console.log("Verificando se o usuario respondeu a questão!");

  let value = new Promise((resolve, reject) => {

    sql = `SELECT COUNT(*) AS value FROM 
      tb_class_question_answer_student_teacher AS tcqast
      INNER JOIN tb_class AS tc
      ON tcqast.id_class = tc.id_class
      INNER JOIN tb_question AS tq
      ON tcqast.id_question = tq.id_question
      INNER JOIN tb_answer AS ta
      ON tcqast.id_answer = ta.id_answer
      INNER JOIN tb_student AS ts
      ON tcqast.id_student = ts.id_student
      WHERE tc.class_code = '${req.params.code}' 
      AND tq.id_question = ${req.params.id}
      AND ts.id_student = ${idStudent};`

    connection.query(sql, function (error, result) {
      if (!error) {
        resolve(result[0].value);
      }
      reject(error);
    });
  })

  return await value;
}

/** Retorna o id_student pelo id do usuário, */
async function getIdStudentByIdUser(req, connection) {
  let userId = req.body.userId !== undefined ? req.body.userId : req.params.userId;

  console.log("Buscando id do aluno por id do usuario: ", userId);

  let idStudent = new Promise((resolve, reject) => {
    sql = `SELECT id_student AS idStudent FROM tb_student WHERE id_user = ${userId}`

    connection.query(sql, function (error, result) {
      if (!error) {
        resolve(result[0].idStudent);
      }
      reject(error);
    });
  })

  return await idStudent;
}


/** Retorna o id_teacher pelo id do usuário, */
async function getIdTeacherByIdUser(req, connection) {
  console.log("Buscando id do professor por id do usuario!");

  let idTeacher = new Promise((resolve, reject) => {
    sql = `SELECT id_teacher AS idTeacher FROM tb_teacher WHERE id_user = ${req.params.userId}`

    connection.query(sql, function (error, result) {
      if (!error) {
        resolve(result[0].idTeacher);
      }
      reject(error);
    });
  })

  return await idTeacher;

}

/** Retorna o id_clasass pelo código da class, */
async function getIdClassByClassCode(req, connection) {
  let code = req.body.classCode !== undefined ? req.body.classCode : req.params.code;

  console.log("Buscando id da turma pelo código da classe: ", code);

  let idClass = new Promise((resolve, reject) => {
    sql = `SELECT id_class AS idClass FROM tb_class WHERE class_code = '${code}'`

    connection.query(sql, function (error, result) {
      if (!error) {
        resolve(result[0].idClass);
      }
      reject(error);
    });
  })

  return await idClass;

}

/** Atualiza o id da questao na tabela de relacionamento, */
async function UpdateRelationship(req, connection) {
  const body = req.body;
  console.log("Atualizando tabela de relacionamento!");

  let studentId = await getIdStudentByIdUser(req, connection);
  let classId = await getIdClassByClassCode(req, connection);

  let success = new Promise((resolve, reject) => {
    sql = `UPDATE tb_class_question_answer_student_teacher 
    SET percentage = '${body.percentage}' 
    WHERE id_question = ${body.questionId} 
    AND id_answer = ${req.params.id} 
    AND id_student = ${studentId} 
    AND id_class = ${classId};`;

    connection.query(sql, function (error, result) {
      if (!error) {
        resolve(result);
      }
      reject(error);
    });
  })

  let isUpdated = await success;

  if (isUpdated === undefined || isUpdated === null || isUpdated === "") {
    return false
  }

  return true;

}