const configureSockets = (io, client) => {
    return {
        message: (message) => {
            if (message.room) {
                console.log("message.room", message.room);
                io.to(message.room).emit("message", message);
            } else {
                io.emit("message", {
                    ...message,
                    room: message.room,
                });
            }
            io.emit("notification", {
                message: "New message",
                room: message.room || "general",
                from: message.from,
            });
        },

        discussion: (discussion) => {
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

        subscribe: (data) => {
            client.join(data.room);
            io.to(data.room).emit("subscribe", data);
        },

        unsubscribe: (data) => {
            client.leave(data.room);
            io.to(data.room).emit("unsubscribe", data);
        },

        rooms: () => {
            client.emit("rooms", io.sockets.adapter.rooms);
        },

        disconnect: () => {
            client.disconnect();
        },
    };
};

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
