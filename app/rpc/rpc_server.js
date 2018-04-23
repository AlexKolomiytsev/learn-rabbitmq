/*
* _____________________
*                      |
*       Consumer       |
* _____________________|
*
* */

const { createAMQPChannel } = require('../helpers/amqp'),
    { RPC_QUEUE } = require('../shared');

const fibonacci = (n) => (n === 0 || n === 1) ? n : fibonacci(n - 1) + fibonacci(n - 2);

(async () => {
    try {
        const channel = await createAMQPChannel();

        channel.assertQueue(RPC_QUEUE, { durable: false });
        channel.prefetch(1);

        console.log(' [x] Awaiting RPC requests. ');

        channel.consume(RPC_QUEUE, function reply(msg) {
            const number = parseInt(msg.content.toString());

            console.log(` [.] fib(${number})`);

            const result = fibonacci(number);

            channel.sendToQueue(
                msg.properties.replyTo,
                new Buffer(`${result}`),
                { correlationId: msg.properties.correlationId }
            );

            channel.ack(msg)
        });

    } catch (error) {
        console.log(error);
    }
})();


