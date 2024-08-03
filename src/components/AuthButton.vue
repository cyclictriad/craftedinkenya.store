<template>
  <router-link :to="loggedIn ?  `/users/${fullName}/dashboard`:`/auth` " class="nav-link mx-2  mx-lg-1" :class="{'text-danger': loggedIn}"><i class="bi bi-person-fill"></i></router-link>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const loggedIn = computed(()=>store.getters.GET_USER);
const fullName = computed(()=>loggedIn.value?.fullName);
</script>



