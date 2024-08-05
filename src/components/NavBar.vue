<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <!-- Logo -->
      <a class="navbar-brand" href="#">
        <img
          src="../assets/logo.png"
          alt="logo"
          width="50"
          height="50"
          class="d-inline-block align-text-top"
        />
      </a>

      <!-- Delivery location -->
      <div class="d-flex flex-column align-items-start ms-3">
        <span class="d-md-block d-none">Deliver to</span>
        <select
          v-model="selectedLocation"
          class="form-select form-select-sm w-auto"
        >
          <option
            v-for="location in deliveryLocations"
            :key="location"
            :value="location"
          >
            {{ location.name }}
          </option>
        </select>
      </div>

      <!-- Navbar links (visible only on large screens) -->
      <div class="collapse navbar-collapse d-none d-lg-flex ms-5">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              to="/store"
              class="nav-link"
              :class="{ 'fw-bolder text-danger': !activeTab }"
              >Home</router-link
            >
          </li>
          <li class="nav-item" v-for="tab in categories" :key="tab._id">
            <router-link
              :to="`/store?tab=${tab.category}`"
              class="nav-link"
              :class="{ 'fw-bolder text-danger': tab.category === activeTab }"
              >{{ tab.category }}</router-link
            >
          </li>
        </ul>
      </div>

      <!-- Spacer -->
      <div class="flex-grow-1"></div>

      <!-- Icons and search form -->
      <div class="d-flex align-items-center">
        <!-- Icon links -->
        <router-link to="/customer-care" class="nav-link mx-2 mx-md-2 mx-lg-1"
          ><i class="bi bi-chat-dots"></i
        ></router-link>
        <auth-button></auth-button>
        <cart-icon></cart-icon>

        <!-- Toggler for search form on mobile -->
        <button
          class="navbar-toggler btn border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#searchForm"
          aria-controls="searchForm"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i class="bi bi-search"></i>
        </button>

        <!-- Search form (visible only on large screens) -->
        <form
          @submit.prevent="search"
          class="d-none d-lg-flex ms-3 my-auto"
          role="search"
        >
          <input
            v-model="query"
            @input="search"
            class="form-control rounded-0 border-success"
            type="search"
            placeholder="Search for products and categories"
            aria-label="Search"
          />
          <button type="submit" class="btn rounded-0 btn-success p-0">
            <i class="bi bi-search p-2"></i>
          </button>
        </form>
      </div>

      <!-- Search form (visible on mobile when toggler is clicked) -->
      <div class="collapse w-100 mt-2" id="searchForm">
        <form @submit.prevent="search" class="d-flex w-100" role="search">
          <input
            v-model="query"
            @input="search"
            class="form-control rounded-0 border-success w-100"
            type="search"
            placeholder="Search for products and categories"
            aria-label="Search"
          />
        </form>
      </div>
    </div>
    <checkout></checkout>
  </nav>
</template>



<script setup>
import axios from "axios";
import { computed, defineAsyncComponent, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const AuthButton = defineAsyncComponent({
  loader: () => import("./AuthButton.vue"),
});
const CartIcon = defineAsyncComponent({
  loader: () => import("./IconCart.vue"),
});
const Checkout = defineAsyncComponent({
  loader: () => import("./CheckoutPage.vue"),
});

const deliveryLocations = ref([]); // List of available delivery locations
const selectedLocation = ref("Kenya"); // Default selected delivery location
const activeTab = computed(() => route.query?.tab);
const query = ref(null);
const search = function () {
  query.value
    ? router.replace(`/search?query=${query.value}`)
    : router.replace(`/store`);
};
const categories = ref("");
const isAuth = computed(() => route.fullPath === "/auth");
const fetchDeliveryLocations = async function () {
  try {
    const response = await axios(`locations`);
    const { data } = response;
    deliveryLocations.value = data.map((location) => location.name);
  } catch (error) {
    console.error("Error fetching delivery locations:", error);
  }
};
const fetchCategories = async function () {
  try {
    const { data } = await axios(`categories`);
    categories.value = data;
  } catch (error) {}
};
watchEffect(() => isAuth.value);
fetchDeliveryLocations();
fetchCategories();
</script>
