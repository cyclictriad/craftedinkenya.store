<template>
  <reset-form v-if="action === 'reset-password'" :email="'simonmwangi11416@gmail.com'"></reset-form>
  <form
    v-else
    @submit.prevent="auth"
    class="form col-md-7 col-lg-4 mx-auto rounded shadow-lg py-5 px-4 my-5 text-center"
  >
    <h5 class="form-heading my-5">{{ activeTab }} Form</h5>
    <div v-if="action === 'signup'" class="form-floating input-group mt-3">
      <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
      <input
        v-model="formData.fullName"
        class="form-control"
        type="text"
        name="name"
        id="name"
        placeholder="John Doe"
        aria-placeholder="Enter your full names ie. John Doe"
        autocomplete="name"
        required
        aria-required="true"
      />
      <p v-if="!valid.fullName" class="w-100 text-start form-text text-danger">
        Please enter a valid name
      </p>
    </div>

    <div v-if="valid.fullName" class="form-floating input-group mt-3">
      <span class="input-group-text">@</span>
      <input
        v-model="formData.email"
        class="form-control"
        type="email"
        name="email"
        id="email"
        placeholder="example@domain.com"
        aria-placeholder="Enter your email i.e example@domain.com"
        autocomplete="email"
        required
        aria-required="true"
        autofocus
      />

      <p v-if="!valid.email" class="w-100 text-start form-text text-danger">
        Please enter a valid email
      </p>
    </div>
    <div v-if="errors.email.length">
      <p
        v-for="(error, index) in errors.email"
        :key="index"
        class="my-2 bg-danger-subtle text-start px-2 py-1"
      >
        <i class="bi bi-x-circle-fill text-danger mx-2"></i>
        <span> {{ error }}</span>
      </p>
    </div>
    <div
      v-if="valid.email && valid.fullName"
      class="form-floating my-3 input-group"
    >
      <span class="input-group-text">
        <i
          class="bi"
          :class="action === 'signin' ? ' bi-key' : 'bi-lock-fill'"
        ></i>
      </span>
      <input
        v-model="formData.password"
        class="form-control"
        :type="view.password ? 'text' : 'password'"
        name="password"
        id="password"
        placeholder="Enter your password"
        aria-placeholder="Enter your password"
        autocomplete="current-password"
        required
        aria-required="true"
      />
      <span
        v-if="formData.password"
        @click="view.password = !view.password"
        class="input-group-text"
      >
        <i v-if="view.password" class="bi bi-eye-slash"></i>
        <i v-else class="bi bi-eye"></i>
      </span>
    </div>
    <div
      v-if="valid.email && valid.fullName && !valid.password"
      class="text-start form-text"
    >
      <div class="d-flex justify-content-around">
        <ul class="list-group">
          <li
            class="list-group-item"
            :class="{
              'text-success': passwordValid.upperCase,
              'text-danger': !passwordValid.upperCase,
            }"
          >
            <i
              v-if="passwordValid.upperCase"
              class="mx-1 bi bi-check-circle-fill"
            ></i>
            <i v-else class="mx-1 bi bi-x-circle-fill"></i>uppercase letter
          </li>
          <li
            class="list-group-item"
            :class="{
              'text-success': passwordValid.lowerCase,
              'text-danger': !passwordValid.lowerCase,
            }"
          >
            <i
              v-if="passwordValid.lowerCase"
              class="mx-1 bi bi-check-circle-fill"
            ></i>
            <i v-else class="mx-1 bi bi-x-circle-fill"></i>lowercase letter
          </li>
        </ul>
        <ul class="list-group">
          <li
            class="list-group-item"
            :class="{
              'text-success': passwordValid.number,
              'text-danger': !passwordValid.number,
            }"
          >
            <i
              v-if="passwordValid.number"
              class="mx-1 bi bi-check-circle-fill"
            ></i>
            <i v-else class="mx-1 bi bi-x-circle-fill"></i>number
          </li>
          <li
            class="list-group-item"
            :class="{
              'text-success': passwordValid.symbol,
              ' text-danger': !passwordValid.symbol,
            }"
          >
            <i
              v-if="passwordValid.symbol"
              class="mx-1 bi bi-check-circle-fill"
            ></i>
            <i v-else class="mx-1 bi bi-x-circle-fill"></i>symbol
          </li>
        </ul>
        <ul class="list-group">
          <li
            class="list-group-item"
            :class="{
              'text-success': passwordValid.chars,
              'text-danger': !passwordValid.chars,
            }"
          >
            <i
              v-if="passwordValid.chars"
              class="mx-1 bi bi-check-circle-fill"
            ></i>
            <i v-else class="mx-1 bi bi-x-circle-fill"></i>6 characters
          </li>
        </ul>
      </div>
    </div>

    <div v-if="errors.password.length">
      <p
        v-for="(error, index) in errors.password"
        :key="index"
        class="my-2 bg-danger-subtle text-start px-2 py-1"
      >
        <i class="bi bi-x-circle-fill text-danger mx-2"></i>
        <span> {{ error }}</span>
      </p>
    </div>

    <div
      v-if="user.loggedIn || user.created"
      class="alert alert-success d-flex align-items-center"
      role="alert"
    >
      <p class="p-2 text-start">
        <i class="bi bi-check-circle-fill pt-4"></i>
      </p>
      <p class="p-2 text-center">
        User
        {{ view.tab === "signup" && user.created ? "created" : "logged in" }}
        successfully. <br />Redirecting you in a few...
      </p>
    </div>
    <p class="text-danger my-5" v-if="forgotPassword">
      Forgot your password?
      <router-link to="/auth/reset-password">reset here</router-link>.
    </p>

    <p v-else class="text-danger my-5">
      {{
        action === "signup"
          ? "Already have an account? "
          : "Don't have an account?"
      }}
      <router-link :to="action === 'signin' ? '/auth/signup' : '/auth/signin'"
        >{{ action === "signup" ? "Login" : "Sign Up" }}
      </router-link>
    </p>

    <button
      v-if="goodToGo"
      type="submit"
      class="btn px-5"
      :class="{ 'btn-primary': !status.failed, 'btn-danger': status.failed }"
      :name="activeTab"
      :disabled="status.loading"
      :aria-disabled="status.loading"
    >
      <div
        v-if="status.loading"
        class="spinner-border spinner-border-sm m-1"
      ></div>
      <span v-else-if="status.failed">Try again</span>
      <span v-else> {{ activeTab }}</span>
    </button>
  </form>
</template>

<script setup>
import { useHead } from "@vueuse/head";
import axios from "axios";
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";

const resetForm = defineAsyncComponent({
  loader: () => import("./FormReset.vue"),
});

const route = useRoute();
const status = ref({
  loading: false,
  failed: false,
});
const user = ref({
  created: false,
  loggedIn: false,
});
const view = ref({
  password: false,
  tab: "login",
});
const errors = ref({
  email: [],
  password: [],
});
const formData = ref({
  fullName: "",
  email: "",
  password: "",
});



const activeTab = computed(() =>
  action.value === "signup" ? "Sign Up" : "Login"
);
const action = computed(() => route.params.action);
const numbers = "1234567890";
const letters = "abcdefghijklmnopqrstuvwxyz";

const requiresValidation = computed(() => action.value === "signup");
const forgotPassword = ref(false);
const passwordValid = computed(() => {
  return {
    upperCase: formData.value.password
      .split("")
      .some(
        (char) =>
          char.toUpperCase() === char && letters.includes(char.toLowerCase())
      ),
    lowerCase: formData.value.password
      .split("")
      .some((char) => char.toLowerCase() === char && letters.includes(char)),
    number: formData.value.password
      .split("")
      .some((char) => numbers.includes(char)),
    symbol: formData.value.password
      .split("")
      .some(
        (char) =>
          !Array.from(numbers + letters).find(
            (el) => char === el || el.toUpperCase() === char
          )
      ),
    chars: formData.value.password.trim().length >= 6,
  };
});

const valid = computed(() => {
  return {
    fullName:
      !requiresValidation.value ||
      (formData.value.fullName.trim().split(" ").length > 1 &&
        formData.value.fullName
          .split("")
          .every((char) => !numbers.includes(char))),
    email:
      !requiresValidation.value ||
      new RegExp(/.+\@.+\..+/).test(formData.value.email),
    password:
      !requiresValidation.value ||
      Object.values(passwordValid.value).every((val) => val),
  };
});

const goodToGo = computed(() => Object.values(valid.value).every((val) => val));

const auth = async () => {
  try {
    if (action.value !== "signin" && action.value !== "signup") return;
    erase([user.value, errors.value]);
    if (!goodToGo.value) return;
    formData.value.email = formData.value.email.trim();
    formData.value.password = formData.value.password.trim();
    const url = `auth/${action.value}`;
    status.value.failed = false;
    status.value.loading = true;

    await axios.post(url, formData.value);
    action.value === "signup"
      ? (user.value.created = true)
      : (user.value.loggedIn = true);
  } catch (error) {
    status.value.failed = true;
    if (error.response) {
      const response_errors = error.response.data.errors;
      Object.keys(response_errors).forEach((error) => {
        response_errors[error].forEach((message) => {
          errors.value[error].push(message);
          if (message === "Incorrect password") {
            forgotPassword.value = true;
          }
        });
      });
    }
  }
  status.value.loading = false;
};
const erase = (obj) => {
  const erase = (obj) => {
    Object.keys(obj).map((key) => {
      if (typeof obj[key] === "object") {
        if (obj[key].length) {
          obj[key] = [];
        } else {
          erase(obj[key]);
        }
      } else if (typeof obj[key] === "string") {
        obj[key] = "";
      } else if (typeof obj[key] === "number") {
        obj[key] = 0;
      } else if (typeof obj[key] === "boolean") {
        obj[key] = false;
      } else {
        obj[key] = null;
      }
    });
  };
  if (obj.length) {
    obj.forEach((obj) => erase(obj));
  } else {
    erase(obj);
  }
};

watch(
  computed(() => view.value.tab),
  () => {
    if (status.value.failed) {
      erase(errors.value);
      status.value.failed = false;
    }
  }
);

watch(action, () => {
  useHead({
    title: `${
      action.value === "signup" ? "Sign up " : "Login"
    } - CraftedinKenya`,
    meta: [
      // Standard meta tags
      {
        name: "description",
        content: "Login to access your account and manage your preferences.",
      },
      { name: "robots", content: "noindex, nofollow" }, // Prevent indexing

      // Open Graph meta tags for social sharing
      { property: "og:title", content: `${action.value} - CraftedinKenya` },
      {
        property: "og:description",
        content: "Login to access your account and manage your preferences.",
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
        content: "Login to access your account and manage your preferences.",
      },
      {
        name: "twitter:image",
        content: "https://www.example.com/images/login-preview.png",
      }, // Example image URL
      { name: "twitter:site", content: "@YourTwitterHandle" }, // Your Twitter handle

      // Additional meta tags
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#ffffff" },
      { name: "author", content: "Your Name or Company" },
      { name: "application-name", content: "CraftedinKenya" },
      { name: "generator", content: "Vue 3" },
    ],
    link: [
      // Canonical URL
      {
        rel: "canonical",
        href: `https://www.craftedinkenya.store/auth/${action.value}`,
      },

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
});
</script>

<style scoped>
.form-heading {
  font-family: monospace;
}
.form-control {
  height: 55px;
  text-justify: center;
}
.form-control::placeholder {
  color: red;
  font-family: monospace;
}
.errors {
  background-color: #ee1111;
}

.redirect-to-login {
  margin: 30px;
  color: red;
}
.bi-check-circle-fill {
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