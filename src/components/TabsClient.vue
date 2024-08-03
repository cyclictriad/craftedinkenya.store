<template>
  <div>
    <div class="d-lg-none fixed-bottom">
      <div class="bg-body-tertiary collapse shadow-lg" id="categories" >
        <ul class="list-group">
          <li  v-for="tab in categories" :key="tab._id" class="list-group-item">
           <router-link @click="hideToggle()"  class="nav-link" :to="`/store?tab=${tab.category}`">{{ tab.category }}</router-link>
          </li>
        </ul>
      </div>
      <div class="container-fluid d-flex justify-content-around bg-dark text-white py-2" data-bs-theme="dark">
        <router-link  to="/store" class="nav-link">Home <i class="bi bi-house"></i></router-link>
        <a class="nav-link categories-collapse" data-bs-toggle="collapse" data-bs-target="#categories" aria-expanded="false" aria-controls="categories">Categories <i class="bi bi-boxes"></i></a>
        <router-link to="/faqs" class="nav-link">Faqs <i class="bi bi-file-earmark-text"></i></router-link>
      </div>
    </div>

    <div class="tab-content" id="pills-tabContent">
      <div v-if="!activeTab" class="tab-pane fade show active" role="tabpanel">
        <IndexPage> </IndexPage>
      </div>
      <div
        v-for="(tab, index) in categories"
        :key="index"
        v-else
        class="tab-pane fade"
        :class="{ 'show active': activeTab === tab.category }"
        :id="'pills-' + tab.category"
        role="tabpanel"
      >
        <div class="container-fluid">
          <product-section :products="tab.products"></product-section>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useHead } from "@vueuse/head";

import { ref, computed, watch, onMounted, watchEffect } from "vue";
import IndexPage from "./TabIndex.vue";
import axios from "axios";
import { useStore } from "vuex";

import ProductSection from "./ProductSection.vue";
import { useRoute } from "vue-router";
const route = useRoute();
const activeTab = computed(() => route.query.tab);

useHead({
  title: "Main Store",
  meta: [
    {
      name: "description",
      value: "This is the home of all curios",
    },
  ],
});

const hideToggle = function(){
  const toggleElement = document.getElementById('categories')
  if(toggleElement){
    toggleElement.classList.add('hide')
    toggleElement.classList.remove('show')
  }
}
const categories = ref([]);
const allProducts = ref(null);

const fetchProducts = async () => {
  if (allProducts.value) {
    const tabIndex = categories.value.findIndex(
      (tab) => tab.category === activeTab.value
    );
    if (tabIndex !== -1) {
      categories.value[tabIndex].products = allProducts.value.filter(
        (product) => product.category === activeTab.value
      );
    }
  } else {
    try {
      const url = activeTab.value
        ? `products?category=${activeTab.value}`
        : `products`;
      const response = await axios(url);
      const { data } = response;
      const tabIndex = categories.value.findIndex(
        (tab) => tab.category === activeTab.value
      );
      if (tabIndex !== -1) {
        categories.value[tabIndex].products = data;
      }
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
if (activeTab.value) {
  fetchProducts();
}

// });
</script>

<style>
.f-u {
  text-underline-offset: 5px;
  text-decoration-thickness: 2px;
  text-decoration-line: underline;
}
</style>