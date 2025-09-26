/**
 * Fichier pour appeler Supabase
 */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXZwdmRmeXpjdmRyZWRuYm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI4NTIsImV4cCI6MjA3NDQ0ODg1Mn0.9g41exSxhUXMbuNLZkPO50oAofj-Dwjyvokrv-JF_bU'
const supabaseUrl = 'https://bpuvpvdfyzcvdrednbnm.supabase.co'
const supabaseKey = SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey)