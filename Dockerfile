# Inspired by
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
# https://github.com/BretFisher/node-docker-good-defaults/blob/main/Dockerfile
# https://www.rockyourcode.com/how-to-run-react-native-expo-web-in-a-docker-container/
# https://docs.docker.com/language/nodejs/

# https://hub.docker.com/_/node/
FROM node:14.17.0-buster-slim

# Pass in the host's user and group IDs
ARG USER_ID
ARG GROUP_ID

ENV NODE_ENV=development
ENV PORT=3000

# Install global npm dependencies in user home
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#global-npm-dependencies
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:${PATH}

# https://github.com/kerbe/docker-expo#usage-of-this-docker-container
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Modify `node` group and user to have the IDs `${USER_ID}` and `${GROUP_ID}`
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
RUN \
  groupmod \
    --non-unique \
    --gid ${GROUP_ID} \
    node && \
  usermod \
    --non-unique \
    --uid ${USER_ID} \
    --gid ${GROUP_ID} \
    node

# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#run
# https://github.com/krallin/tini#debian
RUN \
  apt-get update && \
  apt-get install \
    --yes \
    --no-install-recommends \
    tini \
    procps && \
  rm \
    --recursive \
    --force \
    /var/lib/apt/lists/*

# Install latest npm and expo, regardless of node version, for speed and fixes
RUN \
  npm install \
    --global \
    npm@latest \
    expo-cli@latest \
    ignite-cli@latest

# Symlink `/app` to `/home/node/app` and make both owned by `node`
RUN \
  mkdir --parents \
    /home/node/app && \
  ln --symbolic \
    /home/node/app \
    /app && \
  chown node:node \
    /home/node/app \
    /app

# Switch to directory `/app`
WORKDIR /app
# Switch to user `node`
USER node

# Install node packages
COPY \
  --chown=node:node \
  ./package.json \
  ./package-lock.json* \
  ./
COPY \
  --chown=node:node \
  ./.solidarity \
  ./
COPY \
  --chown=node:node \
  ./bin/postInstall \
  ./bin/

RUN \
  npm install \
    --no-optional && \
  npm cache clean \
    --force

# Make node executables known to shell
ENV PATH=/app/node_modules/.bin:${PATH}

# Create directory `/app/.expo` such that the corresponding volume is owned by
# the user `node`
RUN \
  mkdir ./.expo

# Port 19000 for node, 19002 for debugging, and 19006 for project
EXPOSE 19000 19002 19006
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["npm", "run", "web"]
