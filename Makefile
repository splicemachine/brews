# Makefile for transpiling with Babel in a Node app, or in a client- or
# server-side shared library.

.PHONY: all clean

typescript_files := $(shell find server/ -name '*.ts')

all: node_modules $(typescript_files)
	cd client && npm run build && cp -a dist ../server/client
	cd server && npm run build

clean:
	rm -rf client/dist
	rm -rf server/client
	rm -rf server/*.map
	rm -rf server/*.js

node_modules: server/package.json
	cd server && npm install
