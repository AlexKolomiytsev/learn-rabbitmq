/*
* _____________________
*                      |
*       Consumer       |
* _____________________|
*
* */

const { createAMQPChannel, assertAMQPQueue } = require('../helpers/amqp'),
    { EXCHANGE_LOGS_TOPIC, EXCHANGE_TYPES } = require('../shared'),
    { TOPIC } = EXCHANGE_TYPES;

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
    process.exit(1);
}

(async () => {
    try {
        const channel = await createAMQPChannel();

        channel.assertExchange(EXCHANGE_LOGS_TOPIC, TOPIC, { durable: false });

        const queue = await assertAMQPQueue('', { exclusive: true }, channel);

        console.log(` [*] Waiting for logs in '${queue.queue}'. To exit press CTRL+C`);

        args.forEach((routingKey) => {
            channel.bindQueue(queue.queue, EXCHANGE_LOGS_TOPIC, routingKey);
        });

        channel.consume(queue.queue, (msg) => {
            console.log(` [x] ${msg.fields.routingKey}: '${msg.content.toString()}'`);
        }, { noAck: true });

    } catch (error) {
        console.log(error);
    }
})();


