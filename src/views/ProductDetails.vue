<template>
  <div v-if="product" class="container-fluid text-center py-4 px-0 bg-light">
    <div class="row w-100 m-0">
      <!-- Header -->
      <div class="product-header w-100 sticky-top bg-white shadow-sm py-3 px-4 d-flex align-items-center justify-content-between">
        <button @click="$router.back()" class="btn btn-outline-danger d-flex align-items-center gap-2">
          <i class="bi bi-arrow-left"></i>
          <span class="d-none d-md-inline">Back to Store</span>
        </button>
        <h4 class="my-auto fw-bold text-truncate">{{ product.name }}</h4>
        <button @click="addToWishList" class="btn btn-outline-success d-flex align-items-center gap-2">
          <span class="d-none d-md-inline">Add to Wishlist</span>
          <i class="bi bi-bag-heart"></i>
        </button>
      </div>

      <!-- Product Images Thumbnails -->
      <div class="product-image-thumbnails col-md-3 d-flex flex-column align-items-center border-end pt-4 pb-2">
        <h5 class="mb-3 text-center d-none d-md-block">Product Images</h5>
        <div
          v-for="({ url, label }, index) in product.images"
          :key="index"
          @click="currentURL = url"
          :class="{ 'selected-thumbnail': currentURL === url }"
          class="image-thumbnail mb-3"
          :style="{ backgroundImage: `url(${url})` }"
        ></div>
      </div>

      <!-- Product Info Section -->
      <div class="product-info col-md-9 py-4 px-3">
        <!-- Main Image -->
        <div class="text-center mb-4">
          <img :src="currentURL" class="img-fluid rounded product-main-img shadow" :alt="product.name" />
        </div>

        <!-- Product Description -->
        <div class="text-start mb-3">
          <h5 class="fw-bold mb-3">Product Description</h5>
          <p v-html="product.description" class="text-muted"></p>
        </div>

        <!-- Price & Budget Controls -->
        <div class="d-flex flex-wrap align-items-center justify-content-start gap-3 mt-3">
          <button class="btn btn-warning fw-semibold rounded-pill px-4 py-2 shadow-sm">
            Current Bill ${{ bill.current }}
          </button>
          <button
            @click="setBudget"
            :class="['btn', 'rounded-pill', budget.exceeded ? 'btn-danger' : 'btn-primary', 'px-4', 'py-2', 'shadow-sm']"
          >
            <span v-if="!budget.exceeded">Will be ${{ bill.willBe }}</span>
            <span v-else>Budget Exceeded</span>
          </button>
          <p v-if="budget.balance && !budget.exceeded" class="text-muted small">Balance: ${{ budget.balance }}</p>
          <p v-else class="text-muted small">Click to set or update budget</p>
        </div>

        <!-- Quantity Controls -->
        <div class="quantity-controls d-flex align-items-center justify-content-center mt-4 gap-2">
          <button @click="decrementQuantity" class="btn btn-outline-secondary quantity-btn">-</button>
          <input
            v-model="quantity"
            type="number"
            min="1"
            class="form-control text-center fw-bold quantity-input"
          />
          <button @click="incrementQuantity" class="btn btn-outline-secondary quantity-btn">+</button>
        </div>

        <!-- Add to Cart Button -->
        <button
          @click="addToCart"
          :disabled="!bill.balance"
          class="btn btn-primary rounded-pill px-4 py-3 mt-4 w-100 shadow"
        >
          <span v-if="bill.balance < 0">Deduct from Cart</span>
          <span v-else>Add to Cart</span> ${{ Math.abs(bill.balance) }}
        </button>
      </div>
    </div>

    <!-- Similar Products Section -->
    <div v-if="similarProducts.length" class="similar-products py-4 mt-5 bg-white rounded shadow-sm">
      <h5 class="text-start px-3 mb-3">More like this</h5>
      <div class="d-flex flex-wrap justify-content-start px-3 gap-4">
        <product-card v-for="product in similarProducts" :key="product.id" :product="product" />
      </div>
    </div>

    <body-footer class="mt-5"></body-footer>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { defineAsyncComponent } from "vue";
import axios from "axios";

const ProductReviews = defineAsyncComponent(() => import("../components/ReviewsSect.vue"));
const ProductCard = defineAsyncComponent(() => import("../components/ProductCard.vue"));
const BodyFooter = defineAsyncComponent(() => import("../components/FooterComponent.vue"));

const props = defineProps({ id: String });
const store = useStore();
const router = useRouter();
const quantity = ref(1);
const product = ref(null);
const currentURL = ref("");

const isInCart = computed(() => store.state.cart.cartItems.find(p => product.value && product.value.id === p.id));

const similarProducts = computed(() => store.getters.products
    .filter(p => p.category === product.value?.category && p.id !== product.value?.id)
    .sort((a, b) => b.sales - a.sales)
);

const bill = computed(() => {
  const currentBill = store.getters.totalBill;
  const itemTotal = ((!isInCart.value && quantity.value) || quantity.value - isInCart.value?.quantity) * product.value?.sp;
  return { current: currentBill, balance: itemTotal, willBe: currentBill + itemTotal };
});

const budget = computed(() => {
  const budget = store.getters.budget;
  const willBe = bill.value.willBe;
  return { isSet: budget, exceeded: budget && willBe > budget, balance: budget && budget - willBe };
});

const incrementQuantity = () => quantity.value++;
const decrementQuantity = () => { if (quantity.value > 1) quantity.value--; };

const fetchProduct = async () => {
  const url = `products/${props.id}`;
  const response = await axios(url);
  product.value = response.data;
  currentURL.value = product.value.images[0].url;
};

const addToCart = () => {
  store.dispatch("addToCart", {
    id: product.value.id,
    name: product.value.name,
    quantity: quantity.value,
    sp: product.value.sp,
  });
  router.push("/store");
};

const setBudget = () => {
  const budget = prompt("Set your budget in dollars");
  if (budget) store.dispatch("setBudget", budget);
};

const addToWishList = async () => {
  try { await axios.patch(`auth/profile?wishList=${props.id}`); } catch (error) {}
};

watch(() => props.id, fetchProduct);
onMounted(fetchProduct);
</script>

<style scoped>
.product-header {
  background: #ffffff;
}

.product-image-thumbnails {
  max-width: 200px;
  padding: 1rem;
}

.image-thumbnail {
  width: 80px;
  height: 80px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.image-thumbnail:hover {
  transform: scale(1.1);
}
.selected-thumbnail {
  border: 2px solid #0d6efd;
}

.product-main-img {
  width: 100%;
  max-width: 600px;
}

.quantity-controls .quantity-btn {
  width: 40px;
  height: 40px;
}

.quantity-input {
  width: 60px;
}

.similar-products {
  background: #ffffff;
  border-radius: 8px;
}
</style>
