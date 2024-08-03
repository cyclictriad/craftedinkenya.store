<template>
  <div class="container-fluid p-0.5">
    <product-section :products="products.bestSelling">
      Best selling products
    </product-section>
    <product-section :products="products.discounted">
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
    allProducts.value = (await axios(`products`)).data;
  } catch (error) {
    console.error(error);
  }
};

fetchProducts();
</script>
<script>
</script>

<style scoped>
</style>
