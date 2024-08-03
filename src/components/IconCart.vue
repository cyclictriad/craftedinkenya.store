<template>
  <a
    class="nav-link  mx-2 mx-lg-1"
    :class="{'disabled': !itemCount}"
    :disabled="!itemCount"
    :aria-disabled="!itemCount"
    aria-haspopup="true"
    aria-controls="checkOut"
    data-bs-toggle="modal"
    data-bs-target="#checkOut"
  >
    <i class="bi bi-cart3 position-relative">
      <span
        class="position-absolute top-0 start-50 translate-middle badge text-dark rounded-pill py-0.5 px-1"
        style="font-size: 12px;">{{ itemCount }}</span
      >
    </i>
    <span class="visually-hidden">Item count</span>
  </a>
</template>

<script setup>
import {ref} from 'vue'
import {useStore} from 'vuex';
const store = useStore()
const itemCount = ref(store.getters.itemCount)
</script>
