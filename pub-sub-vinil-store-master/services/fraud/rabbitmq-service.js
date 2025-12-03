const amqplib = require('amqplib');

class RabbitMQ {
    constructor() {
        this.url = `amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`;
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        if (!this.connection) this.connection = await amqplib.connect(this.url);
        if (!this.channel) this.channel = await this.connection.createChannel();
        this.channel.prefetch(1);
    }

    async send(queue, message) {
        if (this.channel) {
            await this.channel.assertQueue(queue, { durable: true, queueMode: 'lazy' });
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        }
    }

    async consume(queue, callback) {
        if (this.channel) {
            await this.channel.assertQueue(queue, { durable: true, queueMode: 'lazy' });
            await this.channel.consume(queue, callback, { noAck: true });
        }
    }
}

class RabbitMQService {
    static async getInstance() {
        if (!RabbitMQService.instance) {
            const instance = new RabbitMQ();
            await instance.connect();
            RabbitMQService.instance = instance;
        }
        return RabbitMQService.instance;
    }
}

module.exports = RabbitMQService;