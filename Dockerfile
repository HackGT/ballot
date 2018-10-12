FROM node:10-alpine

# Bundle Source
RUN mkdir -p /usr/src/ballot
WORKDIR /usr/src/ballot
COPY . /usr/src/ballot
RUN npm install --unsafe-perm

# Set Timezone to EST
RUN apk add tzdata
ENV TZ="/usr/share/zoneinfo/America/New_York"

FROM node:10-alpine
COPY --from=0 /usr/src/ballot/server/ /usr/src/ballot/server/
WORKDIR /usr/src/ballot
EXPOSE 3000
CMD ["node", "server/build/app.js"]