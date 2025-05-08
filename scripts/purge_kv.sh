#!/bin/bash

# Help function
show_help() {
    echo "Usage: ./purge_kv.sh <namespace_id>"
    echo
    echo "Note: Make sure you're logged in with 'wrangler login' first"
    exit 1
}


if [ -z "$1" ]; then
    show_help
fi

NAMESPACE_ID=$1
TEMP_FILE="keys_to_delete.json"

echo "Listing all keys from namespace: $NAMESPACE_ID"

npx wrangler kv key list --namespace-id="$NAMESPACE_ID" | \
jq -r '.[].name' | \
jq -R -s 'split("\n") | map(select(length > 0))' > "$TEMP_FILE"

# Check if we got any keys
if [ ! -s "$TEMP_FILE" ]; then
    echo "No keys found in namespace"
    rm "$TEMP_FILE"
    exit 0
fi

echo "Created list of keys to delete"
echo "Performing bulk delete..."

yes | npx wrangler kv bulk delete --namespace-id="$NAMESPACE_ID" "$TEMP_FILE" 

# Clean up
rm "$TEMP_FILE"

echo "Bulk delete complete!"