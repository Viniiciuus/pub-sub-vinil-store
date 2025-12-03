const RabbitMQService = require('./rabbitmq-service')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })

// Lógica simulada de verificação de fraude
function checkFraud(fraudData) {
    const cpf = fraudData.cpf;
    const cardNumber = fraudData.creditCardNumber;

    // Simulação 1: Reprova se o CPF for o de teste '000.000.000-00'
    if (cpf === '000.000.000-00') {
        return { status: 'REPROVADO', motivo: 'CPF na lista de alto risco.' };
    }

    // Simulação 2: Reprova se o número do cartão terminar em '9999'
    if (cardNumber && cardNumber.endsWith('9999')) {
        return { status: 'REPROVADO', motivo: 'Cartão de crédito suspeito.' };
    }

    return { status: 'APROVADO', motivo: 'Nenhuma irregularidade detectada.' };
}

async function processMessage(msg) {
    const fraudData = JSON.parse(msg.content)
    try {
        const result = checkFraud(fraudData);

        // Exibe o resultado conforme solicitado
        console.log('--- Verificação de fraude ---');
        console.log(`Pedido: ${fraudData.orderId}`);
        console.log(`Status: ${result.status}`);
        console.log(`Motivo: ${result.motivo}`);
        console.log('------------------------------');

    } catch (error) {
        console.log(`X ERROR TO PROCESS: ${error.message}`)
    }
}

async function consume() {
    const queueName = 'fraud-check'
    console.log(`SUCCESSFULLY SUBSCRIBED TO QUEUE: ${queueName}`)
    // Implementação da conexão com a fila
    await (await RabbitMQService.getInstance()).consume(queueName, (msg) => {processMessage(msg)})
} 

consume()