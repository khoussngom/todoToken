# 📸 Guide d'Upload de Photos - Deux méthodes disponibles

## 🎯 Nouvelles options d'upload

Votre API supporte maintenant **DEUX méthodes** pour uploader des photos :

### 1. 📄 Upload JSON (Base64) - `/api/upload-photo`
**Format :** `application/json`
```json
{
  "photoData": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "folder": "todos"
}
```

### 2. 📁 Upload de Fichier (Form-data) - `/api/upload-file`
**Format :** `multipart/form-data`
- **Champ fichier :** `file` (votre fichier image)
- **Champ texte :** `folder` (optionnel, défaut: "todos")

---

## 🛠️ Configuration Postman

### Pour l'upload de fichier (ce que vous essayez) :

1. **URL :** `POST http://localhost:5200/api/upload-file`
2. **Authorization :** `Bearer YOUR_TOKEN`
3. **Body :** `form-data`
   - **Key :** `file` | **Type :** `File` | **Value :** Sélectionnez votre image
   - **Key :** `folder` | **Type :** `Text` | **Value :** `todos` (optionnel)

### Pour l'upload JSON :

1. **URL :** `POST http://localhost:5200/api/upload-photo`
2. **Authorization :** `Bearer YOUR_TOKEN`
3. **Body :** `raw` → `JSON`
   ```json
   {
     "photoData": "data:image/jpeg;base64,YOUR_BASE64_STRING",
     "folder": "todos"
   }
   ```

---

## 🧪 Test avec curl

### Upload de fichier :
```bash
curl -X POST http://localhost:5200/api/upload-file \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/your/image.jpg" \
  -F "folder=test-todos"
```

### Upload JSON :
```bash
curl -X POST http://localhost:5200/api/upload-photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "photoData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
    "folder": "todos"
  }'
```

---

## ✅ Votre solution Postman

**Changez votre URL en :** `http://localhost:5200/api/upload-file`

Gardez vos paramètres actuels :
- ✅ `form-data` 
- ✅ `file` avec votre image
- ✅ `folder` avec "todos"

---

## 📝 Réponses attendues

**Succès (200) :**
```json
{
  "success": true,
  "message": "Photo uploadée avec succès",
  "data": {
    "url": "https://res.cloudinary.com/your_cloud/image/upload/v123456/todos/photo.jpg"
  }
}
```

**Erreurs communes :**
- **400** : Fichier manquant ou format invalide
- **401** : Token manquant ou invalide  
- **500** : Configuration Cloudinary manquante

---

## 🔧 Limites

- **Taille max :** 10MB par fichier
- **Formats :** Images uniquement (jpg, png, gif, webp, etc.)
- **Quantité :** 1 fichier par requête
