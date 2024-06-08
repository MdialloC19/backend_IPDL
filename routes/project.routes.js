const express = require("express");
const projectController = require("../controllers/project.controller");
const allowIfLoggedin = require("../middlewares/allowedIfLoggedin.middleware");
const router = express.Router();

/**
 * @desc Route to create a new project
 * @route POST api/projects
 * @access Private
 */
router.post("/", /*allowIfLoggedin,*/ projectController.createProject);

/**
 * @desc Route to get a project by ID
 * @route GET api/projects/:projectId
 * @access Private
 */
router.get(
    "/:projectId",
    /*allowIfLoggedin,*/ projectController.getProjectById
);

/**
 * @desc Route to get all projects
 * @route GET api/projects
 * @access Private
 */
router.get("/", /*allowIfLoggedin,*/ projectController.getAllProjects);

/**
 * @desc Route to update a project by ID
 * @route PUT api/projects/:projectId
 * @access Private
 */
router.put(
    "/:projectId",
    /*allowIfLoggedin,*/ projectController.updateProjectById
);

/**
 * @desc Route to delete a project by ID
 * @route DELETE api/projects/:projectId
 * @access Private
 */
router.delete(
    "/:projectId",
    /*allowIfLoggedin,*/ projectController.deleteProject
);

/**
 * @desc Route to add participants to a project
 * @route POST api/projects/:projectId/participants
 * @access Private
 */
router.post(
    "/:projectId/participants",
    /*allowIfLoggedin,*/
    projectController.addParticipantsToProject
);

module.exports = router;
