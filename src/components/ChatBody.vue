<template>
  <div
    class="d-flex flex-column justify-content-between"
    style="min-height: 100vh"
  >
    <div class="row">
      <div
        class="d-flex justify-content-between align-items-center sticky-top bg-light"
        style="opacity: 0.95; box-shadow: 2px"
      >
        <p class="my-auto p-2">
          <span class="other-text fw-bolder">{{
            isClient ? chat.host.name : chat.client.name
          }}</span>
          <br />
          <span :innerHTML="status"></span>
        </p>

        <div>
          <a
            href="javascript:void(0)"
            class="rounded-0 text-success m-1"
            @click="$router.back()"
          >
            <span> Close </span>
          </a>
          <a
            href="javascript:void(0)"
            class="rounded-0 text-danger m-1"
            @click="clearChat"
          >
            <span> New <i class="bi bi-pen"> </i></span>
          </a>
        </div>
      </div>
      <div
        class="py-2"
        style="overflow-y: scroll; scrollbar-width: none; max-height: 85vh"
      >
        <div v-for="(message, index) in chat.messages" :key="message._id">
          <div
            v-if="
              !index ||
              localTime(chat.messages[index].createdAt, 'ddd, Do, MMM') !==
                localTime(chat.messages[index - 1].createdAt, 'ddd, Do, MMM')
            "
            class="mb-4 text-center"
          >
            <small
              class="mx-auto rounded p-1 fw-bolder"
              :class="{
                me: isFromMe(message),
                other: !isFromMe(message),
              }"
            >
              {{
                localTime(chat.messages[index].createdAt, "ddd, Do, MMM")
              }}</small
            >
          </div>
          <div
            class="mb-3"
            v-if="message._id === unreadMessages[0]?._id"
            style="
              background-color: #f3f3f3;
              height: 2px;
              text-align: center;
              position: relative;
            "
          >
            <small
              style="
                background-color: white;
                opacity: 1;
                color: black;
                height: 10px;
                position: absolute;
                top: -10px;
              "
              >Unread</small
            >
          </div>

          <div
            :class="[
              'chat',
              {
                ' col-12 col-lg-3 col-md-4 col-sm-8 offset-sm-1 text-white':
                  !isFromMe(message),
                'rounded-2 col-lg-3 col-md-5 col-sm-8 offset-lg-8 offset-md-6 offset-sm-3 my-2':
                  isFromMe(message),
              },
            ]"
          >
            <p
              class="text-start text-wrap p-2 m-0"
              :class="{
                'other left': !isFromMe(message),
                me: isFromMe(message),
              }"
            >
              {{ message.value }}
            </p>
            <p class="text-muted text-end pe-3">
              <span>
                <span v-if="isFromMe(message)">
                  <small v-if="message.seen">Seen</small>
                  <small v-else>Delivered</small><i class="me-1 bi bi-dot"></i>
                </span>

                <small>{{
                  localTime(message.updatedAt, "HH:MM a")
                }}</small></span
              >
            </p>
          </div>
        </div>
        <div class="text-center" v-if="!chat.messages?.length">
          New messages go here...
        </div>
      </div>
    </div>
    <button
      v-if="scrollingDown"
      @click="scrollToTop"
      class="btn shadow position-fixed end-0 bottom-0 me-2 mb-5 rounded-circle fw-bolder"
      style="
        background-color: #0101b9;
        color: white;
        color-scheme: dark;
        width: 40px;
        height: 40px;
      "
    >
      <i class="bi bi-arrow-up"></i>
    </button>
    <form
      id="form "
      @submit.prevent="postMessage"
      class="col-12 col-sm-10 col-md-9 mx-auto d-flex my-2 sticky-bottom"
    >
      <input
        v-model="newMessage"
        @input="amTyping"
        @blur="notTypying"
        class="form-control border border-success rounded-0 border-end-0"
        placeholder="Hey, I would like to know..."
        required
        aria-required="true"
        autofocus
      />

      <button class="btn btn-outline-success rounded-0">Send</button>
    </form>
  </div>
</template>

<script setup>
import moment from "moment";
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";

const localTime = (_utcDate, format) => {
  return moment.utc(_utcDate).local().format(format);
};

const props = defineProps({
  isClient: {
    type: Boolean,
    default: () => true,
  },
});

const status = ref("Online");

const isFromMe = function (message) {
  return props.isClient ? message.from === "self" : message.from !== "self";
};

const store = useStore();
const service = ref(store.getters.GET_SERVICE);
const chat = computed(() => store.getters.GET_CHAT);

const newMessage = ref("");
const unreadMessages = computed(() =>
  store.getters.GET_UNREAD.filter((message) => !isFromMe(message))
);
const wasTyping = ref(false);

const typingDelay = 800;
const notTypying = function () {
  service.value.emit("am-not-typing");
  wasTyping.value = false;
};
const typingTimeOut = () => {
  return setTimeout(notTypying, typingDelay);
};
const currentTimeOut = ref(null);
const amTyping = function () {
  if (!wasTyping.value) {
    service.value.emit("am-typing");
    wasTyping.value = true;
  }
  if (currentTimeOut.value) {
    clearTimeout(currentTimeOut.value);
  }
  currentTimeOut.value = typingTimeOut();
};
const postMessage = function () {
  if (!newMessage.value) return;
  service.value.emit("send-message", newMessage.value);
  newMessage.value = "";
};
service.value.on("other-typing", () => {
  status.value = "typing...";
});
service.value.on("other-not-typing", () => {
  status.value = "Online";
});
service.value.on("other-offline", () => {
  status.value = `Last seen <strong> ${formatDate(moment())} </strong>`;
});
const clearChat = () => service.value.emit("clear-chat");

const scrollingDown = ref(false);
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
const updateSeenStatus = function () {
  document.body.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
  if (
    chat.value &&
    chat.value.messages.some((message) => !message.seen && !isFromMe(message))
  ) {
    service.value.emit("seen");
  }
};
watch(
  computed(() => chat.value?.messages.length),
  updateSeenStatus
);

updateSeenStatus();
</script>

<style>
.chat {
  position: relative;
}
.message {
  padding: 0px 12px 0px 12px;
}
.other {
  background-color: #0101b9;
  color: white;
}
.other-text {
  color: #0101b9;
}
.left {
  border-radius: 0px 10px 10px 10px;
}

.me {
  background-color: #c1c1c1;
}
</style>