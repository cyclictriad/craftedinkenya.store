<script setup>
import { useHead } from '@vueuse/head';
import { computed, ref, watch, onMounted } from 'vue';
import axios from 'axios';
// import ProductCard from './ProductCard.vue';
import ProductSection from './ProductSection.vue'
import { useRoute } from 'vue-router';
const route = useRoute()
useHead({
  title:'Product Search',
  meta:[
    {
      name:'description',
      content:'explore all product categories'
    }
  ]
})
const query = computed(()=> route.query.query)

const products = ref({
  cache: [],
  toDisplay: []
});

const fetchProducts = async () => {
  if (!products.value.cache.length) {
    const response = await axios('products');
    products.value.cache = response.data;
  }
  products.value.toDisplay = products.value.cache.filter((product) =>
    [product.name, product.summary, product.description].some((data) => {
      return new RegExp(
        `${query.value.toLowerCase().replaceAll(' ', '|')}`
      ).test(data.toLowerCase());
    })
  );
};

// Watcher to react to query changes
watch(() => query.value, fetchProducts);

// Lifecycle hook to fetch products when the component is mounted
onMounted(fetchProducts);
</script>

<template>
  <div v-if="!products.toDisplay.length" class="row px-2">
    <p class="text-center fw-bolder fs-5">
      <i class="bi bi-emoji-frown mx-2"></i>
      <span>No results match your query {{ query }}</span>
    </p>
  </div>
  <div v-else class="row px-2">
    <product-section :products="products.toDisplay">Search results for <strong class="text-danger">{{ query }} </strong></product-section>

  </div>
</template>



