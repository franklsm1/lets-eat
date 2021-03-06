FROM node:14-slim
LABEL name "eat-now"

# dumb-init helps prevent zombie processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Create app directory
COPY . /app/
WORKDIR app

# Set the Google Maps API keys for the server and client (injected from Dockerhub)
ARG GOOGLE_MAPS_API_KEY
ARG REACT_APP_GOOGLE_KEY

# Build the app
RUN npm run installAll
RUN npm run build
RUN npm run testAll
ENV NODE_ENV=production
RUN npm prune --production

# Set and expose app port, default to 443
ENV PORT=${PORT:-443}
EXPOSE $PORT

# Start app
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
