# Inspired by https://www.olioapps.com/blog/the-lost-art-of-the-makefile/

# https://unix.stackexchange.com/questions/8518/how-to-get-my-own-ip-address-and-save-it-to-a-variable-in-a-shell-script/8521#8521
# https://unix.stackexchange.com/questions/8518/how-to-get-my-own-ip-address-and-save-it-to-a-variable-in-a-shell-script/8521#comment1135415_84263
HOST_IP_ADDRESS = $(shell ip -4 --oneline address list $$(ip route list | grep default | awk '{print $$5}') | awk '{print $$4}' | cut --delimiter / --fields 1 | head --lines 1)

# https://www.client9.com/self-documenting-makefiles/
help: ## Print documentation
	 @awk -F ':|##' '/^[^\t].+?:.*?##/ { \
		printf "\033[36m%-30s\033[0m %s\n", $$1, $$NF \
	}' $(MAKEFILE_LIST)
.DEFAULT_GOAL: help
.PHONY: help

# ----------------------------- #
#                               #
# ----------------------------- #

tmux: ## Load tmux(p) workspace
	tmuxp load .
.PHONY: tmux

ip: ## Print host IP address
	@echo ${HOST_IP_ADDRESS}
.PHONY: ip

# ----------------------------- #
# Interface with Docker Compose #
# ----------------------------- #

build: ## Build services
	HOST_IP_ADDRESS=${HOST_IP_ADDRESS} \
		docker-compose build \
			--build-arg USER_ID=$(shell id --user) \
			--build-arg GROUP_ID=$(shell id --group)
.PHONY: build

up: ## Start services
	HOST_IP_ADDRESS=${HOST_IP_ADDRESS} \
		docker-compose up \
			--detach
.PHONY: up

logs: ## Follow logs
	HOST_IP_ADDRESS=${HOST_IP_ADDRESS} \
		docker-compose logs \
			--follow
.PHONY: logs

restart: ## Restart services
	HOST_IP_ADDRESS=${HOST_IP_ADDRESS} \
		docker-compose restart
.PHONY: restart

down: ## Stop services
	HOST_IP_ADDRESS=${HOST_IP_ADDRESS} \
		docker-compose down \
			--remove-orphans
.PHONY: down

exec: ## Execute command `${COMMAND}` within running service `node`
	HOST_IP_ADDRESS=${HOST_IP_ADDRESS} \
		docker-compose exec \
			--user $(shell id --user):$(shell id --group) \
			node \
			${COMMAND}
.PHONY: exec

shell: COMMAND=bash
shell: exec ## Enter shell in running service `node`
.PHONY: shell

run: ## Run command `${COMMAND}` within fresh service `node`
	HOST_IP_ADDRESS=${HOST_IP_ADDRESS} \
		docker-compose run \
			--user $(shell id --user):$(shell id --group) \
			node \
			${COMMAND}
.PHONY: run

# ------------------------------- #
# In shell running service `node` #
# ------------------------------- #

usb: ## Connect to and list USB devices
	adb -a -d devices
.PHONY: usb

install: ## Install packages as specified in `yarn.lock`
	yarn install --pure-lockfile
.PHONY: install

upgrade: ## Upgrade packages to their latest version based on the specified range in `package.json`
	yarn upgrade
.PHONY: upgrade

expo: ## Update packages known by expo to compatible versions possibly changing `package.json`
	npx expo update
.PHONY: expo

outdated: ## List outdated packages
	yarn outdated
.PHONY: outdated

android: ## Run app on android
	yarn run android
.PHONY: android

ios: ## Run app on iOS
	yarn run ios
.PHONY: ios

publish: ## Publish app to expo
	npx eas update
