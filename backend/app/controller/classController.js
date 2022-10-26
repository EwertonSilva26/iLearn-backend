const dbConnection = require("../config/dbserver");
const connection = dbConnection();

const {
    createClass,
    getAllClasses,
    insertStudentInClass,
    deleteClassModel,
    updateClassNameModel,
    getClassInformationModel
} = require("../model/classModel");

module.exports = {
    createClassController: async function (app, req, res) {
        if (req.headers.authorization) {
            try {
                createClass(req.body, connection, function (error, result) {
                    if (error) {
                        res.status(400).send({ status: 400, error });
                    }

                    res.status(201).send({ status: 201, result });
                })
            } catch (e) {
                console.error(`Erro inesperado: ${e.message}`);
                throw e;
            }
        } else {
            res.status(401).send({ status: 401, message: "Usuário não autoriazado!" });
        }
    },

    getAllClassesController: async function (app, req, res) {
        if (req.headers.authorization) {
            try {
                getAllClasses(req, connection, function (error, result) {
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

    insertStudentInClassesController: async function (app, req, res) {
        if (req.headers.authorization) {
            try {
                insertStudentInClass(req.body, connection, function (error, result) {
                    const classCode = req.body.classCode;
                    if (error) {
                        res.status(400).send({ status: 400, error });
                    }

                    res.status(201).send({ status: 200, classCode, result });
                })
            } catch (e) {
                console.error(`Erro inesperado: ${e.message}`);
                throw e;
            }

        } else {
            res.status(401).send({ status: 401, message: "Usuário não autoriazado!" });
        }
    },

    getClassInformationController: async function (app, req, res) {
        if (req.headers.authorization) {
            try {
                getClassInformationModel(req, connection, function (error, result) {
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

    deleteClassController: async function (app, req, res) {
        if (req.headers.authorization) {
            try {
                deleteClassModel(req, connection, function (error, result) {
                    if (error) {
                        res.status(400).send({ status: 400, error });
                    }

                    res.status(204).send({ status: 204, result });
                })
            } catch (e) {
                console.error(`Erro inesperado: ${e.message}`);
                throw e;
            }

        } else {
            res.status(401).send({ status: 401, message: "Usuário não autoriazado!" });
        }
    },

    updateClassNameController: async function (app, req, res) {
        if (req.headers.authorization) {
            try {
                updateClassNameModel(req, connection, function (error, result) {
                    if (error) {
                        res.status(400).send({ status: 400, error });
                    }

                    res.status(204).send({ status: 204, result });
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
