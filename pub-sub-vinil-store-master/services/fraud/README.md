# Serviço de Verificação de Fraude (fraud-service)

Este serviço é responsável por realizar a verificação assíncrona de um pedido antes da aprovação final.

## Fluxo
1. Consome mensagens da fila `fraud-check`, publicadas pelo `order-service` após a validação inicial do pedido.
2. Simula a verificação de fraude e exibe o resultado no terminal.

## Payload Esperado (Exemplo)
O serviço espera dados essenciais para a verificação:

```json
{
    "orderId": 123456,
    "cpf": "123.456.789-00",
    "creditCardNumber": "1111222233334444"
}