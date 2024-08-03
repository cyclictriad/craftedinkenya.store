<template>
  <div
    v-if="ad"
    class="ad-bar bg-dark text-light w-100 fw-bolder"
    :innerHTML="ad"
  ></div>
  <NavBar />
  <router-view></router-view>

  <!-- <Question/> -->
  <FooterComponent />
</template>
<script setup>
import { defineAsyncComponent, ref } from "vue";
import NavBar from '../components/NavBar.vue'
const FooterComponent = defineAsyncComponent({
  loader:()=> import("../components/FooterComponent.vue"),
})
const ad = ref(null)


</script>
  <script>
export default {
  name: "AppClient",
};
</script>
  
  <style>
.ad-bar {
  transition: 6s all ease-in-out ;
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
  