/*
* _____________________
*                      |
*       Producer       |
* _____________________|
*
* */

const { createAMQPConnection, createAMQPChannel } = require('../helpers/amqp'),
    { EXCHANGE_LOGS, DEFAULT_QUEUE_MESSAGE } = require('../shared');

(async () => {
    try {
        const connection = await createAMQPConnection();
        const channel = await createAMQPChannel(connection);

        const msg = process.argv.slice(2).join(' ') || DEFAULT_QUEUE_MESSAGE;

        channel.assertExchange(EXCHANGE_LOGS, 'fanout', { durable: true });
        channel.publish(EXCHANGE_LOGS, '', new Buffer(msg));

        console.log(` [x] Sent '${msg}'`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);

    } catch (error) {
        console.log(error);
    }
})();

