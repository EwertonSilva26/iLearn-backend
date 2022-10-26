const {check, validationResult } = require("express-validator");
const { 
  createClassController, 
  getAllClassesController,
  deleteClassController,
  updateClassNameController,
  insertStudentInClassesController,
  getClassInformationController
} = require("../controller/classController");

module.exports = {
  createClass: function (app) {
    app.post("/class/create", (req, res) => {
      try{
        createClassController(app, req, res);
      } catch(error) {
        throw error;
      }
    });
  },

  getClasses: function (app) {
    app.get("/classes/:id", (req, res) => {
      getAllClassesController(app, req, res);
    });
  },

  deleteClass: function (app) {
    app.delete("/class/:code", (req, res) => {
      try{
        deleteClassController(app, req, res);
      } catch(error) {
        throw error;
      }
    });
  },

  updateClassName: function (app) {
    app.put("/class/:code", (req, res) => {
      try{
        updateClassNameController(app, req, res);
      } catch(error) {
        throw error;
      }
    });
  },

  insertStudentsInClasses: function (app) {
    app.post("/student/classes/", (req, res) => {
      insertStudentInClassesController(app, req, res);
    });
  },

  getStudentClasses: function (app) {
    app.get("students/student/classes/search", (req, res) => {
      getAllClassesController(app, req, res);
    });
  },

  getClassInformation: function (app) {
    app.get("/class/:code/question/:id/answers", (req, res) => {
        try {
            getClassInformationController(app, req, res);
        } catch(error) {
            throw error;
        }
    });
  }
  
};
