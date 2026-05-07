# TRUVIS DevOps base image
FROM alpine:3.19

LABEL maintainer="truvis-devops-team"
LABEL org.opencontainers.image.title="truvis-devops"
LABEL org.opencontainers.image.description="TRUVIS DevOs Team base container"

# Install common DevOps tools + Node.js for gate scripts
RUN apk add --no-cache \
    bash \
    curl \
    git \
    jq \
    nodejs \
    npm \
    openssl \
    python3 \
    py3-pip \
    wget

# Create a non-root user for running scripts
RUN addgroup -S devops && adduser -S devops -G devops

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev

COPY scripts/ ./scripts/

RUN chmod +x ./scripts/*.sh 2>/dev/null || true

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD bash /app/scripts/healthcheck.sh

USER devops

CMD ["bash"]
