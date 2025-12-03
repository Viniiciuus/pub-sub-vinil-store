const RabbitMQService = require('./rabbitmq-service')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })

function isValidOrder(orderData) {
    if(!orderData.products  || orderData.products.length <= 0) { //SEM PRODUTO
        return false
    }
    if(!orderData.cpf || !orderData.name) { //SEM DADOS PESSOAIS
        return false
    }
    return true
}

async function processMessage(msg) {
    const orderData = JSON.parse(msg.content)
    try {
        if(isValidOrder(orderData)) {
            
            // 1. PUBLICAÇÃO PARA O NOVO SERVIÇO DE FRAUDE (Antes da aprovação final)
            await (await RabbitMQService.getInstance()).send('fraud-check', {
                orderId: Math.floor(Math.random() * 1000000), // Simula um ID de pedido
                cpf: orderData.cpf,
                creditCardNumber: orderData.creditCard ? orderData.creditCard.number : 'N/A'
            })

            // 2. LÓGICA DE APROVAÇÃO EXISTENTE
            await (await RabbitMQService.getInstance()).send('contact', { 
                "clientFullName": orderData.name,
                "to": orderData.email,
                "subject": "Pedido Aprovado",
                "text": `${orderData.name}, seu pedido de disco de vinil acaba de ser aprovado, e esta sendo preparado para entrega!`,
            })

            await (await RabbitMQService.getInstance()).send('shipping', orderData)
            console.log(`✔ ORDER APPROVED`)
        } else {
            // LÓGICA DE REPROVAÇÃO EXISTENTE
            await (await RabbitMQService.getInstance()).send('contact', { 
                "clientFullName": orderData.name,
                "to": orderData.email,
                "subject": "Pedido Reprovado",
                "text": `${orderData.name}, seus dados não foram suficientes para realizar a compra :( por favor tente novamente!`,
            })
            console.log(`X ORDER REJECTED`)
        }
    } catch (error) {
        console.log(`X ERROR TO PROCESS: ${error.message}`)
    }
}

async function consume() {
    console.log(`SUCCESSFULLY SUBSCRIBED TO QUEUE: ${process.env.RABBITMQ_QUEUE_NAME}`)
    await (await RabbitMQService.getInstance()).consume(process.env.RABBITMQ_QUEUE_NAME, (msg) => {processMessage(msg)})
} 

consume()