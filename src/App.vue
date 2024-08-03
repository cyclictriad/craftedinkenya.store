<template>
  <router-view></router-view>
</template>


<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import SocketioService from "./services/socketio.service";
const store = useStore();
const router = useRouter();

const user = computed(() => store.getters.GET_USER)
const role = computed(() => user.value?.role);

const handleRoutes = () => {
  if (role.value === "seller") {
    router.push({ name: "seller" });
  } else if (role.value === "admin") {
    router.push({ name: "admin" });
  } else if (user.value) {
    router.push(`/users/${user.value?.fullName}/dashboard`);
  } 
  else {
    router.push({ name: "store" });
  }
};

// Watch for changes in userSessionToken
watch(role, handleRoutes);
watch(user, handleRoutes);

// On component mount, check for sessionToken in localStorage
if (localStorage.getItem("accessToken")) {
  store.dispatch("refreshToken");
}

// onMounted(()=>SocketioService.setupSocketConnection());

// onBeforeUnmount(()=>SocketioService.disconnect());
</script>


<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style>
