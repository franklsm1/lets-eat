FROM node:12-slim
LABEL name "eat-now"

# dumb-init helps prevent zombie processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Create app directory
COPY . /app/
WORKDIR app

# Build the app
ENV NODE_ENV=production
RUN npm install
RUN npm run build

# Set and expose app port, default to 443
ENV PORT=${PORT:-443}
EXPOSE $PORT

# Start app
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]