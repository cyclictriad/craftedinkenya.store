<template>
  <div>
    <ul class="users">
      <li
        style="position: relative; text-align: center"
        v-for="(client, index) in clients"
        :key="index"
        :style="{marginLeft:`${index ? 50 : 0}px`, marginRight:`${index +1 !== clients.length ? 50 : 0}px`}"
      >
        <span style="position: absolute; bottom: -20px; " :style="{left:`-${client.name.length*3.5}px`}">{{ client.name }}</span>
      </li>
    </ul>

    <chat-body v-if="chat" :isClient="false"></chat-body>
  </div>
</template>
  
<script setup>
import { defineAsyncComponent, computed } from "vue";
import { useStore } from "vuex";
const chatBody = defineAsyncComponent({
  loader: () => import(`../components/ChatBody.vue`),
});
const store = useStore();

const clients = computed(() => store.getters.GET_CLIENTS);
const chat = computed(() => store.getters.GET_CHAT);
</script>
    
<style>
.users {
  margin-top:0px;
  margin-bottom:20px;
  display: flex;
  background-color: blue;
  height: 6px;
  width: 100%;
  list-style-type: none;
  align-items: center;
  padding:0;
}
.users li {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background-color: green;
}
</style>