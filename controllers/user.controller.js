const UserService = require("../services/user.services");
const HttpError = require("../utils/execptions"); // Vérifiez ce chemin
const enumUsersRoles = require("../utils/enums/enumUserRoles");
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
const userRegisterUser = async (req, res) => {
    try {
        const registerUser = await UserService.createUser(req.body);
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
    try {
        const { phone, password } = req.body;

        let user = await UserService.getUserByPhone(phone);
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

        return res.status(200).json({
            token,
            success: true,
            message: "Authentifié",
        });
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
            console.log(user.secret, bcrypt.hashSync(otp, 10));
            const valid = await comparePassword(otp, user.secret);
            if (!valid) {
                return res
                    .status(400)
                    .json({ message: "Code Secret invalide" });
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

module.exports = {
    userRegisterUser,
    userLoginUser,
    userVerifyOtp,
};
