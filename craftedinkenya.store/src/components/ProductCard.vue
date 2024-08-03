<template>
  <div role="button" class="g-1 g-md-3" :class=" {'col-12 col-sm-6 col-md-4 col-lg-3  ':!discounted, 'col-12 col-sm-6 col-md-4 col-lg-3':discounted}">
    <div @click="$router.push(`/store/products/${product._id}`) " class="card  shadow-lg" >
      <img  :src="`${product.images[0].url}`" class="card-img-top" :alt="product.name">
      <div class="card-body">
        <h5 class="card-title">{{ product.name }}</h5>
        <p class="card-text">{{ product.summary }}</p>
        <div v-if="discounted || bestSelling" class="d-flex justify-content-center text-light" style="font-size:10px">
          <div v-if="bestSelling" class="bg-warning rounded p-1" > Top Selling <i class="bi bi-tag-fill"></i> </div> <div v-if="discounted" class="bg-success rounded p-1">{{product.discount}}% off <i class="bi bi-tag-fill"></i> </div>
        </div>
        <p v-if="!discounted" class="card-text"><strong>Price: ${{ product.sp }}</strong></p>

        <div v-if="discounted" class="d-flex justify-content-center">
          <div class="text-danger rounded fw-bolder diagonal-strike" > <span class="d-none d-lg-inline-block">Was:</span> ${{ previous }}</div> <div class="rounded m-2 fw-bolder"><span class="d-none d-lg-inline-block">Now:</span> ${{ current }} </div>
        </div>
      </div>
      <div class="card-footer" >
        <span class="text-muted">{{ bestSelling ? `${ product.sales} sales` : `A product` }} by <strong>{{ product.shop }}</strong></span>
      </div>
    </div>

</div>
</template>

<script setup>
import {ref} from 'vue';
const props = defineProps({
    product: {
      type: Object,
      required: true
    }
  })
  const discounted = ref(props.product.discount)
  const bestSelling = false
  const previous = ref( ((100 * props.product.sp)/(100-props.product.discount)).toFixed(2))
  const current = ref(props.product.sp)
</script>


<style scoped>
.diagonal-strike {
  position: relative;
  display: inline-block;
}

.diagonal-strike::before {
  content: '';
  position: absolute;
  top: 8px;
  left: -7px;
  width: calc(100% + 14px);
  height: 5px; /* Adjust thickness */
  opacity:0.6;
  background: red; 
  transform: rotate(4deg);
  transform-origin: top left;
}

</style>
