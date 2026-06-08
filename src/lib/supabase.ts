import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://qpekiijspwbhxqcjlobc.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImI3NzdmZTQ4LTJlZjEtNDE4Mi04ZjdjLWNjZjg3ZWVmMmJjZCJ9.eyJwcm9qZWN0SWQiOiJxcGVraWlqc3B3Ymh4cWNqbG9iYyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgwODEwNDgwLCJleHAiOjIwOTYxNzA0ODAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.x2-QF6rbq7dRz9PkXE85VPpX19geZwSlFOWRRi3AZc8';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };