const RouteTrackService = require("../services/routeTrack.service");
const HttpError = require("../utils/execptions");

/**
 * Creates a new route track.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the route track is created.
 */
async function createRouteTrack(req, res) {
    try {
        const routeTrack = await RouteTrackService.createRouteTrack(
            req.user.id
        );
        res.status(201).json(routeTrack);
    } catch (err) {
        if (err instanceof HttpError) {
            return res.status(err.status).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Retrieves a route track by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the route track.
 */
async function getRouteTrack(req, res) {
    const { routeId } = req.params;

    if (!routeId) {
        return res.status(400).json({ message: "Route ID is required" });
    }

    try {
        const routeTrack = await RouteTrackService.getRouteTrack(routeId);
        res.status(200).json(routeTrack);
    } catch (err) {
        if (err instanceof HttpError) {
            return res.status(err.status).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Deletes a route track by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the route track is deleted.
 */
async function deleteRouteTrack(req, res) {
    const { routeId } = req.params;

    if (!routeId) {
        return res.status(400).json({ message: "Route ID is required" });
    }

    try {
        const routeTrack = await RouteTrackService.deleteRouteTrack(routeId);
        res.status(200).json(routeTrack);
    } catch (err) {
        if (err instanceof HttpError) {
            return res.status(err.status).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createRouteTrack,
    getRouteTrack,
    deleteRouteTrack,
};
