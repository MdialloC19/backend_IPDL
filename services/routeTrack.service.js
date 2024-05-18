const HttpError = require("../utils/execptions");
const RouteTrack = require("../models/routeTrack.model");
const nanoid = require("nanoid");

/**
 * Service class for managing route tracks.
 */
class RouteTrackService {
    /**
     * Creates a new route track for the specified user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<RouteTrack>} The created route track.
     */
    static async createRouteTrack(userId) {
        const routeTrack = new RouteTrack({
            userId,
            url: nanoid.nanoid(),
        });
        await routeTrack.save();
        return routeTrack;
    }

    /**
     * Retrieves a route track by its ID.
     * @param {string} routeId - The ID of the route track.
     * @returns {Promise<RouteTrack>} The retrieved route track.
     * @throws {HttpError} If the route track is not found.
     */
    static async getRouteTrack(routeId) {
        try {
            const routeTrack = await RouteTrack.findOne({
                routeId,
            });
            if (!routeTrack) {
                throw new HttpError(null, "Route track not found", 404);
            }
            return routeTrack;
        } catch (err) {
            if (err instanceof HttpError) {
                throw err;
            }
            throw new HttpError(err, "Internal server error", 500);
        }
    }

    /**
     * Deletes a route track by its ID.
     * @param {string} routeId - The ID of the route track.
     * @returns {Promise<RouteTrack>} The deleted route track.
     * @throws {HttpError} If the route track is not found.
     */
    static async deleteRouteTrack(routeId) {
        try {
            const routeTrack = await RouteTrack.findOneAndUpdate(
                {
                    routeId,
                },
                {
                    isExpired: true,
                },
                {
                    new: true,
                }
            );
            if (!routeTrack) {
                throw new HttpError(null, "Route track not found", 404);
            }
            return routeTrack;
        } catch (err) {
            if (err instanceof HttpError) {
                throw err;
            }
            throw new HttpError(err, "Internal server error", 500);
        }
    }
}

module.exports = RouteTrackService;
