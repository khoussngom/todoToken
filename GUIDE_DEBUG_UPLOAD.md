# 🔍 Guide de débogage - Upload de photos

## 🎯 Problème actuel
Vous obtenez l'erreur: "Erreur lors de l'upload de la photo"

## ✅ Solutions mises en place

### 1. Nouveau service Cloudinary
- ✅ Utilise la librairie officielle Cloudinary v2
- ✅ Gestion d'erreurs améliorée
- ✅ Messages d'erreur plus détaillés

### 2. Route de test ajoutée
- 🔗 `GET /api/test-cloudinary` - Pour tester votre configuration

## 🛠️ Étapes de débogage

### Étape 1: Tester la configuration Cloudinary
```bash
# Dans Postman ou curl
GET http://localhost:5200/api/test-cloudinary
Authorization: Bearer YOUR_TOKEN
```

### Étape 2: Vérifier vos variables d'environnement
Ouvrez votre fichier `.env` et vérifiez :
```env
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

### Étape 3: Obtenir vos vraies credentials Cloudinary

1. **Allez sur** : https://cloudinary.com/
2. **Connectez-vous** ou créez un compte
3. **Dashboard** → Copiez vos credentials :
   ```
   Cloud name: xxxxxxxx
   API Key: xxxxxxxx  
   API Secret: xxxxxxxx
   ```
4. **Remplacez** dans votre `.env`

### Étape 4: Redémarrer le serveur
```bash
# Arrêtez le serveur (Ctrl+C) puis
npm run dev
```

### Étape 5: Tester l'upload
```bash
# Test avec upload-file
curl -X POST http://localhost:5200/api/upload-file \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "folder=test"
```

## 📋 Messages d'erreur possibles

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Configuration Cloudinary manquante" | Variables d'env manquantes | Configurer `.env` |
| "Format d'image invalide" | Fichier non-image | Utiliser JPG/PNG/GIF |
| "Erreur Cloudinary: Invalid API key" | Mauvais credentials | Vérifier sur cloudinary.com |
| "Erreur Cloudinary: Upload failed" | Quota dépassé | Vérifier votre plan Cloudinary |

## 🧪 Test rapide avec image simple

Si vous voulez tester rapidement, utilisez cette petite image :

**URL:** `POST http://localhost:5200/api/upload-photo`
**Body (JSON):**
```json
{
  "photoData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
  "folder": "test"
}
```

## 💡 Conseils

1. **Commencez** par le test de configuration
2. **Utilisez** des vraies credentials Cloudinary 
3. **Testez** avec une petite image d'abord
4. **Vérifiez** les logs du serveur pour plus de détails

## 🆘 Si ça ne marche toujours pas

Envoyez-moi :
1. Le résultat de `GET /api/test-cloudinary`
2. Votre fichier `.env` (masquez les secrets)
3. Les logs du serveur quand vous tentez l'upload
