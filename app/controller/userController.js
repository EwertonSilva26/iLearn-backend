const dbConnection = require("../config/dbserver");
const connection = dbConnection();
const auth = require("../config/authentication");
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const {
    login,
    checkEmail,
    getHash,
    createUser }
    = require("../model/userModel");
const e = require("express");

module.exports = {
    loginController: async function (app, req, res) {
        let email = req.body.email;
        console.log(`[UserController] - Iniciando login: ${email}`);

        // try{
        const isEmailvalid = await checkEmail(email, connection);
        if (isEmailvalid <= 0) {
            res.status(400).send({ status: 400, message: 'E-mail invalido!' });
            return;
        }

        const hash = await getHash(email, connection);
        if (hash == 0) {
            res.status(400).send({ status: 400, message: 'Senha invalida!' });
            return;
        }

        const isMatch = auth.decryptPassword(req.body.password, hash);
        req.body.password = hash;
        if (isMatch) {
            try {
                login(req.body, connection, function (error, result) {
                    if (error) {
                        res.status(403)
                            .send({
                                status: 403, error,
                                message: "Não foi possivel efetuar login!"
                            });
                    }
                    let id = result[0].id_user;
                    let token = jwt.sign({ id }, SECRET, { expiresIn: 300 });

                    res.status(200)
                        .send({ status: 200, id_user: id, token, email })
                })
            } catch (e) {
                console.error(`Erro inesperado: ${e.message}`);
                throw e;
            }
        } else {
            res.status(400)
                .send({ status: 400, message: 'Senha invalida!' });
        }
    },

    createUserController: async function (app, req, res) {
        try {
            console.log(`[UserController] - Iniciando criação de 
        usuario: ${JSON.stringify(req.body)}`);

            const hash = await auth.encryptPassword(req.body.password);
            req.body.password = hash;

            createUser(req.body, connection, function (error, result) {
                if (error) {
                    res.status(403).send({
                        status: 403, error,
                        message: "Não foi possivel criar usuário!"
                    });
                }

                res.status(201)
                    .send({ status: 201, message: "Usuario cadastrado com sucesso!", result })
            })
        } catch (e) {
            console.error(`Erro inesperado: ${e.message}`);
            throw e;
        }
    }
}
