# API Todo avec Système de Permissions et Upload de Photos

## Nouvelles Fonctionnalités

### 1. Système de Permissions sur les Tâches

Le propriétaire d'une tâche peut maintenant attribuer des permissions à d'autres utilisateurs :
- **Permission d'édition** (`canEdit`) : permet à l'utilisateur de modifier la tâche
- **Permission de suppression** (`canDelete`) : permet à l'utilisateur de supprimer la tâche

#### Endpoints des Permissions

**Attribuer une permission**
```
POST /api/todo-permissions
Authorization: Bearer <token>
Content-Type: application/json

{
    "todoId": 1,
    "userId": 2,
    "canEdit": true,
    "canDelete": false
}
```

**Modifier une permission existante**
```
PUT /api/todo-permissions/:todoId/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
    "canEdit": false,
    "canDelete": true
}
```

**Révoquer une permission**
```
DELETE /api/todo-permissions/:todoId/:userId
Authorization: Bearer <token>
```

**Obtenir toutes les permissions d'une tâche**
```
GET /api/todo-permissions/:todoId
Authorization: Bearer <token>
```

### 2. Upload de Photos pour les Tâches

Les tâches peuvent maintenant inclure une photo stockée sur Cloudinary.

#### Configuration Cloudinary

Ajoutez ces variables d'environnement à votre fichier `.env` :

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Endpoints des Photos

**Uploader une photo**
```
POST /api/upload-photo
Authorization: Bearer <token>
Content-Type: application/json

{
    "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIA...",
    "folder": "todos"
}
```

**Supprimer une photo**
```
DELETE /api/delete-photo
Authorization: Bearer <token>
Content-Type: application/json

{
    "photoUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/todos/abc123.jpg"
}
```

#### Intégration avec les Tâches

Lors de la création ou modification d'une tâche, vous pouvez maintenant inclure une `photoUrl` :

```
POST /api/todo
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Ma tâche avec photo",
    "description": "Description de la tâche",
    "photoUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/todos/abc123.jpg",
    "userId": 1
}
```

## Flux de Travail Recommandé

### Pour ajouter une photo à une tâche :

1. **Uploader la photo** vers Cloudinary :
   ```
   POST /api/upload-photo
   ```
   
2. **Récupérer l'URL** de la réponse
   
3. **Créer ou modifier la tâche** avec l'URL de la photo :
   ```
   POST /api/todo (ou PUT /api/todo/:id)
   ```

### Pour partager une tâche avec permissions :

1. **Créer une tâche** (seul le propriétaire peut le faire)
   
2. **Attribuer des permissions** à un autre utilisateur :
   ```
   POST /api/todo-permissions
   ```
   
3. **L'utilisateur autorisé** peut maintenant modifier/supprimer selon ses permissions

## Structure de la Base de Données

### Nouveau modèle : TodoPermission

```prisma
model TodoPermission {
  id         Int      @id @default(autoincrement())
  todoId     Int
  userId     Int
  canEdit    Boolean  @default(false)
  canDelete  Boolean  @default(false)
  createdAt  DateTime @default(now())
  
  todo       Todo     @relation(fields: [todoId], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([todoId, userId])
  @@map("todo_permissions")
}
```

### Modification du modèle Todo

```prisma
model Todo {
  id          Int      @id @default(autoincrement())
  title       String   @db.VarChar(255)
  description String?  @db.Text
  completed   Boolean  @default(false)
  photoUrl    String?  @db.Text  // Nouveau champ
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      Int      @db.Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  permissions TodoPermission[]  // Nouvelle relation

  @@map("todos")
}
```

## Migration de la Base de Données

Après avoir modifié le schéma Prisma, exécutez :

```bash
npx prisma generate
npx prisma db push
```

## Authentification

Toutes les nouvelles routes nécessitent une authentification Bearer Token. Assurez-vous d'inclure le header :

```
Authorization: Bearer <your_jwt_token>
```

## Codes de Statut HTTP

- **200** : Succès
- **201** : Créé avec succès
- **400** : Erreur de validation
- **401** : Non authentifié
- **403** : Permission refusée
- **404** : Ressource non trouvée
- **500** : Erreur serveur

## Exemples d'Utilisation

### Workflow complet : Créer une tâche avec photo et permissions

1. **Se connecter**
```bash
curl -X POST http://localhost:5200/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

2. **Uploader une photo**
```bash
curl -X POST http://localhost:5200/api/upload-photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"photo": "data:image/jpeg;base64,..."}'
```

3. **Créer une tâche avec la photo**
```bash
curl -X POST http://localhost:5200/api/todo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Ma tâche", "description": "Description", "photoUrl": "CLOUDINARY_URL", "userId": 1}'
```

4. **Attribuer des permissions**
```bash
curl -X POST http://localhost:5200/api/todo-permissions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"todoId": 1, "userId": 2, "canEdit": true, "canDelete": false}'
```
