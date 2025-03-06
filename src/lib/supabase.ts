
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjxctuiboknvwmtfhgxu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqeGN0dWlib2tudndtdGZoZ3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNzEwMTMsImV4cCI6MjA1Njg0NzAxM30.XqXfJmHXH0fgO-lzD8PXkkxLa97zvZ-FZtSFhkttzaQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
