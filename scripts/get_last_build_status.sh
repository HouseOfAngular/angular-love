#!/bin/bash

while getopts "a:p:t:" opt; do
 case $opt in
   a) ACCOUNT_ID="$OPTARG";;
   p) PROJECT_NAME="$OPTARG";;
   t) API_TOKEN="$OPTARG";;
   \?) echo "Invalid option -$OPTARG" >&2; exit 1;;
 esac
done

if [ -z "$ACCOUNT_ID" ] || [ -z "$PROJECT_NAME" ] || [ -z "$API_TOKEN" ]; then
   echo "Usage: $0 -a ACCOUNT_ID -p PROJECT_NAME -t API_TOKEN"
   exit 1
fi

get_latest_status() {
   response=$(curl -s -X GET \
       "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments" \
       -H "Authorization: Bearer ${API_TOKEN}" \
       -H "Content-Type: application/json")

   if [ "$(echo "$response" | jq -r '.success')" != "true" ]; then
       echo "Error: $(echo "$response" | jq -r '.errors[0].message')"
       exit 1
   fi

   echo "$response" | jq -r '.result[] | select(.environment == "production") | .latest_stage.status' | head -n1
}


if ! command -v jq &> /dev/null; then
   echo "Error: jq is required but not installed. Please install it first."
   exit 1
fi

# Get and display status
status=$(get_latest_status)
echo "$status"