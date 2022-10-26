const {
    getQuestionsByClassCodeController,
    getQuestionController,
    sendQuestionController,
    getQuestionsNumberByClassCodeCodeController
} = require("../controller/questionController");

module.exports = {
    getQuestionsByClassCode: function (app) {
        app.get("/questions/:code/user/:userId/email/:email", (req, res) => {
            try {
                getQuestionsByClassCodeController(app, req, res);
            } catch (error) {
                throw error;
            }
        });
    },

    getQuestion: function (app) {
        app.get("/question/:id/:code/:userId", (req, res) => {
            try {
                getQuestionController(app, req, res);
            } catch (error) {
                throw error;
            }
        });
    },

    sendQuestion: function (app) {
        app.post("/question", (req, res) => {
            try {
                sendQuestionController(app, req, res);
            } catch (error) {
                throw error;
            }
        });
    },

    getQuestionsNumberByClassCode: function (app) {
        app.get("/questions/class/:code", (req, res) => {
            try {
                getQuestionsNumberByClassCodeCodeController(app, req, res);
            } catch (error) {
                throw error;
            }
        });
    }
}