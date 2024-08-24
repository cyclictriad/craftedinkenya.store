<template>
  <div v-if="!chat" class="row bg-dark" style="opacity: 0.8; height: 100vh">
    <div
      v-if="requireName"
      class="rounded-4 col-11 col-md-6 m-auto bg-light popup p-5"
    >
      <h6 class="fw-bolder mb-3">We'd love to give you professional help</h6>
      <form @submit.prevent="setName">
        <div class="mb-2">
          <input
            v-model="name"
            id="name"
            type="text"
            class="form-control"
            placeholder="Enter your name to proceed..."
            aria-placeholder="Enter your name to proceed to chat"
            required
            aria-required="true"
          />
        </div>
        <button class="btn btn-primary px-2 rounded-0">Proceed</button>
      </form>
    </div>
    <div
      v-if="joinedWaitingRoom"
      class="rounded-4 col-11 col-md-6 m-auto bg-light py-2 px-5"
    >
      <div class="m-2">
        <h5 class="other-text">YOU ARE NOW IN WAITING ROOM</h5>
        <p class="text-end">
          Number on queue | <strong>{{ 0 }}</strong>
        </p>
        <p class="text-muted">
          Don't understand why this happened click
          <strong
            href="javascript:void(0)"
            class="toggle"
            data-bs-toggle="collapse"
            data-bs-target="#waiting-collapse"
            >here</strong
          >
        </p>
      </div>
      <div id="waiting-collapse" class="collapse mx-1">
        <p>
          Dear esteemed customer our customer service is based on sessions, to
          offer bespoke service to our esteemed customers.
        </p>
        <p>Our agents are available right now but they are engaged for now.</p>
        <p>We'll get back to you soon.</p>
        <p>You are now in waiting room</p>
      </div>
    </div>
    <div
      v-if="notAvailable"
      class="popup rounded-4 col-11 col-md-6 m-auto bg-light p-5"
    >
      <p class="text-danger">No agent available at the moment.</p>
      <form class="d-flex flex-column">
        <textarea
          class="form-control mb-2"
          name="inquiry"
          id="inquiry"
          cols="50"
          rows="10"
          placeholder="I'd love to know"
        >
        </textarea>
        <button type="submit" class="btn btn-outline-primary">
          Send Email
        </button>
      </form>
    </div>
  </div>
  <chat-body v-else></chat-body>
</template>

<script setup>
import { useHead } from "@vueuse/head";
import { computed, defineAsyncComponent, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const service = ref(store.getters.GET_SERVICE);

const chatBody = defineAsyncComponent({
  loader: () => import(`../components/ChatBody.vue`),
});

const requireName = ref(false);
const joinedWaitingRoom = ref(false);
const notAvailable = ref(false);
const chat = computed(() => store.getters.GET_CHAT);

const name = ref(null);

const setName = function () {
  service.value.emit("set-name", name.value);
  requireName.value = false;
};
const isConnected = computed(() => store.getters.GET_CONNECTION);
if (!isConnected.value) {
  store.dispatch("startService");
}

service.value.on("require-name", () => {
  requireName.value = true;
});
service.value.on("joined-waiting", () => {
  joinedWaitingRoom.value = true;
});
service.value.on("not-available", () => {
  chat.value = null;
  notAvailable.value = true;
});

window.onscroll = function () {
  scrollingDown.value = this.oldScroll - this.scrollY;
  this.oldScroll = this.scrollY;
};

useHead({
  title: `Customer Care`,
  meta: [
    // Standard meta tags
    {
      name: "description",
      content: "Get instant assistance for your shopping inquiries.",
    },
    { name: "robots", content: "noindex, nofollow" }, // Prevent indexing

    // Open Graph meta tags for social sharing
    { property: "og:title", content: "Customer Care - CraftedinKenya" },
    {
      property: "og:description",
      content: "Get instant assistance for your shopping inquiries..",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://www.example.com/login" },
    {
      property: "og:image",
      content: "https://www.example.com/images/login-preview.png",
    }, // Example image URL

    // Twitter card meta tags for social sharing
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Login - CraftedinKenya" },
    {
      name: "twitter:description",
      content: "Get instant assistance for your shopping inquiries..",
    },
    {
      name: "twitter:image",
      content: "https://www.example.com/images/login-preview.png",
    }, // Example image URL
    { name: "twitter:site", content: "@YourTwitterHandle" }, // Your Twitter handle

    // Additional meta tags
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#ffffff" },
    { name: "author", content: "CraftedInKenya" },
    { name: "application-name", content: "CraftedinKenya" },
    { name: "generator", content: "Vue 3" },
  ],
  link: [
    // Canonical URL
    { rel: "canonical", href: "https://www.example.com/login" },

    // Favicon and other icons
    { rel: "icon", href: "/favicon.ico" },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    { rel: "manifest", href: "/site.webmanifest" },
  ],
});

</script>

<style scoped>
.popup {
  animation: bounceIn 3s ease-in-out;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
</style>

