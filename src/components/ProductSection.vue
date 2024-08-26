<template>
  <section v-if="status.failed || status.loading" class="card-container mb-2">
    <div class="card flashing">
      <div class="card-img-placeholder">
        <svg
          v-if="status.loading"
          xmlns="http://www.w3.org/2000/svg"
          width="160"
          height="160"
          style="margin-left: 20px; margin-top: 20px"
          fill="currentColor"
          class="bi bi-image bounce"
          viewBox="0 0 16 16"
        >
          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
          <path
            d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="160"
          height="160"
          style="margin-left: 20px; margin-top: 20px"
          fill="currentColor"
          class="bi bi-file-image-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M4 0h8a2 2 0 0 1 2 2v8.293l-2.73-2.73a1 1 0 0 0-1.52.127l-1.889 2.644-1.769-1.062a1 1 0 0 0-1.222.15L2 12.292V2a2 2 0 0 1 2-2m4.002 5.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"
          />
          <path
            d="M10.564 8.27 14 11.708V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.293l3.578-3.577 2.56 1.536 2.426-3.395z"
          />
        </svg>
      </div>
      <div class="card-body-placeholder">
        <div class="card-title-placeholder"></div>
        <div class="card-text-placeholder"></div>
        <div class="card-status-placeholder"></div>
        <div class="card-price-placeholder"></div>
        <div class="card-footer-placeholder"></div>
      </div>
    </div>
    <div class="card flashing">
      <div class="card-img-placeholder">
        <svg
          v-if="status.loading"
          xmlns="http://www.w3.org/2000/svg"
          width="160"
          height="160"
          style="margin-left: 20px; margin-top: 20px"
          fill="currentColor"
          class="bi bi-image bounce"
          viewBox="0 0 16 16"
        >
          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
          <path
            d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="160"
          height="160"
          style="margin-left: 20px; margin-top: 20px"
          fill="currentColor"
          class="bi bi-file-image-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M4 0h8a2 2 0 0 1 2 2v8.293l-2.73-2.73a1 1 0 0 0-1.52.127l-1.889 2.644-1.769-1.062a1 1 0 0 0-1.222.15L2 12.292V2a2 2 0 0 1 2-2m4.002 5.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"
          />
          <path
            d="M10.564 8.27 14 11.708V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.293l3.578-3.577 2.56 1.536 2.426-3.395z"
          />
        </svg>
      </div>
      <div class="card-body-placeholder">
        <div class="card-title-placeholder"></div>
        <div class="card-text-placeholder"></div>
        <div class="card-status-placeholder"></div>
        <div class="card-price-placeholder"></div>
        <div class="card-footer-placeholder"></div>
      </div>
    </div>
  </section>
  <section v-else class="row my-2">
    <h5 v-if="productsToDisplay.length">
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
  </section>
</template>

<script setup>
import ProductCard from "./ProductCard.vue";
import { computed, ref } from "vue";

const props = defineProps({
  status: {
    type: Object,
    required: true,
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
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  width: 100%;
  max-width: 300px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-img-placeholder,
.card-body-placeholder,
.card-title-placeholder,
.card-text-placeholder,
.card-status-placeholder,
.card-price-placeholder,
.card-footer-placeholder {
  background-color: #e0e0e0;
  color: #c0c0c0;
}

.card-img-placeholder {
  width: 100%;
  height: 180px;
}

.card-body-placeholder {
  padding: 15px;
}

.card-title-placeholder,
.card-text-placeholder {
  height: 20px;
  margin-bottom: 10px;
}

.card-title-placeholder {
  width: 70%;
}

.card-text-placeholder {
  width: 90%;
}

.card-status-placeholder {
  height: 15px;
  width: 50%;
  background-color: #c0c0c0;
  margin-bottom: 10px;
}

.card-price-placeholder {
  height: 20px;
  width: 60%;
  background-color: #c0c0c0;
  margin-bottom: 10px;
}

.card-footer-placeholder {
  height: 15px;
  width: 80%;
  background-color: #c0c0c0;
}

.flashing {
  position: relative;
  overflow: hidden;
}

.flashing:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 70%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shine 1.5s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.message {
  text-align: center;
  font-size: 18px;
  color: #333;
  margin-top: 10px;
}

.bounce {
  animation: ease-in-out infinite bounce 1.78s;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-2px);
  }
}
</style>