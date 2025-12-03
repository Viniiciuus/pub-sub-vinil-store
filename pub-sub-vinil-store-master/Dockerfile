FROM node:14.16.1-alpine3.10 AS base
WORKDIR /var/www/

FROM base AS contact-service
ADD  services/contact/ .
RUN npm install --only=production 
CMD [ "node", "app.js" ]

FROM base AS order-service
ADD  services/order/ .
RUN npm install --only=production 
CMD [ "node", "app.js" ]

FROM base AS shipping-service
ADD  services/shipping/ .
RUN npm install --only=production 
CMD [ "node", "app.js" ]

# NOVO: Estágio para o serviço de fraude
FROM base AS fraud-service
ADD  services/fraud/ .
RUN npm install --only=production 
CMD [ "node", "app.js" ]

# NOVO: Estágio para o serviço de inventário
FROM base AS inventory-service
ADD  services/inventory/ .
RUN npm install --only=production 
CMD [ "node", "app.js" ]