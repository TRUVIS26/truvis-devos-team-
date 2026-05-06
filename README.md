# TRUVIS DevOps Team

Welcome to the **TRUVIS DevOps Team** repository. This repo contains CI/CD workflows, infrastructure configurations, and tooling used by the TRUVIS DevOps team.

## Overview

The TRUVIS DevOps team is responsible for:

- **CI/CD Pipelines** – Automated build, test, and deployment workflows using GitHub Actions
- **Infrastructure as Code** – Managing cloud infrastructure with reproducible configurations
- **Containerization** – Docker images and container orchestration
- **Monitoring & Observability** – Logging, metrics, and alerting strategies
- **Security & Compliance** – Secrets management, vulnerability scanning, and policy enforcement

## Repository Structure

```
.
├── .github/
│   └── workflows/       # GitHub Actions CI/CD workflow definitions
├── docker/              # Dockerfile(s) and Docker Compose configurations
├── scripts/             # Utility and automation scripts
└── README.md
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) ≥ 20.10
- [Git](https://git-scm.com/) ≥ 2.30

### Running Locally

```bash
# Clone the repository
git clone https://github.com/truvis25/truvis-devos-team-.git
cd truvis-devos-team-

# Build the Docker image
docker build -t truvis-devops -f docker/Dockerfile .

# Run the container
docker run --rm truvis-devops
```

## CI/CD

All pull requests trigger the [CI workflow](.github/workflows/ci.yml), which:

1. Lints and validates configuration files
2. Builds the Docker image
3. Runs automated tests
4. Reports status back to the PR

## Contributing

1. Create a feature branch from `main`
2. Make your changes and ensure CI passes
3. Open a pull request for review
4. A team member will review and merge

## Team

| Role | Responsibility |
|------|----------------|
| DevOps Engineers | Pipeline design, infra automation |
| Platform Engineers | Container orchestration, cloud infra |
| Security Engineers | Vulnerability management, secrets rotation |

## License

Internal use only. © TRUVIS 2025.
