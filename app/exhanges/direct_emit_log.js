/*
* _____________________
*                      |
*       Producer       |
* _____________________|
*
* */

const { createAMQPConnection, createAMQPChannel } = require('../helpers/amqp'),
    { EXCHANGE_LOGS_DIRECT, DEFAULT_QUEUE_MESSAGE, EXCHANGE_TYPES } = require('../shared'),
    { DIRECT } = EXCHANGE_TYPES;

(async () => {
    try {
        const connection = await createAMQPConnection();
        const channel = await createAMQPChannel(connection);

        const args = process.argv.slice(2);
        const msg = args.slice(1).join(' ') || DEFAULT_QUEUE_MESSAGE;

        // It is out routingKey. It might be ('info', 'warning', 'error')
        const severity = (args.length > 0) ? args[0] : 'info';

        channel.assertExchange(EXCHANGE_LOGS_DIRECT, DIRECT, { durable: true });

        channel.publish(EXCHANGE_LOGS_DIRECT, severity, new Buffer(msg));

        console.log(` [x] Sent ${severity}: '${msg}'`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);

    } catch (error) {
        console.log(error);
    }
})();

