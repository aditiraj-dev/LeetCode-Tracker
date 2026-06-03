import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yiqvfgvrydtumrkjzkph.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcXZmZ3ZyeWR0dW1ya2p6a3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MjAzNTksImV4cCI6MjA5NTI5NjM1OX0.W3QuqHq1-pU7H24zrmHR3Q7IZ68vZXUaI_Sd2vhGw9I';

export const supabase = createClient(supabaseUrl, supabaseKey);
