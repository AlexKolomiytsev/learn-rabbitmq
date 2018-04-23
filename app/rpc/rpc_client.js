/*
* _____________________
*                      |
*       Producer       |
* _____________________|
*
* */

const { createAMQPConnection, createAMQPChannel, assertAMQPQueue } = require('../helpers/amqp'),
    { RPC_QUEUE } = require('../shared');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Usage: rpc_client.js {number}");
    process.exit(1);
}

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

(async () => {
    try {
        const connection = await createAMQPConnection();
        const channel = await createAMQPChannel(connection);

        const queue = await assertAMQPQueue('', { exclusive: true }, channel);

        const correlationId = generateUuid();
        const number = parseInt(args[0]);

        console.log(` [x] Requesting fib(${number})`);

        channel.consume(queue.queue, (msg) => {
            if (msg.properties.correlationId === correlationId) {
                console.log(` [.] Got ${msg.content}`);

                setTimeout(() => {
                    connection.close();
                    process.exit(0);
                }, 500);
            }
        }, { noAck: true });

        channel.sendToQueue(
            RPC_QUEUE,
            new Buffer(`${number}`),
            { correlationId, replyTo: queue.queue }
        );

    } catch (error) {
        console.log(error);
    }
})();


