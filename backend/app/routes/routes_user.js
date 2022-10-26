const {check, validationResult } = require("express-validator");
const { loginController, createUserController } = require("../controller/userController");

// const { verifyJWT } = require("../../utils");

module.exports = {
  loginUser: function (app) {
    app.post("/login", (req, res) => {
      try{
        loginController(app, req, res);
      } catch(error) {
        console.log("Login não foi efetuado: " + error)
        throw error;
      }

    });
  },

  createUser: function(app) {
    app.post("/create/user", (req, res) => {
      try{
        createUserController(app, req, res);
      } catch(error) {
        console.log("Usuário não foi cadastrado: " + error)
        throw error;
      }
    })
  }



  // loginUser: function (app, bcrypt, jwt) {
  //   app.post("/login",[
  //     check('email').isEmail().withMessage('Campo deve ser prrenchido com email valido.'),
  //   check('password').isAlphanumeric().withMessage('A senha deve ser um valor alfanumerico')
  // ]), (req, res) => {
  //   try {
      
  //     let erros = validationResult(req);
  //     loginController(app, req, res, erros);
  //   } catch(error) {
  //     res.send(error)
  //   }

  //   };
  // }
};
