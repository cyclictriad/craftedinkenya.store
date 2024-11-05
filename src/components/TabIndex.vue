<template>
  <div class="container-fluid p-0.5">
    
    <product-section v-if="products.bestSelling.length" :status="status" :products="products.bestSelling">
      Best selling products
    </product-section>
    <product-section v-if="products.discounted.length" :status="status" :products="products.discounted">
      Deals and discounts
    </product-section>
    <Reviews></Reviews>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, defineAsyncComponent, ref } from "vue";
import ProductSection from "./ProductSection.vue";
const Reviews = defineAsyncComponent({
  loader: () => import("./ReviewsSect.vue"),
});

const allProducts = ref([]);
const status = ref({
  failed: false,
  loading: false,
});

const products = computed(() => {
  return {
    loaded: allProducts.value.length,
    bestSelling: allProducts.value
      .toSorted((a, b) => b.sales - a.sales)
      .slice(0, 20)
      .filter((product) => product.sales > 0),
    discounted: allProducts.value
      .toSorted((a, b) => b.discount - a.discount)
      .slice(0, 20)
      .filter((product) => product.discount > 0),
  };
});

const fetchProducts = async function () {
  try {
    status.value.failed = false;
    status.value.loading = true;
    allProducts.value = (await axios(`products`)).data;
  } catch (error) {
    console.error(error);
    status.value.failed = true;
  }
  status.value.loading = false
};

fetchProducts();
</script>

<style scoped>
</style>
