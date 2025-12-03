const RabbitMQService = require('./rabbitmq-service')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })

async function processMessage(msg) {
    const deliveryData = JSON.parse(msg.content)
    try {
        if(deliveryData.address && deliveryData.address.zipCode) {
            console.log(`✔ SUCCESS, SHIPPING AUTHORIZED, SEND TO:`)
            console.log(deliveryData.address)
        } else {
            console.log(`X ERROR, WE CAN'T SEND WITHOUT ZIPCODE :'(`)
        }
        
        // PUBLICAÇÃO PARA O NOVO SERVIÇO DE INVENTÁRIO
        const inventoryPayload = deliveryData.products.map(p => ({
            name: p.name,
            quantity: 1 // Assumindo que cada produto na lista é uma unidade vendida
        }));
        await (await RabbitMQService.getInstance()).send('inventory', inventoryPayload)
        
        // PUBLICAÇÃO EXISTENTE PARA O RELATÓRIO
        await (await RabbitMQService.getInstance()).send('report', deliveryData)

    } catch (error) {
        console.log(`X ERROR TO PROCESS: ${error.message}`)
    }
}

async function consume() {
    console.log(`SUCCESSFULLY SUBSCRIBED TO QUEUE: ${process.env.RABBITMQ_QUEUE_NAME}`)
    await (await RabbitMQService.getInstance()).consume(process.env.RABBITMQ_QUEUE_NAME, (msg) => {processMessage(msg)})} 

consume()