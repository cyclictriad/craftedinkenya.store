<template>
  <div
    role="button"
    class="product-card-wrapper"
  >
    <div
      @click="$router.push(`/store/products/${product._id}`)"
      class="product-card"
    >
      <div class="product-image-wrapper">
        <img
          :src="product.images[0].url"
          :alt="product.name"
          class="product-image"
        />
        <div v-if="discounted || bestSelling" class="product-badges">
          <span v-if="bestSelling" class="badge badge-warning">
            <i class="bi bi-trophy-fill me-1"></i>Top Selling
          </span>
          <span v-if="discounted" class="badge badge-success">
            <i class="bi bi-tag-fill me-1"></i>{{ product.discount }}% off
          </span>
        </div>
      </div>

      <div class="product-content">
        <h5 class="product-title">{{ product.name }}</h5>
        <p class="product-summary">{{ product.summary }}</p>

        <div class="product-price">
          <template v-if="!discounted">
            <strong>${{ product.sp }}</strong>
          </template>
          <template v-else>
            <div class="price-comparison">
              <span class="original-price">${{ previous }}</span>
              <span class="current-price">${{ current }}</span>
            </div>
          </template>
        </div>
      </div>

      <div class="product-footer">
        <span class="text-muted">
          {{ bestSelling ? `${product.sales} sales` : "A product" }}
          by <strong>{{ product.shop }}</strong>
        </span>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
const discounted = ref(props.product.discount);
const bestSelling = false;
const previous = ref(
  ((100 * props.product.sp) / (100 - props.product.discount)).toFixed(2)
);
const current = ref(props.product.sp);
</script>

<style scoped>
.product-card-wrapper {
  padding: 0.5rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  height: 100%;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px; /* Fixed height for images */
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This ensures images maintain aspect ratio */
  object-position: center;
}

.product-badges {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge {
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.badge-warning {
  background-color: #fbbf24;
  color: #7c2d12;
}

.badge-success {
  background-color: #34d399;
  color: #064e3b;
}

.product-content {
  padding: 1.25rem;
}

.product-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.product-summary {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.product-price {
  font-size: 1.25rem;
  margin: 1rem 0;
}

.price-comparison {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.original-price {
  color: #ef4444;
  text-decoration: line-through;
  font-size: 1rem;
  opacity: 0.75;
}

.current-price {
  color: #10b981;
  font-weight: 600;
}

.product-footer {
  padding: 1rem 1.25rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
}
</style>