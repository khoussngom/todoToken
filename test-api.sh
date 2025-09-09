#!/bin/bash

# Script de test pour les nouvelles fonctionnalités de l'API Todo
# Usage: ./test-api.sh

BASE_URL="http://localhost:5200/api"
TOKEN=""

echo "🧪 Tests des nouvelles fonctionnalités de l'API Todo"
echo "=================================================="

# Fonction pour afficher les réponses avec couleurs
print_response() {
    echo -e "\n📋 Réponse:"
    echo "$1" | jq . 2>/dev/null || echo "$1"
    echo "----------------------------------------"
}

# 1. Créer un utilisateur de test
echo "1️⃣ Création d'un utilisateur de test..."
RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123",
    "name": "Test User"
  }')
print_response "$RESPONSE"

# 2. Login pour obtenir le token
echo "2️⃣ Login pour obtenir le token..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }')
print_response "$LOGIN_RESPONSE"

# Extraire le token (si jq est disponible)
if command -v jq &> /dev/null; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token.accessToken // .accessToken // empty')
    if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
        echo "❌ Impossible d'extraire le token. Vérifiez la réponse de login."
        exit 1
    fi
    echo "✅ Token obtenu: ${TOKEN:0:20}..."
else
    echo "⚠️ jq n'est pas installé. Vous devrez extraire le token manuellement."
    echo "Copiez le token de la réponse ci-dessus et relancez ce script avec: TOKEN=your_token ./test-api.sh"
    if [ -z "$TOKEN" ]; then
        exit 1
    fi
fi

# 3. Créer une tâche de test
echo "3️⃣ Création d'une tâche de test..."
TODO_RESPONSE=$(curl -s -X POST "$BASE_URL/todo" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tâche de test avec permissions",
    "description": "Cette tâche sera utilisée pour tester les permissions",
    "userId": 1
  }')
print_response "$TODO_RESPONSE"

# Extraire l'ID de la tâche
if command -v jq &> /dev/null; then
    TODO_ID=$(echo "$TODO_RESPONSE" | jq -r '.data.id // empty')
    echo "✅ Tâche créée avec l'ID: $TODO_ID"
fi

# 4. Créer un deuxième utilisateur
echo "4️⃣ Création d'un deuxième utilisateur..."
USER2_RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user2@example.com",
    "password": "password123",
    "name": "User Two"
  }')
print_response "$USER2_RESPONSE"

# 5. Test d'attribution de permissions
if [ -n "$TODO_ID" ]; then
    echo "5️⃣ Attribution de permissions sur la tâche..."
    PERM_RESPONSE=$(curl -s -X POST "$BASE_URL/todo-permissions" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "todoId": '"$TODO_ID"',
        "userId": 2,
        "canEdit": true,
        "canDelete": false
      }')
    print_response "$PERM_RESPONSE"

    # 6. Lister les permissions de la tâche
    echo "6️⃣ Liste des permissions de la tâche..."
    GET_PERM_RESPONSE=$(curl -s -X GET "$BASE_URL/todo-permissions/$TODO_ID" \
      -H "Authorization: Bearer $TOKEN")
    print_response "$GET_PERM_RESPONSE"

    # 7. Modifier les permissions
    echo "7️⃣ Modification des permissions..."
    UPDATE_PERM_RESPONSE=$(curl -s -X PUT "$BASE_URL/todo-permissions/$TODO_ID/2" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "canEdit": false,
        "canDelete": true
      }')
    print_response "$UPDATE_PERM_RESPONSE"
fi

# 8. Test d'upload de photo (exemple avec une petite image base64)
echo "8️⃣ Test d'upload de photo..."
# Image 1x1 pixel transparent en base64
SMALL_IMAGE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

UPLOAD_RESPONSE=$(curl -s -X POST "$BASE_URL/upload-photo" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "photoData": "'"$SMALL_IMAGE"'",
    "folder": "test-todos"
  }')
print_response "$UPLOAD_RESPONSE"

# 9. Créer une tâche avec photo
if command -v jq &> /dev/null; then
    PHOTO_URL=$(echo "$UPLOAD_RESPONSE" | jq -r '.data.url // empty')
    if [ -n "$PHOTO_URL" ] && [ "$PHOTO_URL" != "null" ]; then
        echo "9️⃣ Création d'une tâche avec photo..."
        TODO_WITH_PHOTO=$(curl -s -X POST "$BASE_URL/todo" \
          -H "Authorization: Bearer $TOKEN" \
          -H "Content-Type: application/json" \
          -d '{
            "title": "Tâche avec photo",
            "description": "Cette tâche a une photo associée",
            "photoUrl": "'"$PHOTO_URL"'",
            "userId": 1
          }')
        print_response "$TODO_WITH_PHOTO"
    fi
fi

echo "🎉 Tests terminés !"
echo ""
echo "📝 Notes:"
echo "- Vérifiez que les réponses montrent des statuts 'success: true'"
echo "- Les erreurs de configuration Cloudinary sont normales si vous n'avez pas configuré les credentials"
echo "- Pour les tests complets, configurez vos variables CLOUDINARY_* dans .env"
