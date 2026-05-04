// Online database communication helpers.
import { createClient } from "@supabase/supabase-js";

console.log("Connecting online database ");
const SUP_BASE = createClient(
  "https://wlqxcdaltppgktbzbkru.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndscXhjZGFsdHBwZ2t0Ynpia3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5OTEzMDgsImV4cCI6MjA4NjU2NzMwOH0.y-CKVPrmgQlwd2vQ6PsfOfzhO4lCvrZj5ur9d4xZZFQ",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);

export { SUP_BASE };