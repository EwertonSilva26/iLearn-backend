const dbConnection = require("../config/dbserver");
const connection = dbConnection();

const {
    getQuestionsByClassCodeModel,
    getQuestionModel,
    postAnswerModel,
    putAnswerModel,
    sendQuestionModel,
    sendFeedbackModel,
    getQuestionsNumberByClassCodeCodeModel
} = require("../model/questionModel");

module.exports = {
    getQuestionsByClassCodeController: async function (app, req, res) {
        if (req.headers.authorization) {
            try {
                getQuestionsByClassCodeModel(req, connection, function (error, result) {
                    if (error) {
                        res.status(400).send({ status: 400, error });
                    }

                    res.status(200).send({ status: 200, result });
                })
            } catch (e) {
                console.error(`Erro inesperado: ${e.message}`);
                throw e;
            }
        } else {
            res.status(401).send({ status: 401, message: "Usuário não autoriazado!" });
        }
    },

    getQuestionController: async function (app, req, res) {
        if (req.headers.authorization) {
            try {
                getQuestionModel(req, connection, function (error, result) {
                    if (error) {
                        res.status(400).send({ status: 400, error });
                    }
                    res.status(200).send({ status: 200, result });
                })
            } catch (e) {
                console.error(`Erro inesperado: ${e.message}`);
                throw e;
            }
        } else {
            res.status(401).send({ status: 401, message: "Usuário não autoriazado!" });
        }
    },

    postAnswerController: async function (app, req, res) {
        if (req.headers.authorization) {
            try {
                postAnswerModel(req, connection, function (error, result) {
                    if (error) {
                        res.status(400).send({ status: 400, error });
                    }

                    res.status(200).send({ status: 200, result });
                })
            } catch (e) {
                console.error(`Erro inesperado: ${e.message}`);
                throw e;
            }
        } else {
            res.status(401).send({ status: 401, message: "Usuário não autoriazado!" });
        }
    },

    putAnswerController: async function (app, req, res) {
        if (req.headers.authorization) {
            try {
                putAnswerModel(req, connection, function (error, result) {
                    if (error) {
                        res.status(400).send({ status: 400, error });
                    }

                    res.status(200).send({ status: 200, result });
                })
            } catch (e) {
                console.error(`Erro inesperado: ${e.message}`);
                throw e;
            }
        } else {
            res.status(401).send({ status: 401, message: "Usuário não autoriazado!" });
        }
    },

    sendQuestionController: async function (app, req, res) {
        if (req.headers.authorization) {
            try {
                sendQuestionModel(req, connection, function (error, result) {
                    if (error) {
                        res.status(400).send({ status: 400, error });
                    }

                    res.status(201).send({
                        status: 201, result,
                        message: "Questão cadastrada com sucesso!"
                    });
                })
            } catch (e) {
                console.error(`Erro inesperado: ${e.message}`);
                throw e;
            }
        } else {
            res.status(401).send({ status: 401, message: "Usuário não autoriazado!" });
        }
    },

    sendFeedbackController: async function (app, req, res) {
        if (req.headers.authorization) {
            try {
                sendFeedbackModel(req, connection, function (error, result) {
                    if (error) {
                        res.status(400).send({ status: 400, error });
                    }

                    res.status(204).send({
                        status: 204, result,
                        message: "Feedback cadastrada com sucesso!"
                    });
                })
            } catch (e) {
                console.error(`Erro inesperado: ${e.message}`);
                throw e;
            }
        } else {
            res.status(401).send({ status: 401, message: "Usuário não autoriazado!" });
        }
    },

    getQuestionsNumberByClassCodeCodeController: async function (app, req, res) {
        if (req.headers.authorization) {
            try {
                getQuestionsNumberByClassCodeCodeModel(req, connection, function (error, result) {
                    if (error) {
                        res.status(400).send({ status: 400, error });
                    }

                    res.status(200).send({
                        status: 200, result,
                        message: "Numero total de questões retornado com sucesso!"
                    });
                })
            } catch (e) {
                console.error(`Erro inesperado: ${e.message}`);
                throw e;
            }
        } else {
            res.status(401).send({ status: 401, message: "Usuário não autoriazado!" });
        }
    }
}