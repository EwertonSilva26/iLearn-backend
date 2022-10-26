const {
    postAnswerController,
    putAnswerController,
    sendFeedbackController,
} = require("../controller/questionController");

module.exports = {
    postAnswer: function (app) {
        app.post("/answer", (req, res) => {
            try {
                postAnswerController(app, req, res);
            } catch (error) {
                throw error;
            }
        });
    },

    putAnswer: function (app) {
        app.put("/answer/:id", (req, res) => {
            try {
                putAnswerController(app, req, res);
            } catch (error) {
                throw error;
            }
        });
    },

    sendFeedback: function (app) {
        app.put("/class/:classId/question/:questionId/answer/:answerId/student/:studentId",
            (req, res) => {
                try {
                    sendFeedbackController(app, req, res);
                } catch (error) {
                    throw error;
                }
            });
    }
}