/*
* _____________________
*                      |
*       Producer       |
* _____________________|
*
* */

const amqp = require('amqplib/callback_api'),
    { QUEUE_NAME, DEFAULT_QUEUE_MESSAGE } = require('./shared');

amqp.connect('amqp://localhost', function(err, connection) {

    connection.createChannel((err, channel) => {
        channel.assertQueue(QUEUE_NAME, { durable: false });
        channel.sendToQueue(QUEUE_NAME, new Buffer(DEFAULT_QUEUE_MESSAGE));
        console.log(` [x] Sent '${DEFAULT_QUEUE_MESSAGE}' `);
    });

    setTimeout(() => {
        connection.close(); process.exit(0)
    }, 500);

});

