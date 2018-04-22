/*
* _____________________
*                      |
*       Consumer       |
* _____________________|
*
* */

const amqp = require('amqplib/callback_api'),
    { QUEUE_NAME } = require('./shared');

amqp.connect('amqp://localhost', function(err, connection) {

    connection.createChannel(function(err, channel) {
        channel.assertQueue(QUEUE_NAME, { durable: false });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", QUEUE_NAME);

        channel.consume(QUEUE_NAME, function(msg) {
            console.log(` --> [x] Received ${msg.content.toString()}`);
        }, {noAck: true});

    });

});