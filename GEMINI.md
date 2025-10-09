# Projet : TodoList App (Next.js + Prisma + Neon + Vercel)

## 🎯 Objectif
Créer une application web simple de gestion de tâches (TodoList) avec Next.js, utilisant une base de données PostgreSQL hébergée gratuitement sur Neon, et déployée sur Vercel (plan gratuit).

## ⚙️ Stack technique
- Framework : Next.js (App Router, TypeScript)
- UI : Tailwind CSS + shadcn/ui
- Base de données : Neon (PostgreSQL)
- ORM : Prisma
- Hébergement : Vercel (gratuit)
- Authentification : aucune (app personnelle)
- DB unique : une seule base utilisée pour tous les environnements (dev + prod)

## 🧱 Modèle de données

### Table Collection
- id (string, uuid)
- name (string)
- createdAt (DateTime)
- Relation : une collection contient plusieurs tâches

### Table Task
- id (string, uuid)
- name (string)
- description (string, optionnel)
- priority (enum: LOW, MEDIUM, HIGH)
- isDone (boolean, default false)
- doneAt (DateTime, optionnel)
- createdAt (DateTime)
- collectionId (string, optionnel)
- Relation : une tâche appartient à une collection (optionnel)

## ⚙️ Fonctionnalités principales

### Gestion des collections
- Créer une collection
- Modifier une collection
- Supprimer une collection
- Lister toutes les collections

### Gestion des tâches
- Créer une tâche avec :
  - Nom obligatoire
  - Description optionnelle
  - Priorité (LOW, MEDIUM, HIGH)
  - Assignation à une collection optionnelle
- Modifier une tâche
- Supprimer une tâche
- Marquer une tâche comme terminée (isDone = true, doneAt = now)

### Accueil (`/`)
- Afficher :
  - Les tâches importantes (priority = HIGH et isDone = false)
  - La liste de toutes les collections

### Page Collection (`/collections/[id]`)
- Afficher toutes les tâches d'une collection
- Pouvoir ajouter / modifier / supprimer des tâches dans cette collection

### Page Historique (`/history`)
- Afficher toutes les tâches terminées (isDone = true)
- Indiquer la date de fin (`doneAt`)
- Tri par date de fin (desc)

## 🗂️ Arborescence simplifiée
- app/
  - page.tsx → accueil
  - collections/[id]/page.tsx → détail d'une collection
  - history/page.tsx → historique
  - api/
    - tasks/
      - route.ts → POST (create), GET (list)
      - [id]/route.ts → PATCH (update), DELETE (delete)
    - collections/
      - route.ts → POST (create), GET (list)
      - [id]/route.ts → PATCH (update), DELETE (delete)
- lib/prisma.ts → client Prisma
- prisma/schema.prisma → définition du modèle
- .env → DATABASE_URL (Neon)

## 💾 Base de données
- Une seule base PostgreSQL (Neon)
- URL stockée dans `.env` et dans les variables d’environnement Vercel

## Autres considérations
Ne lance jamais le linter et ne commit jamais les changements.
Si tu dois installer des composants shadcn, utilise la commande `npx sahdcn@latest add`.