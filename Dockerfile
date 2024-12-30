# syntax = docker/dockerfile:1

##################################################
# 1. Builder stage
##################################################
ARG BUN_VERSION=1.0.21
FROM oven/bun:${BUN_VERSION}-slim AS builder

# Install extra OS packages if needed
RUN apt-get update && apt-get install -y \
	python3 \
	make \
	g++

# Create a working dir
WORKDIR /app

# We'll pick which app to build with this ARG
ARG PROJECT

# Copy the entire repo (except node_modules, thanks to .dockerignore)
COPY . .

# Install dependencies with Bun
# - This will install all workspaces (apps/*, packages/*)
RUN bun install

# Build only the specified app (and its dependencies) via Turborepo
RUN bun x turbo run build -- --filter=${PROJECT}

##################################################
# 2. Runner stage
##################################################
FROM oven/bun:${BUN_VERSION}-slim AS runner

WORKDIR /app

ARG PROJECT

# Copy the entire monorepo from builder
# (Alternatively, copy only what's needed, but let's keep it simple.)
COPY --from=builder /app ./

# Switch to the final app folder
WORKDIR /app/apps/${PROJECT}

# Expose your desired port
EXPOSE 3000

# Start the app. If your package.json has "start":
CMD ["bun", "run", "start"]
