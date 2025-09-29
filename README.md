# Projet Final - By Said Assoumani CHAMSSOUDINE
# Projet Final - Application CRUD avec Supabase (Ce qu'il nous est demandé)

## Objectif
Créer une application web simple utilisant Supabase pour gérer des profils utilisateurs avec authentification et opérations CRUD.

## Technologies requises
- HTML/CSS/JavaScript
- Supabase (Backend as a Service)
- Authentification Supabase

## Structure du projet

### 1. Configuration Supabase

#### Étape 1 : Création du compte et du projet
1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL du projet et la clé API publique

#### Étape 2 : Configuration de la base de données

**Table `profiles` (obligatoire)**

Créer une table `profiles` pour stocker les informations des utilisateurs.

## Pour ma correction, la table est créée et voici les commandes pour les Policies
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text not null,
  last_name text not null,
  phone text,
  address text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);



--- policies :

--- pour la récupération
create policy "Users can select their own profile"
  on profiles for select
  using (auth.uid() = id);

--- pour la mise à jour
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);


--- pour l'ajout
create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);



### 2. Fonctionnalités à implémenter

#### Authentification (obligatoire)
- Inscription d'un nouvel utilisateur
- Connexion utilisateur
- Déconnexion utilisateur
- Gestion des sessions utilisateur

#### Opérations CRUD sur `profiles` (obligatoire)
- **Create** : Créer un profil automatiquement après inscription
- **Read** : Afficher le profil de l'utilisateur connecté
- **Update** : Permettre à l'utilisateur de modifier ses informations

#### Fonctionnalités supplémentaires
- Validation des formulaires côté client
- Messages d'erreur et de succès appropriés
- Interface utilisateur responsive
- Gestion des états de chargement




---

**Bon travail !**