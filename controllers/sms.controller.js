const SMSService = require("../services/sms.service");

/**
 * Contrôleur pour la gestion des SMS.
 */
class SMSController {
  /**
   * Envoie un SMS.
   * @param {import('express').Request} req - Requête Express.
   * @param {import('express').Response} res - Réponse Express.
   * @returns {Promise<void>} - Une promesse indiquant la fin du traitement.
   */
  static async sendSMS(req, res) {
    try {
      const { content, msisdns } = req.body;

      const success = await SMSService.sendSMSAndSave(content, msisdns);

      if (success) {
        res.json({ success: true, message: "SMS envoyé avec succès" });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Erreur lors de l'envoi du SMS" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = SMSController;
