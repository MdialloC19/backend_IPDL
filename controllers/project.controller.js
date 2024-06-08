const ProjectService = require("../services/project.service");
const HttpError = require("../utils/execptions");

/**
 * Enregistre un nouveau projet
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>} - Promesse indiquant la fin du traitement
 */
const createProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const projectData = req.body;
        const newProject = await ProjectService.createProject(
            projectData,
            userId
        );
        return res.status(201).json(newProject);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

/**
 * Récupère un projet par son ID
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>} - Promesse indiquant la fin du traitement
 */
const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await ProjectService.getProjectById(projectId);
        return res.status(200).json(project);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

/**
 * Récupère tous les projets
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>} - Promesse indiquant la fin du traitement
 */
const getAllProjects = async (req, res) => {
    try {
        const projects = await ProjectService.getAllProjects();
        return res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

/**
 * Met à jour un projet par son ID
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>} - Promesse indiquant la fin du traitement
 */
const updateProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const updatedProjectData = req.body;
        const updatedProject = await ProjectService.updateProjectById(
            projectId,
            updatedProjectData
        );
        return res.status(200).json(updatedProject);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

/**
 * Supprime un projet par son ID
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>} - Promesse indiquant la fin du traitement
 */
const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        await ProjectService.deleteProject(projectId);
        return res.status(200).json({ message: "Projet supprimé avec succès" });
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

/**
 * Ajoute des participants à un projet
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>} - Promesse indiquant la fin du traitement
 */
const addParticipantsToProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { participants } = req.body;
        const updatedProject = await ProjectService.addParticipantsToProject(
            projectId,
            participants
        );
        return res.status(200).json(updatedProject);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

module.exports = {
    createProject,
    getProjectById,
    getAllProjects,
    updateProjectById,
    deleteProject,
    addParticipantsToProject,
};
