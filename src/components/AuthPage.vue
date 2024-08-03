<template>
  <form
    @submit.prevent="auth"
    class="form col-md-6 col-lg-4 mx-auto rounded shadow-lg py-5 px-4 my-5 text-center"
  >
    <h5 class="form-heading">{{ activeTab }} Form</h5>
    <img src="../assets/logo.png" alt="logo" class="rounded-circle w-25" />

    <div class="d-flex justify-content-start">
      <button
        type="button"
        @click.prevent="(view.tab = 'signup'), erase([user, errors])"
        class="btn bg-light mx-2"
        :class="{ active: view.tab === 'signup' }"
      >
        Signup
      </button>
      <button
        type="button"
        @click.prevent="(view.tab = 'login'), erase([user, errors])"
        class="btn bg-light mx-2"
        :class="{ active: view.tab === 'login' }"
      >
        Login
      </button>
    </div>
    <div v-if="view.tab === 'signup'" class="form-floating input-group my-3">
      <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
      <input
        v-model="formData.fullName"
        class="form-control"
        type="text"
        name="name"
        id="name"
        placeholder="John Doe"
        aria-placeholder="Enter your full names ie. John Doe"
        required
        aria-required="true"
        :autofocus="view.tab === 'signup'"
      />
    </div>
    <div class="form-floating input-group my-3">
      <span class="input-group-text">@</span>
      <input
        v-model="formData.email"
        class="form-control"
        type="email"
        name="email"
        id="email"
        placeholder="example@domain.com"
        aria-placeholder="Enter your email as example@domain.com"
        required
        aria-required="true"
        :autofocus="view.tab === 'signin'"
      />
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
    <div class="form-floating my-3 input-group">
      <span class="input-group-text">
        <i
          class="bi"
          :class="view.tab === 'signup' ? 'bi-lock-fill' : ' bi-key'"
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

    <p
      @click="view.tab = view.tab === 'signup' ? 'login' : 'signup'"
      class="text-danger my-5"
    >
      {{
        view.tab === "signup"
          ? "Already have an account? "
          : "Don't have an account?"
      }}
      <strong>{{ view.tab === "signup" ? "Login " : "Sign Up" }} </strong>
    </p>
    <button type="submit" class="btn btn-primary px-5" :name="activeTab">
      {{ activeTab }}
    </button>
  </form>
</template>

<script setup>
import { useHead } from "@vueuse/head";
import axios from "axios";
import { computed, ref } from "vue";
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
  fullName: null,
  email: "",
  password: "",
});
const activeTab = computed(()=>view.value.tab === "signup" ? "Sign Up" : "Login");
const auth = async () => {
  try {
    errors.value = {
      email: [],
      password: [],
    };
    erase(user.value);

    formData.value.email = formData.value.email.trim();
    formData.value.password = formData.value.password.trim();
    const url = (view.value.tab === "signup" && `auth/signup`) || `auth/signin`;
    await axios.post(url, formData.value);
    view.value.tab === "signup"
      ? (user.value.created = true)
      : (user.value.loggedIn = true);
  } catch (error) {
    if (error.response) {
      const response_errors = error.response.data.errors;
      Object.keys(response_errors).forEach((error) => {
        response_errors[error].forEach((message) =>
          errors.value[error].push(message)
        );
      });
    }
  }
};
const erase = (obj) => {
  const erase = (obj) => {
    Object.keys(obj).map((key) => {
      if (typeof obj[key] === "object") {
        obj[key] = [];
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

useHead({
  title: `${view.value.tab} - CraftedinKenya`,
  meta: [
    // Standard meta tags
    {
      name: "description",
      content: "Login to access your account and manage your preferences.",
    },
    { name: "robots", content: "noindex, nofollow" }, // Prevent indexing

    // Open Graph meta tags for social sharing
    { property: "og:title", content: "Login - CraftedinKenya" },
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
</style>