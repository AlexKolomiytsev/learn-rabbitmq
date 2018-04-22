/*
* _____________________
*                      |
*       Consumer       |
* _____________________|
*
* */

const amqp = require('amqplib/callback_api'),
    { TASK_QUEUE_NAME } = require('./shared');

amqp.connect('amqp://localhost', function(err, connection) {

    connection.createChannel(function(err, channel) {
        channel.assertQueue(TASK_QUEUE_NAME, { durable: true });

        console.log(` [*] Waiting for messages in '${TASK_QUEUE_NAME}'. To exit press CTRL+C`);

        channel.consume(TASK_QUEUE_NAME, function(msg) {
            const secs = msg.content.toString().split('.').length - 1;

            console.log(` --> [x] Received ${msg.content.toString()}`);

            setTimeout(() => {
                console.log('     [x] Done.');
            }, secs * 1000);

        }, { noAck: true });

    });

});