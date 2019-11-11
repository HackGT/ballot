FROM node:12.4-alpine

# Bundle Source
RUN mkdir -p /usr/src/ballot
WORKDIR /usr/src/ballot
COPY . /usr/src/ballot
RUN npm install --unsafe-perm

FROM node:10-alpine
COPY --from=0 /usr/src/ballot/server/ /usr/src/ballot/server/
COPY --from=0 /usr/src/ballot/client/ /usr/src/ballot/client/
WORKDIR /usr/src/ballot
EXPOSE 3000
CMD ["node", "server/build/app.js"]