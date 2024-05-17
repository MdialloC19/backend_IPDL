const itineraryService = require("../services/itinerary.service");
const HttpError = require("../utils/execptions.js");

/**
 * Creates a new itinerary.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the itinerary is created.
 */
async function createItinerary(req, res) {
  try {
    const { driverId, passengers, startPoint, endPoint, stopovers } = req.body;
    const itinerary = await itineraryService.createItinerary(
      driverId,
      passengers,
      startPoint,
      endPoint,
      stopovers
    );
    res.status(201).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Retrieves an itinerary by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the retrieved itinerary.
 */
async function getItineraryById(req, res) {
  try {
    const { itineraryId } = req.params;
    const itinerary = await itineraryService.getItineraryById(itineraryId);
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Retrieves all itineraries associated with a driver.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the retrieved itineraries.
 */
async function getItinerariesByDriver(req, res) {
  try {
    const { driverId } = req.params;
    const itineraries = await itineraryService.getItinerariesByDriver(driverId);
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Retrieves all itineraries associated with a passenger.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the retrieved itineraries.
 */
async function getItinerariesByPassenger(req, res) {
  try {
    const { passengerId } = req.params;
    const itineraries = await itineraryService.getItinerariesByPassenger(
      passengerId
    );
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
/**
 * Add a passenger to an itinerary.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the updated itinerary.
 */
async function addPassengerToItinerary(req, res) {
  try {
    const { itineraryId, passengerId } = req.body;
    const itinerary = await itineraryService.addPassengerToItinerary(
      itineraryId,
      passengerId
    );
    res.status(200).json(itinerary);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
}

/**
 * Remove a passenger from an itinerary.
 * @param {Object} req - The request object.
 *  @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the updated itinerary.
 */
async function removePassengerFromItinerary(req, res) {
  try {
    const { itineraryId, passengerId } = req.body;
    const itinerary = await itineraryService.removePassengerFromItinerary(
      itineraryId,
      passengerId
    );
    res.status(200).json(itinerary);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
}

/**
 * Add stepover to an itinerary.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the updated itinerary.
 */
async function addStopoverToItinerary(req, res) {
  try {
    const { itineraryId, coordinates } = req.body;
    const itinerary = await itineraryService.addStopoverToItinerary(
      itineraryId,
      coordinates
    );
    res.status(200).json(itinerary);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
}

/**
 * Remove a stopover from an itinerary.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the updated itinerary.
 */
async function removeStopoverFromItinerary(req, res) {
  try {
    const { itineraryId, stopoverId } = req.body;
    const itinerary = await itineraryService.removeStopoverFromItinerary(
      itineraryId,
      stopoverId
    );
    res.status(200).json(itinerary);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
}

/**
 * Completes an itinerary.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the updated itinerary.
 */
async function completeItinerary(req, res) {
  try {
    const { itineraryId } = req.params;
    const itinerary = await itineraryService.markItineraryAsCompleted(
      itineraryId
    );
    res.status(200).json(itinerary);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
}

/**
 * Cancels an itinerary.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the updated itinerary.
 */
async function cancelItinerary(req, res) {
  try {
    const { itineraryId } = req.params;
    const itinerary = await itineraryService.markItineraryAsCanceled(
      itineraryId
    );
    res.status(200).json(itinerary);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createItinerary,
  getItineraryById,
  getItinerariesByDriver,
  getItinerariesByPassenger,
  addPassengerToItinerary,
  removePassengerFromItinerary,
  addStopoverToItinerary,
  removeStopoverFromItinerary,
  completeItinerary,
  cancelItinerary,
};
