#!/bin/bash

# Base URL
API_URL="http://localhost:8080/api/v1"

echo "Waiting for server to be ready..."
sleep 5

# 1. Register a User
echo "1. Registering a new user..."
RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo_user_'$(date +%s)'@example.com",
    "password": "password123",
    "first_name": "Demo",
    "last_name": "User"
  }')

# Extract Token (using grep/sed because jq might not be installed)
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Error: Failed to register or get token."
  echo "Response: $RESPONSE"
  exit 1
fi

echo "Success! Got Token: ${TOKEN:0:20}..."

# 2. Create a dummy file
echo "2. Creating a dummy file to upload..."
echo "This is a test resource content" > test_resource.xls

# 3. Upload Resource
echo "3. Uploading resource..."
UPLOAD_RESPONSE=$(curl -s -X POST "$API_URL/resources" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test_resource.xls" \
  -F "title=Distributed Systems Notes" \
  -F "description=Notes for the final exam" \
  -F "type=notes" \
  -F "sharing_level=public")

echo "Upload Response: $UPLOAD_RESPONSE"

# 4. Cleanup
rm test_resource.xls

echo ""
echo "---------------------------------------------------"
echo "✅ Demo Action Complete!"
echo "---------------------------------------------------"
echo "Now, check your terminal logs where 'docker-compose up' is running."
echo "You should see:"
echo "1. [NOTIFICATION] New Resource Created! Sending email..."
echo "2. [ANALYTICS] Event received. Total resources created..."
echo "---------------------------------------------------"
