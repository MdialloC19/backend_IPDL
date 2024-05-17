const axios = require("axios");
const SMS = require("../models/sms.model");
const User = require("../models/user.model");
const dotenv = require("dotenv");
dotenv.config();
/**
 * Service pour envoyer des SMS via l'API IntechSMS et enregistrer les SMS dans la base de données.
 */
class SMSService {
  /**
   * Envoie un SMS via l'API IntechSMS et enregistre le SMS dans la base de données.
   * @param {string} sender - L'expéditeur du SMS.
   * @param {string} content - Le contenu du SMS.
   * @param {Array<string>} msisdns - Les numéros de téléphone des destinataires du SMS.
   * @returns {Promise<boolean>} - Une promesse résolue indiquant si le SMS a été envoyé et enregistré avec succès.
   * @throws {Error} - Lance une erreur si l'envoi du SMS ou l'enregistrement dans la base de données échoue.
   */
  static async sendSMSAndSave(content, msisdns) {
    try {
      // Vérifier les numéros de téléphone des destinataires
      //   const receiverIDs = await this.getReceiverIDs(msisdns);

      // Préparer la requête pour l'API IntechSMS
      const url = process.env.urlAPISMS;
      const payload = {
        app_key: process.env.INTECHSMS_API_KEY,
        sender: process.env.SENDER,
        content: content,
        msisdn: [msisdns],
      };

      // Appeler l'API IntechSMS pour envoyer le SMS
      const response = await axios.post(url, payload);

      // Vérifier la réponse de l'API IntechSMS
      if (response.status === 200) {
        // Enregistrer le SMS dans la base de données
        const newSMS = new SMS({
          intitule: "SMS sortant",
          contenu: content,
          idReceiver: msisdns,
        });
        await newSMS.save();

        return true; // Le SMS a été envoyé et enregistré avec succès
      } else {
        throw new Error("Erreur lors de l'envoi du SMS via l'API IntechSMS");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Vérifie les numéros de téléphone des destinataires et récupère leurs ID utilisateurs.
   * @param {Array<string>} msisdns - Les numéros de téléphone des destinataires.
   * @returns {Promise<Array<string>>} - Une promesse résolue avec les ID des destinataires.
   * @throws {Error} - Lance une erreur si un numéro de téléphone n'est pas associé à un utilisateur.
   */
  static async getReceiverIDs(msisdns) {
    try {
      const receiverIDs = [];
      for (const msisdn of msisdns) {
        const user = await User.findOne({ phone: msisdn });
        console.log(user);
        if (user) {
          receiverIDs.push(user._id);
        } else {
          throw new Error(
            `Utilisateur avec le numéro de téléphone ${msisdn} non trouvé`
          );
        }
      }
      return receiverIDs;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = SMSService;
