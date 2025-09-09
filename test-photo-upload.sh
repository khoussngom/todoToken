#!/bin/bash

# Test rapide de l'upload de photo après correction
# Usage: ./test-photo-upload.sh YOUR_JWT_TOKEN

TOKEN=$1
BASE_URL="http://localhost:5200/api"

if [ -z "$TOKEN" ]; then
    echo "❌ Usage: ./test-photo-upload.sh YOUR_JWT_TOKEN"
    echo "Exemple: ./test-photo-upload.sh eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    exit 1
fi

echo "🧪 Test de l'upload de photo avec le format corrigé"
echo "================================================"

# Image 1x1 pixel transparent en base64
SMALL_IMAGE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

echo "📤 Envoi de la requête d'upload..."
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/upload-photo" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "photoData": "'"$SMALL_IMAGE"'",
    "folder": "test-todos"
  }')

# Séparer le code HTTP et le contenu
HTTP_CODE=$(echo "$RESPONSE" | tail -n1 | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

echo ""
echo "📋 Réponse HTTP: $HTTP_CODE"
echo "📄 Contenu:"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ Upload réussi!"
elif [ "$HTTP_CODE" -eq 400 ]; then
    echo "⚠️ Erreur de requête (400) - Vérifiez le format des données"
elif [ "$HTTP_CODE" -eq 401 ]; then
    echo "🔒 Erreur d'authentification (401) - Vérifiez votre token"
else
    echo "❌ Erreur ($HTTP_CODE)"
fi

echo ""
echo "💡 Notes:"
echo "- Si vous voyez une erreur de configuration Cloudinary, c'est normal"
echo "- Configurez vos variables CLOUDINARY_* dans .env pour les tests complets"
echo "- Le format 'photoData' est maintenant correct (au lieu de 'photo')"
