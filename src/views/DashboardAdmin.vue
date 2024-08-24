<template>
  <div class="row m-0" style="height: 100vh">
    <div
      class="side-bar bg-body-secondary"
      :class="
        isExpanded ? 'col-12 col-md-2 d-flex flex-column' : 'col-0 d-none'
      "
      style="height: inherit"
    >
      <div
        role="banner"
        class="d-flex flex-column align-items-center nav-brand my-4 w-100 justify-content-center"
      >
        <i class="bi bi-speedometer2 fs-3 text-danger me-2"></i>
        <strong class="fs-4 text-danger">{{ fullName }}</strong>
      </div>
      <nav class="w-100" role="navigation">
        <div class="nav flex-column" id="nav-tab" role="tablist">
          <router-link
            :to="`${item.path}`"
            style="text-decoration: none"
            @click="tabs.index = index"
            v-for="(item, index) in navItems"
            :key="index"
            class="my-2 w-100 text-center text-md-start mx-0 text-wrap m-1"
            :class="[
              'nav-link',
              { disabled: index && !hasShop  },
              { 'fw-bolder text-danger': tabs.index === index },
            ]"
            :aria-selected="tabs.index === index"
          >
            <i class="bi px-1" :class="item.icon"></i>
            <span>{{ item.label  }}  <small v-if="item.icon === 'bi-chat-square'">({{newMessagesCount}})</small></span>
          </router-link>
          <button @click="logout" class="nav-link fw-bolder mt-5 text-danger">
            <span>Log Out </span>
            <i class="bi bi-door-open-fill"></i>
          </button>
        </div>
      </nav>
    </div>
    <button
      class="btn position-absolute top-0 fw-bolder fs-4 border-0"
      style="width: auto; z-index: 10000"
      @click="isExpanded = !isExpanded"
      :aria-expanded="isExpanded"
      :aria-controls="activeTab"
    >
      <i class="bi bi-window-sidebar"></i>
    </button>
    <div
      role="main"
      class="p-3"
      :class="
        isExpanded
          ? 'd-none d-md-block col-md-10'
          : ' d-block col-12 fit-content'
      "
      :id="activeTab"
    >
      <router-view></router-view>
    </div>
  </div>
</template>


<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const chat = computed(()=>store.getters.GET_CHAT);
const hasShop = computed(() => store.getters.GET_USER?.shops?.length);
const tabs = ref({
  index: 0,
});
const newMessagesCount = computed(() => store.getters.GET_UNREAD.filter(message => message.from === 'self').length);
const isExpanded = ref(true);
const navItems = ref([
  {
    label: "My Shop",
    icon: "bi-shop",
    path: "shop",
  },
  {
    label: "Manage Categories",
    icon: "bi-grid",
    path: "categories",
  },
  {
    label: "Manage Products",
    icon: "bi-box",
    path: "products",
  },
  {
    label: "All Orders",
    icon: "bi-bag",
    path: "orders",
  },
  {
    label: "Analytics",
    icon: "bi-bar-chart",
    path: "analytics",
  },
  {
    label: "Return Orders",
    icon: "bi-arrow-counterclockwise",
    path: "return-orders",
  },
  {
    label: `Inbox`,
    icon: "bi-chat-square",
    path: "inbox",
  },
  {
    label: "Store Manager",
    icon: "bi-tools",
    path: "store-manager",
  },
]);
const activeTab = ref(navItems.value[tabs.value.index].label);
const fullName = computed(() => store.getters.GET_USER?.fullName);
const logout = () => {
  store.dispatch("logout");
};

store.dispatch('startService')

// });
onBeforeUnmount(() => service.value.disconnect());
</script>


<style scoped>
.grey {
  background-color: #e1e1e1;
}
.start-25 {
  left: calc(16.6% - 42px);
}
.start-0 {
  left: 0;
}
.fit-content {
  min-width: fit-content;
}
.top-50 {
  top: calc(50vh - 30px);
}

.row > div {
  overflow-y: scroll;
  scrollbar-width: none;
  height: inherit;
}
.nav-link {
  transition: color 500ms ease;
}
</style>
