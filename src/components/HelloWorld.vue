<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <p>Hola a todos soy <span style="color:red; ">Andres</span> y como estan</p>
</template>
