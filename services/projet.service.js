const Project = require("../models/project.model");
const User = require("../models/user.model");
const { HttpError } = require("../utils/execptions");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

class ProjectService {
    static async validateProjectData(projectData) {
        const errors = validationResult(projectData);
        if (!errors.isEmpty()) {
            throw new HttpError(400, "Validation failed");
        }

        const {
            name,
            description,
            startDate,
            endDate,
            status,
            participants,
            ...rest
        } = projectData;

        const validatedProjectData = {};

        if (!name || typeof name !== "string") {
            throw new HttpError(
                400,
                "Le nom du projet est requis et doit être une chaîne de caractères."
            );
        }
        validatedProjectData.name = name;

        if (!description || typeof description !== "string") {
            throw new HttpError(
                400,
                "La description du projet est requise et doit être une chaîne de caractères."
            );
        }
        validatedProjectData.description = description;

        if (!startDate || isNaN(new Date(startDate).getTime())) {
            throw new HttpError(400, "Date de début du projet invalide.");
        }
        validatedProjectData.startDate = new Date(startDate);

        if (!endDate || isNaN(new Date(endDate).getTime())) {
            throw new HttpError(400, "Date de fin du projet invalide.");
        }
        validatedProjectData.endDate = new Date(endDate);

        if (
            status &&
            !["Planned", "In Progress", "Completed", "On Hold"].includes(status)
        ) {
            throw new HttpError(400, "Statut du projet invalide.");
        }
        validatedProjectData.status = status || "Planned";

        if (participants && !Array.isArray(participants)) {
            throw new HttpError(
                400,
                "Les participants doivent être un tableau d'ID d'utilisateur."
            );
        } else if (participants) {
            for (const participant of participants) {
                if (!mongoose.Types.ObjectId.isValid(participant)) {
                    throw new HttpError(
                        400,
                        `Participant ID invalide: ${participant}`
                    );
                }
            }
        }
        validatedProjectData.participants = participants || [];

        if (Object.keys(rest).length > 0) {
            throw new HttpError(400, "Champs supplémentaires invalides.");
        }

        return validatedProjectData;
    }

    static async createProject(projectData, userId) {
        try {
            // Valider les données du projet
            const validatedProjectData =
                await ProjectService.validateProjectData(projectData);

            // Définir le chef de projet comme l'utilisateur créant le projet
            validatedProjectData.projectManager = userId;

            // Créer le projet
            const project = await Project.create(validatedProjectData);

            return project;
        } catch (error) {
            console.error(error);
            if (error instanceof HttpError) {
                throw error;
            } else if (error.name === "ValidationError") {
                throw new HttpError(400, error.message);
            } else if (
                error.name === "MongoServerError" &&
                error.code === 11000
            ) {
                throw new HttpError(400, "Le projet existe déjà.");
            } else {
                throw new HttpError(500, "Erreur interne du serveur.");
            }
        }
    }

    static async getProjectById(projectId) {
        try {
            const project = await Project.findById(projectId)
                .populate("projectManager")
                .populate("participants");
            if (!project) {
                throw new HttpError(404, "Projet introuvable.");
            }
            return project;
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            } else {
                throw new HttpError(500, "Erreur interne du serveur.");
            }
        }
    }

    static async getAllProjects() {
        try {
            const projects = await Project.find()
                .populate("projectManager")
                .populate("participants");
            if (projects.length === 0) {
                throw new HttpError(404, "Aucun projet trouvé.");
            }
            return projects;
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            } else {
                throw new HttpError(500, "Erreur interne du serveur.");
            }
        }
    }

    static async updateProjectById(projectId, updatedProjectData) {
        try {
            const validatedProjectData =
                await ProjectService.validateProjectData(updatedProjectData);
            const project = await Project.findByIdAndUpdate(
                projectId,
                validatedProjectData,
                { new: true }
            );
            if (!project) {
                throw new HttpError(404, "Projet introuvable.");
            }
            return project;
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            } else {
                throw new HttpError(500, "Erreur interne du serveur.");
            }
        }
    }

    static async addParticipantsToProject(projectId, participants) {
        try {
            if (!Array.isArray(participants)) {
                throw new HttpError(
                    400,
                    "Les participants doivent être un tableau d'ID d'utilisateur."
                );
            }

            const project = await Project.findById(projectId);
            if (!project) {
                throw new HttpError(404, "Projet introuvable.");
            }

            for (const participant of participants) {
                if (!mongoose.Types.ObjectId.isValid(participant)) {
                    throw new HttpError(
                        400,
                        `Participant ID invalide: ${participant}`
                    );
                }

                if (!project.participants.includes(participant)) {
                    project.participants.push(participant);
                }
            }

            await project.save();
            return project;
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            } else {
                throw new HttpError(500, "Erreur interne du serveur.");
            }
        }
    }

    static async deleteProject(projectId) {
        try {
            const project = await Project.findByIdAndUpdate(projectId, {
                isDeleted: true,
            });
            if (!project) {
                throw new HttpError(404, "Projet introuvable.");
            }
            return project;
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            } else {
                throw new HttpError(500, "Erreur interne du serveur.");
            }
        }
    }
}

module.exports = ProjectService;
