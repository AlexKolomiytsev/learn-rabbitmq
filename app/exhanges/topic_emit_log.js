/*
* _____________________
*                      |
*       Producer       |
* _____________________|
*
* */

const { createAMQPConnection, createAMQPChannel } = require('../helpers/amqp'),
    { EXCHANGE_LOGS_TOPIC, DEFAULT_QUEUE_MESSAGE, EXCHANGE_TYPES } = require('../shared'),
    { TOPIC } = EXCHANGE_TYPES;

(async () => {
    try {
        const connection = await createAMQPConnection();
        const channel = await createAMQPChannel(connection);

        const args = process.argv.slice(2);
        const routingKey = (args.length > 0) ? args[0] : 'anonymous.info';
        const msg = args.slice(1).join(' ') || DEFAULT_QUEUE_MESSAGE;

        channel.assertExchange(EXCHANGE_LOGS_TOPIC, TOPIC, { durable: false });
        channel.publish(EXCHANGE_LOGS_TOPIC, routingKey, new Buffer(msg));

        console.log(` [x] Sent ${routingKey}: '${msg}'`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);

    } catch (error) {
        console.log(error);
    }
})();

