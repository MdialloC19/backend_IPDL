const Conversation = require("../models/conversation.model");
const Room = require("../models/room.model");

/**
 * Configures the socket events and their corresponding handlers.
 * @param {import('socket.io').Server} io - The Socket.IO server instance.
 * @param {import('socket.io').Socket} client - The Socket.IO client instance.
 * @returns {Object} - An object containing the configured socket events and their handlers.
 */
const configureSockets = (io, client) => {
    return {
        /**
         * Handles the 'message' event.
         * @param {Object} message - The message object.
         * @param {string} message.room - The room name.
         * @param {string} message.from - The user ID.
         * @param {string} message.text - The message content.
         */
        message: async (message) => {
            if (message.room) {
                client.broadcast.to(message.room).emit("message", message);
                io.to(message.room).emit("message", message);

                // Save the message to the database
                const room = await Room.findOne({ name: message.room });
                if (!room) await Room.create({ name: message.room });
                const newMessage = new Conversation({
                    roomId: message.room,
                    userId: message.from, // Assumes `from` is userId
                    text: message.text, // Assumes `text` is the message content
                });
                await newMessage.save();
            } else {
                io.emit("message", {
                    ...message,
                    room: message.room,
                });
            }
            io.emit("notification", {
                message: message,
                room: message.room || "general",
                from: message.from,
            });
        },

        /**
         * Handles the 'discussion' event.
         * @param {Object} discussion - The discussion object.
         * @param {string} discussion.room - The room name.
         * @param {string} discussion.from - The user ID.
         */
        discussion: async (discussion) => {
            if (discussion.room) {
                io.to(discussion.room).emit("discussion", discussion);
            } else {
                io.emit("discussion", {
                    ...discussion,
                    room: discussion.room || "general",
                });
            }
            io.emit("notification", {
                message: "New discussion",
                room: discussion.room || "general",
                from: discussion.from,
            });
        },

        /**
         * Handles the 'notification' event.
         * @param {Object} notification - The notification object.
         * @param {string} notification.room - The room name.
         */
        notification: (notification) => {
            if (notification.room) {
                io.to(notification.room).emit("notification", notification);
            } else {
                io.emit("notification", {
                    ...notification,
                    room: notification.room || "general",
                });
            }
        },

        /**
         * Handles the 'subscribe' event.
         * @param {Object} data - The data object.
         * @param {string} data.room - The room name.
         */
        subscribe: (data) => {
            client.join(data.room);
            io.to(data.room).emit("subscribe", data);
        },

        /**
         * Handles the 'unsubscribe' event.
         * @param {Object} data - The data object.
         * @param {string} data.room - The room name.
         */
        unsubscribe: (data) => {
            client.leave(data.room);
            io.to(data.room).emit("unsubscribe", data);
        },

        /**
         * Handles the 'rooms' event.
         */
        rooms: () => {
            client.emit("rooms", io.sockets.adapter.rooms);
        },

        /**
         * Handles the 'disconnect' event.
         */
        disconnect: () => {
            client.disconnect();
        },
    };
};

/**
 * Handles the connection event.
 * @param {import('socket.io').Server} io - The Socket.IO server instance.
 * @returns {Function} - The connection event handler function.
 */
const onConnection = (io) => (client) => {
    console.log("New connection established");
    console.log("client.id", client.id);

    const { rooms, message, notification, subscribe, unsubscribe, disconnect } =
        configureSockets(io, client);

    client.on("message", message);
    client.on("notification", notification);
    client.on("subscribe", subscribe);
    client.on("unsubscribe", unsubscribe);
    client.on("rooms", rooms);

    client.on("disconnect", disconnect);
};

module.exports = onConnection;
