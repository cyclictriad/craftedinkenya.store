<template>
  <div v-if="productsToDisplay.length" class="row my-2">
    <h5>
      <slot> </slot>
    </h5>

    <ProductCard
      v-for="(product, index) in productsToDisplay"
      :key="index"
      :product="product"
    />
    <div class="text-center">
      <button
      v-if="showViewMoreButton"
      @click="viewMoreProducts"
      class="btn btn-outline-success my-2 px-4"
    >
      View More
    </button>
    </div>
    
  </div>
</template>

<script setup>
import ProductCard from "./ProductCard.vue";
import {computed, ref } from "vue";

const props = defineProps({
  products: {
    type: Array,
    default:()=> []
  },
});
const viewIndex = ref(12);

const viewMoreProducts = () => {
  viewIndex.value *=2
};
const showViewMoreButton = computed(()=>!(viewIndex.value > props.products.length))
const productsToDisplay = computed(()=>props.products.slice(0, viewIndex.value))
</script>