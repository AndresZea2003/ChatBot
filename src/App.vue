<script setup>
import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'

const api = () => {
  let response = axios.get('http://localhost:5173/api/students')
  console.log(response)
}


</script>

<template>
  <div class="h-screen w-screen">
    <HelloWorld msg="Vite + Vue" />
  </div>
</template>
