const amqp = require('amqplib/callback_api');

const host = 'amqp://localhost';

const createAMQPConnection = () => {

    return new Promise((resolve, reject) => {
        amqp.connect(host, (err, connection) => {
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
        connection.createChannel((err, channel) => {
            if (err) reject(err);
            else {
                resolve(channel);
            }
        });
    });
};

const assertAMQPQueue = async (queueName, assertOptions, existedChannel) => {
    const channel = existedChannel || await createAMQPChannel();

    return new Promise((resolve, reject) => {
        channel.assertQueue(queueName, assertOptions, (err, queue) => {
            if (err) reject(err);
            else {
                resolve(queue);
            }
        })
    })

};


module.exports = {
    createAMQPConnection,
    createAMQPChannel,
    assertAMQPQueue
};
