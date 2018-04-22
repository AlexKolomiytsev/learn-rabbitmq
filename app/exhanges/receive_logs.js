/*
* _____________________
*                      |
*       Consumer       |
* _____________________|
*
* */

const { createAMQPChannel, assertAMQPQueue } = require('../helpers/amqp'),
    { EXCHANGE_LOGS } = require('../shared');

(async () => {
    try {
        const channel = await createAMQPChannel();

        channel.assertExchange(EXCHANGE_LOGS, 'fanout', { durable: true });

        const queue = await assertAMQPQueue('', { exclusive: true }, channel);

        console.log(` [*] Waiting for messages in '${queue.queue}'. To exit press CTRL+C`);

        channel.bindQueue(queue.queue, EXCHANGE_LOGS, '');

        channel.consume('', (msg) => {

            console.log(` --> [x] ${msg.content.toString()}`);

        }, { noAck: true });
    } catch (error) {
        console.log(error);
    }
})();


