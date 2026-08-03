#!/usr/bin/env bash
set -e

pip install -r requirements.txt

# Fetch Prisma engine binaries
python -m prisma py fetch

# Debug: List what was actually downloaded
CACHE_DIR="/opt/render/.cache/prisma-python/binaries"
echo "==> Prisma binary cache contents:"
find "$CACHE_DIR" -type f 2>/dev/null | head -30 || echo "Cache dir not found"

# Find any query engine binary and copy to working directory
echo "==> Searching for query engine binaries..."
find "$CACHE_DIR" -type f \( -name "prisma-query-engine-*" -o -name "query-engine-*" -o -name "*query*engine*" \) 2>/dev/null | while read -r engine; do
    echo "==> Found engine: $engine"
    chmod +x "$engine"
    cp "$engine" /opt/render/project/src/apps/api/
    echo "==> Copied to apps/api/"
done

# Also check node_modules for the engine
NODE_ENGINE=$(find /opt/render/project/src -path "*/prisma/query-engine-*" -type f 2>/dev/null | head -1)
if [ -n "$NODE_ENGINE" ]; then
    echo "==> Found Node engine: $NODE_ENGINE"
    chmod +x "$NODE_ENGINE"
    BASENAME=$(basename "$NODE_ENGINE")
    cp "$NODE_ENGINE" "/opt/render/project/src/apps/api/prisma-${BASENAME}"
    echo "==> Copied Node engine to apps/api/"
fi

# List what's in apps/api after copy
echo "==> apps/api directory (engine files):"
ls -la /opt/render/project/src/apps/api/prisma-* 2>/dev/null || echo "No engine files found in apps/api"
ls -la /opt/render/project/src/apps/api/query-* 2>/dev/null || echo "No query-engine files found in apps/api"

# Generate Prisma client
python -m prisma generate --schema=../../database/prisma/schema.prisma

echo "==> Render build complete"
