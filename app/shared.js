/*
* Queues names
* */
module.exports.QUEUE_NAME = 'hello';
module.exports.TASK_QUEUE_NAME = 'task.queue';
module.exports.EXCHANGE_LOGS = 'logs'; // fanout logs
module.exports.EXCHANGE_LOGS_DIRECT = 'direct_logs';

/*
* Exchange types
* */
module.exports.EXCHANGE_TYPES = {
    FANOUT: 'fanout',
    DIRECT: 'direct'
};

/*
* Messages
* */
module.exports.DEFAULT_QUEUE_MESSAGE = 'Hello World!!!';
