# Serviço de Inventário (inventory-service)

Este serviço é responsável por atualizar o estoque da loja.

## Fluxo
1. Consome mensagens da fila `inventory`, publicadas pelo `shipping-service` após a entrega do produto.
2. Simula a remoção da quantidade vendida do estoque (mapa em memória).

## Payload Esperado (Exemplo)
O serviço espera uma lista de produtos vendidos:

```json
[
    {
        "name": "NOME_DO_PRODUTO",
        "quantity": 1
    },
    {
        "name": "OUTRO_NOME_DO_PRODUTO",
        "quantity": 1
    }
]