<script lang="ts" setup>
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edrbtqjeycvumwhyxiyf.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcmJ0cWpleWN2dW13aHl4aXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDcxODUsImV4cCI6MjA1OTcyMzE4NX0.fmGCiFMUu5vejMrelC0h7OFAOz6RIQNC-2VfXBcn-BE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function markAsFinished(id: number) {
  const { data, error } = await supabase.from('days').update({ finished: 1 }).eq('id', id);

  console.log(data);

  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('Update successful:', data);
  }
}
</script>

<template>
  <div>
    <button @click="markAsFinished(1)">Click Day 1</button>
  </div>
</template>
