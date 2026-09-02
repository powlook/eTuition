#!/usr/bin/env bash
# Devcontainer setup: dependencies and environment setup for eTuition Portal.
set -euo pipefail

echo "Updating system packages and installing Chromium for testing..."
sudo apt-get update
sudo apt-get install -y chromium

echo "Verifying Node.js and environment..."
node --version
npm --version

echo "Setup complete."
