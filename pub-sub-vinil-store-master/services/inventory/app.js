const RabbitMQService = require('./rabbitmq-service')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })

// Simula o estoque inicial (usando um mapa em memória)
var inventory = {
    'Pink Floyd - The Dark Side of the Moon': 100,
    'Queen - Greatest Hits': 150,
    'Nirvana - Nevermind': 80
}

async function updateInventory(products) {
    for(let product of products) {
        const name = product.name;
        const quantitySold = product.quantity || 1; 

        if (inventory[name] !== undefined) {
            inventory[name] -= quantitySold;
            
            // Exibe o resultado conforme solicitado
            console.log('--- Estoque atualizado ---');
            console.log(`Produto: ${name}`);
            console.log(`Quantidade restante: ${inventory[name]}`);
        } else {
            // Se o produto não estiver no estoque inicial, apenas exibe a venda
            console.log('--- Novo Produto Vendido ---');
            console.log(`Produto: ${name}`);
            console.log(`Estoque não rastreado. Venda de: ${quantitySold}`);
        }
    }
}

async function processMessage(msg) {
    const productsData = JSON.parse(msg.content)
    try {
        await updateInventory(productsData);
        console.log(`✔ SUCCESS: Inventory updated for ${productsData.length} items.`)
    } catch (error) {
        console.log(`X ERROR TO PROCESS: ${error.message}`)
    }
}

async function consume() {
    const queueName = 'inventory'
    console.log(`SUCCESSFULLY SUBSCRIBED TO QUEUE: ${queueName}`)
    // Implementação da conexão com a fila
    await (await RabbitMQService.getInstance()).consume(queueName, (msg) => {processMessage(msg)})
} 

consume()