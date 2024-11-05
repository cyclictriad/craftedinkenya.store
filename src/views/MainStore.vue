<template>
  <div>
    <NavBar />
    <router-view></router-view>

    <FooterComponent />
  </div>
</template>
<script setup>
import { defineAsyncComponent, ref } from "vue";
import NavBar from "../components/NavBar.vue";
const FooterComponent = defineAsyncComponent({
  loader: () => import("../components/FooterComponent.vue"),
});
</script>
  <script>
export default {
  name: "AppClient",
};
</script>
  
  <style>
.ad-bar {
  transition: 6s all ease-in-out;
  animation: slideText infinite 18s;
}

@keyframes slideText {
  0% {
    text-align: end;
  }
  100% {
    text-align: start;
  }
}
</style>
  