exports.uploadCard = (req, res) => {
    try {
        if (!req.files || !req.files["recto"] || !req.files["verso"]) {
            return res.status(400).json({
                message:
                    "Veuillez télécharger les deux images (recto et verso).",
            });
        }

        const rectoImage = req.files["recto"][0];
        const versoImage = req.files["verso"][0];

        // Vous pouvez ajouter ici la logique de traitement ou de sauvegarde des informations supplémentaires

        res.status(201).json({
            message: "Images téléchargées avec succès!",
            recto: rectoImage.filename,
            verso: versoImage.filename,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors du téléchargement des images.",
            error: error.message,
        });
    }
};
