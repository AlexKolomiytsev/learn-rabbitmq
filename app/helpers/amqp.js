const amqp = require('amqplib/callback_api');

const host = 'amqp://localhost';

const createAMQPConnection = () => {

    return new Promise((resolve, reject) => {
        amqp.connect(host, function(err, connection) {
            if (err) reject(err);
            else {
                resolve(connection)
            }
        });
    });

};

const createAMQPChannel = async (existedConnection) => {
    const connection = existedConnection || await createAMQPConnection();

    return new Promise((resolve, reject) => {
        connection.createChannel(function(err, channel) {
            if (err) reject(err);
            else {
                resolve(channel);
            }
        });
    });
};


module.exports = {
    createAMQPConnection,
    createAMQPChannel
};
