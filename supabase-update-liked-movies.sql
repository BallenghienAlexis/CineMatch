-- ============================================================================
-- UPDATE SCHEMA: Add poster_path to liked_movies table
-- ============================================================================
-- Exécuter dans Supabase SQL Editor
-- ============================================================================

-- Ajouter la colonne poster_path si elle n'existe pas
ALTER TABLE liked_movies
ADD COLUMN IF NOT EXISTS poster_path text;

-- ============================================================================
-- ✅ FIN
-- ============================================================================
-- Après exécution, le code React pourra sauver et afficher les affiches des films

