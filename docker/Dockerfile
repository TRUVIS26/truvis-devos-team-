# TRUVIS DevOps base image
FROM alpine:3.19

LABEL maintainer="truvis-devops-team"
LABEL org.opencontainers.image.title="truvis-devops"
LABEL org.opencontainers.image.description="TRUVIS DevOps base container"

# Install common DevOps tools
RUN apk add --no-cache \
    bash \
    curl \
    git \
    jq \
    openssl \
    python3 \
    py3-pip \
    wget

# Create a non-root user for running scripts
RUN addgroup -S devops && adduser -S devops -G devops

WORKDIR /app

COPY scripts/ ./scripts/

RUN chmod +x ./scripts/*.sh 2>/dev/null || true

USER devops

CMD ["bash"]
