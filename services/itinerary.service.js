const Itinerary = require("../models/itinerary.model");
const User = require("../models/user.model");
const enumUsersRoles = require("../utils/enums/enumUserRoles");
const HttpError = require("../utils/execptions");

/**
 * Service class for managing itineraries.
 */
class ItineraryService {
  /**
   * Creates a new itinerary.
   * @param {string} driverId - The ID of the driver.
   * @param {string[]} passengers - An array of passenger IDs.
   * @param {string} startPoint - The starting point of the itinerary.
   * @param {string} endPoint - The end point of the itinerary.
   * @param {string[]} stopovers - An array of stopover points.
   * @returns {Promise<Object>} The created itinerary object.
   */
  static async createItinerary(
    driverId,
    passengers,
    startPoint,
    endPoint,
    stopovers
  ) {
    const itinerary = new Itinerary({
      driver: driverId,
      passengers,
      startPoint,
      endPoint,
      stopovers,
    });
    await itinerary.save();
    return itinerary;
  }

  /**
   * Retrieves an itinerary by its ID.
   * @param {string} itineraryId - The ID of the itinerary.
   * @returns {Promise<Object>} The retrieved itinerary object.
   */
  static async getItineraryById(itineraryId) {
    return Itinerary.findById(itineraryId);
  }

  /**
   * Retrieves all itineraries associated with a driver.
   * @param {string} driverId - The ID of the driver.
   * @returns {Promise<Object[]>} An array of itinerary objects.
   */
  static async getItinerariesByDriver(driverId) {
    return Itinerary.find({ driver: driverId });
  }

  /**
   * Retrieves all itineraries associated with a passenger.
   * @param {string} passengerId - The ID of the passenger.
   * @returns {Promise<Object[]>} An array of itinerary objects.
   */
  static async getItinerariesByPassenger(passengerId) {
    return Itinerary.find({ passengers: { $in: [passengerId] } });
  }

  /**
   * Add a passenger to an itinerary.
   * @param {string} itineraryId - The ID of the itinerary.
   * @param {string} passengerId - The ID of the passenger.
   * @returns {Promise<Object>} The updated itinerary object.
   *
   */
  static async addPassengerToItinerary(itineraryId, passengerId) {
    try {
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) {
        throw new HttpError(null, 404, "Itinerary not found");
      }

      const passengerExists = itinerary.passengers.includes(passengerId);
      if (passengerExists) {
        throw new HttpError(null, 400, "Passenger already added to itinerary");
      }

      const passenger = await User.findById(passengerId);
      if (!passenger || passenger.role !== enumUsersRoles.PASSENGER) {
        throw new HttpError(null, 404, "Passenger not found");
      }

      itinerary.passengers.push(passengerId);
      await itinerary.save();
      return itinerary;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError) {
        throw error;
      } else if (error.name === "CastError") {
        throw new HttpError(null, 400, "Invalid itinerary/passenger ID");
      } else {
        throw new HttpError(null, 500, "Internal server error");
      }
    }
  }

  /**
   * Remove a passenger from an itinerary.
   * @param {string} itineraryId - The ID of the itinerary.
   * @param {string} passengerId - The ID of the passenger.
   * @returns {Promise<Object>} The updated itinerary object.
   */
  static async removePassengerFromItinerary(itineraryId, passengerId) {
    try {
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) {
        throw new HttpError(null, 404, "Itinerary not found");
      }
      const passengerExists = itinerary.passengers.includes(passengerId);
      if (!passengerExists) {
        throw new HttpError(null, 404, "Passenger not found in itinerary");
      }

      itinerary.passengers = itinerary.passengers.filter(
        (id) => id !== passengerId
      );
      await itinerary.save();
      return itinerary;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError) {
        throw error;
      } else if (error.name === "CastError") {
        throw new HttpError(null, 400, "Invalid itinerary/passenger ID");
      } else {
        throw new HttpError(null, 500, "Internal server error");
      }
    }
  }

  /**
   * Add stepover to an itinerary.
   * @param {string} itineraryId - The ID of the itinerary.
   * @param {[Number]} coordinates - The coordinates point.
   * @returns {Promise<Object>} The updated itinerary object.
   */
  static async addStopoverToItinerary(itineraryId, coordinates) {
    try {
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) {
        throw new HttpError(null, 404, "Itinerary not found");
      }

      if (
        !Array.isArray(coordiates) ||
        coordinates.length !== 2 ||
        !coordinates.every((coord) => typeof coord === "number")
      ) {
        throw new HttpError(null, 400, "Invalid coordinates");
      }

      const stopover = {
        type: "Point",
        coordinates,
      };

      itinerary.stopovers.push(stopover);
      await itinerary.save();
      return itinerary;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError) {
        throw error;
      } else if (error.name === "CastError") {
        throw new HttpError(null, 400, "Invalid itinerary ID");
      } else {
        throw new HttpError(null, 500, "Internal server error");
      }
    }
  }

  /**
   * Remove a stopover from an itinerary.
   * @param {string} itineraryId - The ID of the itinerary.
   * @param {[number]} coordinates - The coordinates point.
   * @returns {Promise<Object>} The updated itinerary object.
   */
  static async removeStopoverFromItinerary(itineraryId, coordinates) {
    try {
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) {
        throw new HttpError(null, 404, "Itinerary not found");
      }

      if (
        !Array.isArray(coordiates) ||
        coordinates.length !== 2 ||
        !coordinates.every((coord) => typeof coord === "number")
      ) {
        throw new HttpError(null, 400, "Invalid coordinates");
      }

      itinerary.stopovers = itinerary.stopovers.filter(
        (stopover) =>
          !(
            stopover.coordinates[0] === coordinates[0] &&
            stopover.coordinates[1] === coordinates[1]
          )
      );

      await itinerary.save();
      return itinerary;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError) {
        throw error;
      } else if (error.name === "CastError") {
        throw new HttpError(null, 400, "Invalid itinerary ID");
      } else {
        throw new HttpError(null, 500, "Internal server error");
      }
    }
  }

  /**
   * Update the status of an itinerary: mark as completed.
   * @param {string} itineraryId - The ID of the itinerary.
   * @returns {Promise<Object>} The updated itinerary object.
   */
  static async markItineraryAsCompleted(itineraryId) {
    try {
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) {
        throw new HttpError(null, 404, "Itinerary not found");
      }

      itinerary.isCompleted = true;
      await itinerary.save();
      return itinerary;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError) {
        throw error;
      } else if (error.name === "CastError") {
        throw new HttpError(null, 400, "Invalid itinerary ID");
      } else {
        throw new HttpError(null, 500, "Internal server error");
      }
    }
  }

  /**
   * Update the status of an itinerary: mark as canceled.
   * @param {string} itineraryId - The ID of the itinerary.
   * @returns {Promise<Object>} The updated itinerary object.
   */
  static async markItineraryAsCanceled(itineraryId) {
    try {
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) {
        throw new HttpError(null, 404, "Itinerary not found");
      }

      itinerary.isCanceled = true;
      await itinerary.save();
      return itinerary;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError) {
        throw error;
      } else if (error.name === "CastError") {
        throw new HttpError(null, 400, "Invalid itinerary ID");
      } else {
        throw new HttpError(null, 500, "Internal server error");
      }
    }
  }
}

module.exports = ItineraryService;
