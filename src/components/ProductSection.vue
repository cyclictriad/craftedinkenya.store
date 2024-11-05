<template>
  <section>
    <!-- Loading State -->
    <div v-if="status.loading" class="products-grid">
      <div v-for="i in 8" :key="i" class="skeleton-wrapper">
        <div class="skeleton-card">
          <div class="skeleton-image">
            <div class="loading-animation">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="loading-icon">
                <circle class="loading-circle" cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="2" />
                <path class="loading-check" stroke="currentColor" fill="none" stroke-width="2" d="M8 12l3 3 5-5" />
              </svg>
            </div>
          </div>
          <div class="skeleton-content">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-stats">
              <div class="skeleton-dot"></div>
              <div class="skeleton-dot"></div>
              <div class="skeleton-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="status.failed" class="error-state">
      <div class="error-content">
        <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" viewBox="0 0 24 24">
          <path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z"/>
          <path d="M12 14a1 1 0 0 1-1-1V7a1 1 0 1 1 2 0v6a1 1 0 0 1-1 1zm-1.5 2.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"/>
        </svg>
        <h3>Oops! Something went wrong</h3>
        <p>We're having trouble loading the products. Please try again later.</p>
      </div>
    </div>

    <!-- Content State -->
    <div v-else>
      <h5 v-if="productsToDisplay.length" class="products-heading">
        <slot></slot>
      </h5>

      <div class="products-grid">
        <ProductCard
          v-for="(product, index) in productsToDisplay"
          :key="index"
          :product="product"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!productsToDisplay.length" class="empty-state">
        <div class="empty-content">
          <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" viewBox="0 0 24 24">
            <path d="M19 5h-14a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-14-2h14a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-14a4 4 0 0 1-4-4v-10a4 4 0 0 1 4-4z"/>
            <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
          </svg>
          <h3>No {{ label?.toLowerCase() || "products" }} found</h3>
          <p>Check back later for new additions to our collection</p>
        </div>
      </div>

      <div class="text-center mt-4" v-if="showViewMoreButton">
        <button @click="viewMoreProducts" class="view-more-btn">
          View More
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
// Script remains unchanged
import ProductCard from "./ProductCard.vue";
import { computed, ref } from "vue";

const props = defineProps({
  status: {
    type: Object,
    required: true,
  },
  label: {
    type: Object,
    required: false,
  },
  products: {
    type: Array,
    default: () => [],
  },
});

const viewIndex = ref(12);

const viewMoreProducts = () => {
  viewIndex.value *= 2;
};

const showViewMoreButton = computed(
  () => !(viewIndex.value > props.products.length)
);

const productsToDisplay = computed(() =>
  props.products.slice(0, viewIndex.value)
);
</script>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  margin: -0.5rem; /* Negative margin to counteract card padding */
}

/* Skeleton styles */
.skeleton-wrapper {
  padding: 0.5rem;
}

.skeleton-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
}

.skeleton-image {
  height: 200px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.loading-animation {
  width: 60px;
  height: 60px;
}

.loading-icon {
  width: 100%;
  height: 100%;
  color: #e2e8f0;
}

.loading-circle {
  stroke-dasharray: 66;
  stroke-dashoffset: 66;
  animation: circle-animation 2s infinite;
}

.loading-check {
  opacity: 0;
  animation: check-animation 2s infinite;
}

.skeleton-content {
  padding: 1rem;
}

.skeleton-line {
  height: 12px;
  background: #f1f3f5;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  animation: pulse 1.5s infinite;
}

.skeleton-line.title {
  width: 70%;
}

.skeleton-stats {
  display: flex;
  gap: 0.5rem;
}

.skeleton-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f1f3f5;
  animation: pulse 1.5s infinite;
}

/* Error state */
.error-state, .empty-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #64748b;
}

.error-icon, .empty-icon {
  width: 64px;
  height: 64px;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.view-more-btn {
  background: transparent;
  border: 2px solid #10b981;
  color: #10b981;
  padding: 0.5rem 2rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

.view-more-btn:hover {
  background: #10b981;
  color: white;
}

@keyframes circle-animation {
  0% {
    stroke-dashoffset: 66;
  }
  50% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -66;
  }
}

@keyframes check-animation {
  0%, 30% {
    opacity: 0;
  }
  40%, 60% {
    opacity: 1;
  }
  70%, 100% {
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}
</style>