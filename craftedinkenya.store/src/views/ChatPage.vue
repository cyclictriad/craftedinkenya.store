<template>
  <div
    class="d-flex flex-column justify-content-between rol"
    style="min-height: 100vh"
  >
    <div class="row">
      <button
        v-if="scrollingDown"
        @click="scrollToTop"
        class="btn btn-primary shadow position-fixed end-0 top-50 m-2 z-index-1000"
        style="width: fit-content"
      >
        <i class="bi bi-arrow-up"></i>
      </button>
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex justify-content-center align-items-center">
          <img
            src="../assets/face1.jpg"
            alt=""
            class="d-none d-md-block rounded-circle border border-5 m-3"
            :class="online ? 'border-success' : 'border-danger'"
            style="height: 50px"
          />
          <p class="my-auto">
            <span class="fw-bolder">Admin</span>
            <br />
            <span :class="online ? `text-success` : `text-danger`">Online</span>
          </p>
        </div>
        <div class="dropdown">
          <button
            type="button"
            id="themesButton"
            class="btn btn-primary dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span class="d-none d-md-inline-block">Theme</span> <i class="bi bi-gear"></i>
          </button>
          <div class="dropdown-menu" aria-labelledby="themesButton">
            <a href="javascript:void(0)" class="dropdown-item">System</a>
            <a href="javascript:void(0)" class="dropdown-item">Dark</a>
            <a href="javascript:void(0)" class="dropdown-item">Light</a>
            <a href="javascript:void(0)" class="dropdown-item">Dark</a>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-success m-2" @click="$router.back()">
             
            <span class="d-none d-md-inline-block">
              Close
            </span>
            <i class="d-inline-block d-md-none bi bi-arrow-up">

            </i>
          </button>
          <button class="btn btn-danger m-2" @click="clearChat()">
          
            <span class="d-none d-md-inline-block">
              New Chat
            </span>
            <i class="d-inline-block d-md-none bi bi-pen">

            </i>
          </button>
        </div>
      </div>
      <hr />
      <div class="col-auto offset-md-1 alert bg-info-subtle text-start">
        <p>
          <i class="bi bi-info-circle-fill px-3"></i> This page is under
          maintenance
        </p>
        <p>
          <i class="bi bi-info-circle-fill px-3"></i>It may take a while before
          getting a reply
        </p>
        <p><i class="bi bi-info-circle-fill px-3"></i>Kindly bear with us</p>
      </div>

      <div v-for="chat in chats" :key="chat._id">
        <div
          v-if="chat.inquiry"
          class="rounded-2 col-lg-3 col-md-5 col-sm-8 offset-lg-8 offset-md-6 offset-sm-3 bg-body-secondary my-2"
          :class="{ waiting: chat.pId && !chat.answer }"
        >
          <div
            v-if="chat.pId && !chat.answer"
            class="text-start px-2 bg-info text-white fd-italic"
          >
            <i class="bi bi-info-square-fill"></i>
            This may take some time to reply
          </div>
          <div class="p-0">
            <p class="text-start text-wrap px-4">
              {{ chat.inquiry }}
            </p>
          </div>

          <div class="d-flex justify-content-between p-0 text-italic">
            <p class="px-2" style="font-style: italic">
              <span v-if="chat.pId"> -to seller</span>
              <span v-else>-to admin </span>
            </p>
            <button @click="deleteChat(chat._id)" class="btn btn-transparent">
              delete
            </button>
          </div>
        </div>
        <div
          v-if="chat.answer"
          class="d-flex justify-content-start my-2"
          style="z-index: -100"
        >
          <img
            src="../assets/face2.jpg"
            alt=""
            class="d-none d-lg-inline-block rounded-circle my-1 ms-1 me-3"
            height="50"
            style="border: solid 5px #0101b9"
          />

          <div
            class="chat left d-inline-flex col-12 col-lg-3 col-md-4 col-sm-8 text-white fw-bolder my-auto"
          >
            <p class="message text-start text-wrap px-4 py-2 my-auto">
              {{ chat.answer }}
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="status.messages.loading"
        class="d-flex justify-content-center align-items-center text-secondary"
      >
        <div class="spinner-border spinner-border-sm mx-2"></div>
        <p class="my-auto">Fetching your messages</p>
      </div>
      <p v-else-if="status.messages.failed" class="text-center text-danger">
        <i class="bi bi-exclamation-circle-fill mx-2"></i> Error occured while
        fetching your messages
      </p>
      <div
        v-if="
          !chats.length && !status.messages.loading && !status.messages.failed
        "
      >
        New messages go here...
      </div>
    </div>
    <form
      id="form"
      @submit.prevent="postMessage"
      class="col-12 col-sm-10 col-md-9 mx-auto d-flex"
    >
      <input
        style="border-radius: 10px 0 0 10px"
        v-model="details.inquiry"
        class="form-control border border-success"
        placeholder="Hey, I would like to know..."
        autofocus
      />
      <button
        class="btn"
        :class="{
          'disabled rounded-circle': status.send.loading,
          'btn-danger': status.send.failed,
          'btn-success': !status.send.loading || !status.send.failed,
        }"
        style="transition: border 500s ease; border-radius: 0 10px 10px 0"
      >
        <div
          v-if="status.send.loading"
          class="spinner-border spinner-border-sm"
        >
          <span class="visually-hidden">Loading</span>
        </div>
        <p class="my-auto text-nowrap" v-else-if="status.send.failed">
          <i class="bi bi-exclamation-circle-fill px-2"></i>
          <span class="d-none d-md-inline-block">Failed</span>
        </p>
        <span v-else>Send</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { useHead } from "@vueuse/head";
import axios from "axios";
import { computed, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const online = ref(false)
const details = computed(() => {
  return {
    inquiry: "",
    cId: localStorage.getItem("sId"),
    pId: route.query.pId,
  };
});
const chats = ref([]);
const status = ref({
  messages: {
    loading: false,
    failed: false,
  },
  send: {
    loading: false,
    failed: false,
  },
});
const scrollingDown = ref(false);
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
const loadChat = async function () {
  status.value.messages.failed = false;
  status.value.messages.loading = true;
  axios(`inquiry/${details.value.cId}`)
    .then((data) => {
      chats.value = data.data;
    })
    .catch((error) => {
      status.value.messages.failed = true;
    })
    .finally(() => {
      status.value.messages.loading = false;
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
};
const postMessage = async function () {
  if (!details.value.inquiry) return;
  try {
    status.value.send.failed = false;
    status.value.send.loading = true;
    await axios.post(`inquiry`, details.value);
    loadChat();
  } catch (error) {
    status.value.send.failed = true;
  }
  status.value.send.loading = false;
};
const deleteChat = async function (id) {
  try {
    await axios.delete(`inquiry/${details.value.cId}?id=${id}`);
    loadChat();
  } catch (error) {}
};
const clearChat = async function () {
  try {
    await axios.delete(`inquiry/${details.value.cId}`);
    localStorage.removeItem("sId");
    location.reload();
  } catch (error) {}
};
if (!localStorage.getItem("sId")) {
  localStorage.setItem("sId", Date.now());
} else {
  loadChat();
}
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
.chat {
  position: relative;
}
.message {
  padding: 0px 12px 0px 12px;
}
.left {
  min-height: 55px;
  border-radius: 0px 10px 10px 10px;
  background-color: #0101b9;
}
</style>

