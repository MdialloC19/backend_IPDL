const UserService = require("../services/user.services");
const HttpError = require("../utils/execptions"); // Vérifiez ce chemin
const enumUsersRoles = require("../utils/enums/enumTypeDocument");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Assurez-vous d'importer jwt

/**
 * Enregistre un nouvel utilisateur
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>} - Promesse indiquant la fin du traitement
 */
async function hashSecret(secret) {
    return bcrypt.hash(secret, 10);
}
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
// const userRegisterUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const registerUser = await UserService.createUser({ email, password });
//         return res.status(201).json(registerUser);
//     } catch (error) {
//         console.error(error);
//         if (error instanceof HttpError) {
//             res.status(error.statusCode).json({ message: error.message });
//         } else {
//             res.status(500).json({ message: "Internal Server Error" });
//         }
//     }
// };
const userRegisterUser = async (req, res) => {
    try {
        const { email, password, name, lastname, phone, role } = req.body;

        // Vérification des champs obligatoires
        if (!email || !password) {
            throw new HttpError(
                400,
                "Veuillez fournir une adresse e-mail et un mot de passe."
            );
        }

        // Création d'un objet utilisateur avec les champs disponibles
        const user = {
            email,
            password,
            name,
            lastname,
            phone,
            role,
        };

        const registerUser = await UserService.createUser(user);
        return res.status(201).json(registerUser);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

const userLoginUser = async (req, res) => {
    console.log("logging in");
    try {
        const { email, password } = req.body;

        let user = await UserService.getUserByEmail(email);
        if (!user) {
            throw new HttpError(null, 400, "Identifiants invalides");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new HttpError(null, 400, "Identifiants invalides");
        }

        const payload = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        };

        let token;
        try {
            token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
        } catch (error) {
            throw new HttpError(error, 500, "Échec de la génération du token.");
        }

        console.log("connected!");
        return res.status(200).json({
            userId: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            phone: user.phone,
            token,
            success: true,
            message: "Authentifié",
        });
    } catch (error) {
        console.log("login error...");
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

/**
 * Vérifie le code OTP ou le code secret personnel pour la confirmation de l'utilisateur.
 * @param {Object} req Objet de requête Express.
 * @param {Object} res Objet de réponse Express.
 * @param {Function} next Fonction de middleware suivant.
 */
const userVerifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const user = await UserService.getUserByPhone(phone);
        if (
            user &&
            (user.role === enumUsersRoles.ADMIN ||
                user.role === enumUsersRoles.PASSENGER ||
                user.role === enumUsersRoles.DRIVER)
        ) {
            const valid = await comparePassword(otp, user.secret);
            if (!valid) {
                throw createNotFoundError(
                    "Compte",
                    "Le code secret personnel est incorrect !"
                );
            }

            await UserService.updateUserConfirmationStatus(phone);

            return res.json({
                code: 200,
                msg: "Code Secret valide, vérification réussie.",
                phone,
            });
        }

        // const storedData = otpData.get(email);
        // if (isValidCode(storedData, otp)) {
        //   otpData.delete(email);
        //   await updateUserConfirmationStatus(email);

        //   return res.json({
        //     code: 200,
        //     msg: "Code OTP valide, vérification réussie.",
        //     email,
        //   });
        // } else {
        //   let error = new Error(
        //     "Code OTP invalide ou expiré, vérification échouée."
        //   );
        //   error.statusCode = 498;
        //   throw error;
        // }
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};
const getAllUsers = async (req, res) => {
    try {
        const result = await UserService.getAllUsers();
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const result = await UserService.getUserByEmail(email);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        te;

        const result = await UserService.getUserById(id);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
};

module.exports = {
    userRegisterUser,
    userLoginUser,
    userVerifyOtp,
    getAllUsers,
    getUserByEmail,
    getUserById,
};
