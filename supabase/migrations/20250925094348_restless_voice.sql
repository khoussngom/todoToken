/*
  # Ajout des notifications et des heures pour les todos

  1. Nouvelles Tables
    - `notifications`
      - `id` (int, primary key, auto increment)
      - `userId` (int, foreign key vers users)
      - `title` (varchar 255)
      - `message` (text)
      - `type` (enum: TODO_COMPLETED, TODO_DEADLINE, TODO_OVERDUE, TODO_REMINDER)
      - `isRead` (boolean, default false)
      - `todoId` (int, foreign key vers todos, nullable)
      - `createdAt` (timestamp, default now)
      - `updatedAt` (timestamp, auto update)

  2. Modifications Tables Existantes
    - `todos`
      - Ajout de `startTime` (datetime, nullable)
      - Ajout de `endTime` (datetime, nullable)

  3. Sécurité
    - Clés étrangères avec contraintes CASCADE
    - Index sur userId pour les notifications
    - Index sur les colonnes de temps pour les todos
*/

-- Ajout des colonnes de temps aux todos
ALTER TABLE `todos` 
ADD COLUMN `startTime` DATETIME(3) NULL,
ADD COLUMN `endTime` DATETIME(3) NULL;

-- Création de la table notifications
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `type` ENUM('TODO_COMPLETED', 'TODO_DEADLINE', 'TODO_OVERDUE', 'TODO_REMINDER') NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `todoId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `notifications_userId_idx`(`userId`),
    INDEX `notifications_todoId_idx`(`todoId`),
    INDEX `notifications_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Ajout des contraintes de clés étrangères
ALTER TABLE `notifications` 
ADD CONSTRAINT `notifications_userId_fkey` 
FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `notifications` 
ADD CONSTRAINT `notifications_todoId_fkey` 
FOREIGN KEY (`todoId`) REFERENCES `todos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Ajout d'index sur les colonnes de temps des todos
CREATE INDEX `todos_startTime_idx` ON `todos`(`startTime`);
CREATE INDEX `todos_endTime_idx` ON `todos`(`endTime`);
CREATE INDEX `todos_completed_endTime_idx` ON `todos`(`completed`, `endTime`);