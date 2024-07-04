const User = require("../models/user.model"); // Importez User une seule fois
const SMS = require("../utils/sms/sms");

const { HttpError } = require("../utils/execptions");
const integretyTester = require("../utils/integrity");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
// const sms = require("../controllers/sms.controller");
const SMSService = require("../services/sms.service");

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidSenegalPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+221\d{9}$/;
    return phoneRegex.test(phoneNumber);
};
/**
 * Génère un OTP (One-Time Password) aléatoire.
 * @returns {string} - OTP généré.
 */
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

async function hashSecret(secret) {
    return bcrypt.hash(secret, 10);
}

class UserService {
    static async validateUserData(userData) {
        const errors = validationResult(userData);
        if (!errors.isEmpty()) {
            throw new HttpError(400, "Tester");
        }

        const {
            firstname,
            lastname,
            dateofbirth,
            placeofbirth,
            nationality,
            address,
            sexe,
            email,
            password,
            phone,
            isDeleted = false,
            ...rest
        } = userData;

        const validatedUserData = {};

        if (!firstname || typeof firstname !== "string") {
            throw new HttpError(
                400,
                "Le prénom est requis et doit être une chaîne de caractères."
            );
        }
        validatedUserData.firstname = firstname;

        if (!lastname || typeof lastname !== "string") {
            throw new HttpError(
                400,
                "Le nom de famille est requis et doit être une chaîne de caractères."
            );
        }
        validatedUserData.lastname = lastname;

        if (!new Date(dateofbirth)) {
            throw new HttpError(400, "Date de naissance invalide.");
        }
        validatedUserData.dateofbirth = new Date(dateofbirth);

        if (!placeofbirth || typeof placeofbirth !== "string") {
            throw new HttpError(
                400,
                "Le lieu de naissance est requis et doit être une chaîne de caractères."
            );
        }
        validatedUserData.placeofbirth = placeofbirth;

        if (!nationality || typeof nationality !== "string") {
            throw new HttpError(
                400,
                "La nationalité est requise et doit être une chaîne de caractères."
            );
        }
        validatedUserData.nationality = nationality;

        if (!address || typeof address !== "string") {
            throw new HttpError(
                400,
                "L'adresse est requise et doit être une chaîne de caractères."
            );
        }
        validatedUserData.address = address;

        if (!sexe || !["M", "F"].includes(sexe)) {
            throw new HttpError(
                400,
                "Le sexe doit être 'M' (Masculin) ou 'F' (Féminin)."
            );
        }
        validatedUserData.sexe = sexe;

        if (!integretyTester.isEmail(email)) {
            throw new HttpError(400, "Format d'email invalide.");
        }
        validatedUserData.email = email;

        if (!password || typeof password !== "string" || password.length < 6) {
            throw new HttpError(
                400,
                "Le mot de passe est requis et doit comporter au moins 6 caractères."
            );
        } else {
            const salt = await bcrypt.genSalt(10);
            const cryptPassword = await bcrypt.hash(password, salt);
            validatedUserData.password = cryptPassword;
        }

        // // if (
        // //   role &&
        // //   !["STUDENT", "TEACHER", "ADMIN", "SUPERADMIN"].includes(
        // //     role.toUpperCase()
        // //   )
        // // ) {
        // //   throw new HttpError(400, "Rôle utilisateur invalide.");
        // // }

        // validatedUserData.role = role;

        // if (!phone || typeof phone !== "string") {
        //   throw new HttpError(
        //     400,
        //     "Le numéro de téléphone est requis et doit être un nombre."
        //   );
        // }
        validatedUserData.phone = phone;

        if (Object.keys(rest).length > 0) {
            throw new HttpError(400, "Champs supplémentaires invalides.");
        }

        return validatedUserData;
    }

    static async createUser(userData) {
        try {
            //   const validatedUserData = await UserService.validateUserData(userData);
            // const secret = generateOTP();
            // const hashedSecret = await hashSecret(secret);
            const salt = await bcrypt.genSalt(10);
            const cryptPassword = await bcrypt.hash(userData.password, salt);
            userData.password = cryptPassword;
            //   validatedUserData.secret = hashedSecret;
            // userData.secret = hashedSecret;
            const user = await User.create(userData);
            console.log(userData);
            // const content = await SMS.sendSmsOPT(secret);
            // await SMSService.sendSMSAndSave(content, userData.phone);

            return user;
        } catch (error) {
            console.error(error);
            if (error instanceof HttpError) {
                throw error;
            } else if (error.name === "ValidationError") {
                throw new HttpError(error, 400, error.message);
            } else if (
                error.name === "MongoServerError" &&
                error.code === 11000
            ) {
                throw new HttpError(error, 400, "L'email existe déjà.");
            } else if (error.name === "CastError") {
                throw new HttpError(error, 400, "ID invalide.");
            } else {
                throw new HttpError(error, 500, "Erreur interne du serveur.");
            }
        }
    }

    /**
     * Récupère un utilisateur existant par ID.
     * @param {string} userId - ID de l'utilisateur à récupérer.
     * @returns {Promise<Object>} - Promesse résolue avec l'utilisateur récupéré.
     * @throws {HttpError} - Lance une erreur HTTP personnalisée si la récupération de l'utilisateur échoue.
     */
    static async getUserById(userId) {
        try {
            // Trouve l'utilisateur par ID en utilisant le modèle Mongoose
            const user = await User.findById(userId);

            if (!user) {
                throw new HttpError(error, 404, "Utilisateur introuvable.");
            }

            return user;
        } catch (error) {
            if (error instanceof HttpError) {
                throw error; // Renvoie l'erreur HTTP personnalisée
            } else {
                throw new HttpError(error, 500, "Erreur interne du serveur."); // Par défaut, renvoie 500 pour les erreurs inattendues
            }
        }
    }

    static async getUserByEmail(userEmail) {
        try {
            const user = await User.findOne({ email: userEmail });

            if (!user) {
                throw new HttpError(null, 404, "Utilisateur introuvable.");
            }

            return user;
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            } else {
                throw new HttpError(error, 500, "Erreur interne du serveur.");
            }
        }
    }

    static async getUserByPhone(userPhone) {
        try {
            const user = await User.findOne({ phone: userPhone });

            if (!user) {
                throw new HttpError(null, 404, "Utilisateur introuvable.");
            }

            return user;
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            } else {
                throw new HttpError(error, 500, "Erreur interne du serveur.");
            }
        }
    }

    static async getAllUsers() {
        try {
            const users = await User.find();

            if (users.length === 0) {
                throw new HttpError(null, 404, "Aucun utilisateur trouvé.");
            }

            return users;
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            } else {
                throw new HttpError(error, 500, "Erreur interne du serveur.");
            }
        }
    }
    /**
     * Met à jour un utilisateur existant par ID.
     * @param {string} userId - ID de l'utilisateur à mettre à jour.
     * @param {Object} updatedUserData - Données mises à jour pour l'utilisateur.
     * @returns {Promise<Object>} - Promesse résolue avec l'utilisateur mis à jour.
     * @throws {HttpError} - Lance une erreur HTTP personnalisée si la mise à jour de l'utilisateur échoue.
     */
    static async updateUserById(userId, updatedUserData) {
        try {
            // Valider les données de l'utilisateur mises à jour
            // const validatedUserData = UserService.validateUserData(updatedUserData);

            // Mettre à jour l'utilisateur en utilisant le modèle Mongoose
            const user = await User.findByIdAndUpdate(userId, updatedUserData, {
                new: true,
            });

            if (!user) {
                throw new HttpError(null, 404, "Utilisateur introuvable.");
            }

            return user;
        } catch (error) {
            if (error instanceof HttpError) {
                throw error; // Renvoie l'erreur HTTP personnalisée
            } else {
                throw new HttpError(error, 500, "Erreur interne du serveur."); // Par défaut, renvoie 500 pour les erreurs inattendues
            }
        }
    }

    static async updateUserByEmail(userEmail, updatedUserData) {
        try {
            // Mettre à jour l'utilisateur en utilisant le modèle Mongoose
            const user = await User.findOneAndUpdate(
                { email: userEmail },
                updatedUserData,
                {
                    new: true,
                }
            );

            if (!user) {
                throw new HttpError(null, 404, "Utilisateur introuvable.");
            }

            return user;
        } catch (error) {
            if (error instanceof HttpError) {
                throw error; // Renvoie l'erreur HTTP personnalisée
            } else {
                throw new HttpError(error, 500, "Erreur interne du serveur."); // Par défaut, renvoie 500 pour les erreurs inattendues
            }
        }
    }

    static async updateUserConfirmationStatus(identifiant) {
        let user;

        if (isValidEmail(identifiant)) {
            user = await UserService.getUserByEmail(identifiant);
        } else if (isValidSenegalPhoneNumber(identifiant)) {
            user = await UserService.getUserByPhone(identifiant);
        } else {
            user = await UserService.getUserById(identifiant);
        }

        if (!user) {
            throw createNotFoundError(
                "User",
                "L'utilisateur n'est pas trouvé !"
            );
        }

        await user.updateOne({ $set: { confirmed: true } });
    }

    /**
     * Supprime un utilisateur existant par ID.
     * @param {string} userId - ID de l'utilisateur à supprimer.
     * @returns {Promise<Object>} - Promesse résolue avec l'utilisateur supprimé.
     * @throws {HttpError} - Lance une erreur HTTP personnalisée si la suppression de l'utilisateur échoue.
     */
    static async deleteUser(userId) {
        try {
            // Trouve et supprime l'utilisateur en utilisant le modèle Mongoose
            const user = await User.findByIdAndUpdate(userId, {
                isDeleted: true,
            });

            if (!user) {
                throw new HttpError(null, 404, "Utilisateur introuvable.");
            }

            return user;
        } catch (error) {
            if (error instanceof HttpError) {
                throw error; // Renvoie l'erreur HTTP personnalisée
            } else {
                throw new HttpError(error, 500, "Erreur interne du serveur."); // Par défaut, renvoie 500 pour les erreurs inattendues
            }
        }
    }
}

module.exports = UserService;
