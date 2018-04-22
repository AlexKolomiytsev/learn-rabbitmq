/*
* _____________________
*                      |
*       Producer       |
* _____________________|
*
* */

const amqp = require('amqplib/callback_api'),
    { TASK_QUEUE_NAME, DEFAULT_QUEUE_MESSAGE } = require('./shared');

amqp.connect('amqp://localhost', function(err, connection) {

    connection.createChannel((err, channel) => {
        const msg = process.argv.slice(2).join(' ') || DEFAULT_QUEUE_MESSAGE;

        channel.assertQueue(TASK_QUEUE_NAME, { durable: true });

        channel.sendToQueue(TASK_QUEUE_NAME, new Buffer(msg), { persistent: true });

        console.log(` [x] Sent '${msg}'`);
    });

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);

});

