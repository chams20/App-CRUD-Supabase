/**
 * Fichier pour appeler Supabase
 */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_KEY = 'Mettez votre clé'
const supabaseUrl = 'votre_url_Supabasey'
const supabaseKey = SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey)