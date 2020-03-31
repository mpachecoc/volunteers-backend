const socketio = require('socket.io');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

exports.setupWebSocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        const { latitude, longitude, allowed_day } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            allowed_day: allowed_day,
        });

    });
};

exports.findConnections = (coordinates, allowed_day) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 5 
            && connection.allowed_day == allowed_day
    })
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    })
}