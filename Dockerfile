# Inspired by
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
# https://github.com/BretFisher/node-docker-good-defaults/blob/main/Dockerfile
# https://www.rockyourcode.com/how-to-run-react-native-expo-web-in-a-docker-container/
# https://docs.docker.com/language/nodejs/

# https://hub.docker.com/_/node/
FROM node:14.17.0-buster-slim

# Pass in the host's user and group IDs. They are used as user and group for
# directories and files being created. They should also be used through the
# `--user` option when starting containers based on this image. Then,
# directories and files created within image and container have the proper user
# and group on the host and vice versa.
ARG USER_ID
ARG GROUP_ID

# Set node environment to `development`.
ENV NODE_ENV=development

# Make expo listen to all addresses inside the container. For details see
# https://github.com/kerbe/docker-expo#usage-of-this-docker-container
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Modify `node` user and group to have the IDs `${USER_ID}` and `${GROUP_ID}`
# and make `node` the primary group of user `node`. For details on this best
# practice see
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

# Install
# * `tini`, a tiny but valid `init` for containers, see
#   https://github.com/krallin/tini#debian
# * `procps`, utilities to browse information in the proc filesystem, in
#   particular, `pkill` that is somewhere used deep within `./bin/postInstall`,
#   see
#   https://gitlab.com/procps-ng/procps
#
# For best practices on using `apt-get` see
# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#run
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

# Symlink `/app` to `/home/node/app` and make both owned by `node`.
RUN \
  mkdir --parents \
    /home/node/app && \
  ln --symbolic \
    /home/node/app \
    /app && \
  chown node:node \
    /home/node/app \
    /app

# Set working directory to `/app`.
WORKDIR /app
# Set user and group to `node`.
USER node:node

# Place global node dependencies in home of `node` user. For details on this
# best practice see
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#global-npm-dependencies
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:${PATH}

# Install latest npm, expo, and ignite command-line interfaces, regardless of
# node version, for speed and fixes.
RUN \
  npm install \
    --global \
    npm@latest \
    expo-cli@latest \
    ignite-cli@latest

# Make local node executables known to shell.
ENV PATH=/app/node_modules/.bin:${PATH}

# Install local node dependencies.
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

# Create directory `/app/.expo` such that the corresponding volume is owned by
# the user `node`.
RUN \
  mkdir ./.expo

# Expose port 19000 for node, 19002 for debugging, and 19006 for project.
EXPOSE 19000 19002 19006
# Use entrypoint `tini`.
ENTRYPOINT ["/usr/bin/tini", "--"]
