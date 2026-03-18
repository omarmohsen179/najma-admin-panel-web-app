#!/bin/bash

# Test script for Unit API
# This script tests both POST (create) and PUT (update) operations
# Backend expects IFormFile (multipart/form-data), not JSON

API_URL="https://clinic-api.khalidelewa.com/api/unit"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwRTUwQUY4MS0yMjFCLTQzQTUtOURBMC1CMEYyQ0Y1QTdERDIiLCJqdGkiOiI5ZmE1MDIyMC0zNDgxLTQ1MmEtODUwOC0zNzgxZjE1OTlmYmQiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwidWlkIjoiMEU1MEFGODEtMjIxQi00M0E1LTlEQTAtQjBGMkNGNUE3REQyIiwiYWRtaW5UeXBlIjoiRmluYW5jZSIsInJvbGVzIjoiQWRtaW4iLCJleHAiOjE3Njk2ODc4MTcsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NjE5NTUiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAifQ.asPzrpP0iXnIiDe2cG55zTMQBasr-r0hvsbPfRk2pn8"

echo "=========================================="
echo "Testing Unit API - UPDATE (PUT) with FormData"
echo "=========================================="
echo ""

# Test UPDATE (PUT) - Using multipart/form-data (FormData)
# Include all fields that backend expects based on the actual data structure
curl -X PUT "$API_URL" \
  -H "accept: application/json, text/plain, */*" \
  -H "accept-encoding: gzip, deflate, br, zstd" \
  -H "accept-language: en,en-US;q=0.9" \
  -H "authorization: Bearer $TOKEN" \
  -F "Id=1" \
  -F "UnitNumber=LG-D-01" \
  -F "BuildingNumber=D" \
  -F "BUA=62.87" \
  -F "Price=13945984" \
  -F "UnitType=2" \
  -F "UnitStatus=1" \
  -F "BlockedUntil=" \
  -F "Floor=0" \
  -F "Bedrooms=0" \
  -F "Bathrooms=1" \
  -F "LivingRooms=0" \
  -F "Kitchen=0" \
  -F "Balcony=0" \
  -F "Area=62.872" \
  -F "View=null" \
  -F "Furnishing=null" \
  -F "ProjectId=1" \
  -F "LocationOnMap=51.50,62.90,53.60,68.85" \
  -F "ImageMape=0" \
  -v

echo ""
echo ""
echo "=========================================="
echo "Testing Unit API - CREATE (POST) with FormData"
echo "=========================================="
echo ""

# Test CREATE (POST) - Using multipart/form-data (FormData)
curl -X POST "$API_URL" \
  -H "accept: application/json, text/plain, */*" \
  -H "accept-encoding: gzip, deflate, br, zstd" \
  -H "accept-language: en,en-US;q=0.9" \
  -H "authorization: Bearer $TOKEN" \
  -F "Id=0" \
  -F "UnitNumber=TEST-UNIT-01" \
  -F "BuildingNumber=A" \
  -F "BUA=100.5" \
  -F "Price=1000000" \
  -F "UnitType=0" \
  -F "UnitStatus=0" \
  -F "BlockedUntil=" \
  -F "Floor=1" \
  -F "Bedrooms=0" \
  -F "Bathrooms=1" \
  -F "LivingRooms=0" \
  -F "Kitchen=0" \
  -F "Balcony=0" \
  -F "Area=100.5" \
  -F "View=null" \
  -F "Furnishing=null" \
  -F "ProjectId=1" \
  -F "LocationOnMap=" \
  -F "ImageMape=0" \
  -v

echo ""
echo ""
echo "=========================================="
echo "Test completed"
echo "=========================================="
