<template>
  <div>
    <div class="d-lg-none fixed-bottom">
      <div class="bg-body-tertiary collapse shadow-lg" id="categories">
        <ul class="list-group">
          <li v-for="tab in categories" :key="tab._id" class="list-group-item">
            <router-link
              @click="hideToggle()"
              class="nav-link"
              :to="`/store?tab=${tab.category}`"
              >{{ tab.category }}</router-link
            >
          </li>
        </ul>
      </div>
      <div
        class="container-fluid d-flex justify-content-around bg-dark text-white py-3 fs-5"
        data-bs-theme="dark"
      >
        <router-link to="/store" class="nav-link"
          ><span class="visually-hidden">Home</span> <i class="bi bi-house"></i
        ></router-link>
        <a
          class="nav-link categories-collapse position-relative"
          data-bs-toggle="collapse"
          data-bs-target="#categories"
          aria-expanded="false"
          aria-controls="categories"
          ><span class="visually-hidden">Categories</span>
          <i class="bi bi-grid"></i>
          <span
            class="position-absolute badge translate-middle"
            style="font-size: 20px; left: calc(100% + 10px); top: -8px"
            >{{ categories?.length }}</span
          >
        </a>

        <CartIcon></CartIcon>
      </div>
    </div>

    <div v-if="!activeTab" class="tab-pane fade show active" role="tabpanel">
      <IndexPage> </IndexPage>
    </div>
    <div v-else class="tab-pane fade show active" role="tabpanel">
      <div class="container-fluid">
        <product-section :products="products"></product-section>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useHead } from "@vueuse/head";

import { ref, computed, watch, defineAsyncComponent, onBeforeMount } from "vue";
import IndexPage from "./TabIndex.vue";
import axios from "axios";
const CartIcon = defineAsyncComponent({
  loader: () => import("./IconCart.vue"),
});

import ProductSection from "./ProductSection.vue";
import { useRoute } from "vue-router";
const route = useRoute();
const activeTab = computed(() => route.query.tab);
const products = ref([]);
useHead({
  title: "Main Store",
  meta: [
    {
      name: "description",
      value: "This is the home of all curios",
    },
  ],
});

const hideToggle = function () {
  const toggleElement = document.getElementById("categories");
  if (toggleElement) {
    toggleElement.classList.add("hide");
    toggleElement.classList.remove("show");
  }
};
const categories = ref([]);
const allProducts = ref(null);

const fetchProducts = async () => {
  if (allProducts.value) {
    products.value = allProducts.value.filter(
      (product) => product.category === activeTab.value
    );
  } else {
    try {
      const url = activeTab.value
        ? `products?category=${activeTab.value}`
        : `products`;
      const { data } = await axios(url);
      products.value = data;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios("categories");
    const { data } = response;
    categories.value = data.map((data) => ({
      label: data.label,
      category: data.category,
      products: data.products,
    }));
  } catch (error) {
    alert("Error fetching categories:", error);
  }
};

//watch(activeTab, fetchProducts);
watch(activeTab, fetchProducts);

// onMounted(() => {

fetchCategories();

onBeforeMount(async () => {
  if (activeTab.value) {
    await fetchProducts();
  }
});

// });
</script>

<style>
.f-u {
  text-underline-offset: 5px;
  text-decoration-thickness: 2px;
  text-decoration-line: underline;
}
</style>