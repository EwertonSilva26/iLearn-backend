require('dotenv').config();
const app = require("./config/server");
const userRoutes = require("../app/routes/routes_user");
const classRoutes = require("../app/routes/routes_class");
const questionRoutes = require("../app/routes/routes_question");
const answerRoutes = require("../app/routes/routes_answer");

userRoutes.loginUser(app);
userRoutes.createUser(app);

classRoutes.createClass(app);
classRoutes.getClasses(app);
classRoutes.insertStudentsInClasses(app);
classRoutes.getStudentClasses(app);
classRoutes.getClassInformation(app);
classRoutes.deleteClass(app);
classRoutes.updateClassName(app);

questionRoutes.getQuestionsByClassCode(app);
questionRoutes.getQuestion(app);
questionRoutes.sendQuestion(app);
questionRoutes.getQuestionsNumberByClassCode(app);

answerRoutes.sendFeedback(app);
answerRoutes.postAnswer(app);
answerRoutes.putAnswer(app);