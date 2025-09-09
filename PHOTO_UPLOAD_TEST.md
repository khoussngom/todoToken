# Exemple de test pour l'upload de photo

## Requête correcte

**Endpoint:** `POST http://localhost:5200/api/upload-photo`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "photoData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
  "folder": "todos"
}
```

## Test avec curl

```bash
# Remplacez YOUR_TOKEN par votre token JWT valide
curl -X POST http://localhost:5200/api/upload-photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "photoData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
    "folder": "test-todos"
  }'
```

## Réponse attendue

**Succès (200):**
```json
{
  "success": true,
  "message": "Photo uploadée avec succès",
  "data": {
    "url": "https://res.cloudinary.com/your_cloud/image/upload/v123456789/todos/abc123.png"
  }
}
```

**Erreur de configuration Cloudinary (400):**
```json
{
  "success": false,
  "error": "Configuration Cloudinary manquante. Vérifiez vos variables d'environnement."
}
```

## Notes

1. **photoData** doit être une chaîne base64 valide commençant par `data:image/`
2. **folder** est optionnel, par défaut "todos"
3. Un token JWT valide est requis dans l'en-tête Authorization
4. Les variables d'environnement Cloudinary doivent être configurées

## Variables d'environnement requises

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
