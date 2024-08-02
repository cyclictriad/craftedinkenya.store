<template>
  <div v-if="product" class="container-fluid text-center">
    <div class="row w-100 py-3 px-2">
      <div class="product-header w-100 px-2">
        <button @click="$router.back()" class="btn btn-outline-danger my-auto">
          <i class="bi bi-arrow-left"></i>
          <span class="mx-2 d-none d-md-inline-block">Back to Store</span>
        </button>
        <h4 class="my-auto fw-bolder">{{ product.name }}</h4>
        <button @click="addToWishList" class="btn btn-outline-success my-auto">
          <span class="mx-2 d-none d-md-inline-block">Add to Wishlist</span>
          <i class="bi bi-bag-heart"></i>
        </button>
      </div>

      <div
        class="product-image col-md-2 px-4"
        style="height: 20%; overflow-x: auto"
      >
        <div class="d-none d-md-block">
          <h5>Product Images</h5>
        </div>
        <div
          @click="currentURL = url"
          v-for="({ url, label }, index) in product.images"
          :key="index"
          class="card-img flex-column"
          style="justify-content: space-between"
        >
          <img
            :src="url"
            class="rounded w-100 img-thumbnail"
            :alt="product.name"
            style="width: auto; height: auto"
          />
          <p class="fw-bolder text-center">{{ label }}</p>
        </div>
      </div>
      <div class="product-info col-md-10 m-0">
        <img :src="currentURL" class="img rounded my-2" :alt="product.name" />

        <h5 class="mt-3 mb-2 fw-bold">Product Description</h5>
        <p class="mb-2" :innerHTML="product.description"></p>
        <div class="d-flex flex-column d-md-block" style="height: 15%">
          <button class="btn btn-warning rounded-pill m-2">
            Current Bill ${{ bill.current }}
          </button>
          <div
            class="d-md-inline-block"
            :class="{
              'border border-2 border-info': budget.exceeded || !budget.isSet,
            }"
          >
            <button
              @click="setBudget"
              :class="{ disabled: bill.willBe === bill.current }"
              class="btn btn-danger rounded-pill m-2 text-wrap"
              :aria-live="(budget.exceeded && 'assertive') || 'polite'"
              aria-haspopup="dialog"
            >
              <span v-if="!budget.exceeded">Will be ${{ bill.willBe }}</span>

              <span v-else>Budget Exceeded</span>
            </button>
          </div>
          <p
            aria-live="polite"
            role="alert"
            v-if="budget.balance && !budget.exceeded"
            class="text-muted"
          >
            Balance: ${{ budget.balance }}
          </p>
          <p aria-live="assertive" v-else class="text-muted">
            Click here to
            <span v-if="budget.isSet">update</span>
            <span v-else>set</span>
            budget
          </p>
        </div>
        <div
          class="d-flex justify-content-center align-items-center col-md-4 mx-auto mt-5"
        >
          <button
            @click="decrementQuantity"
            class="text-center btn btn-primary"
            style="height: 35px; width: 40px; border-radius: 7px 0 0 7px"
          >
            <span>-</span>
          </button>
          <input
            v-model="quantity"
            name="quantity"
            min="1"
            type="number"
            class="form-control text-center fw-bolder outline-0"
            style="height: 35px"
          />
          <button
            :disabled="budget.exceeded"
            @click="incrementQuantity"
            class="btn btn-primary border-0"
            style="height: 35px; width: 40px; border-radius: 0 7px 7px 0"
          >
            +
          </button>
        </div>
        <div style="height: 15%">
          <button
            :disabled="!bill.balance"
            @click="addToCart"
            class="btn btn-primary rounded-pill mt-4"
          >
            <span v-if="bill.balance < 0"> Deduct from Cart</span>
            <span v-else> Add to Cart </span>

            ${{ Math.abs(bill.balance) }}
          </button>
        </div>
      </div>
    </div>
    <router-link
      :to="`/customer-care?pId=${product._id}`"
      class="btn btn-primary shadow-lg m-2 position-fixed end-0 top-50"
    >
      <span class="d-none d-md-inline-block"> Chat Seller </span>
      <i class="bi bi-chat-dots mx-2"></i>
    </router-link>
    <product-reviews :product="product"
      >Customer reviews on {{ product.name }}</product-reviews
    >

    <div v-if="similarProducts.length">
      <h5 class="text-start">More like this</h5>

      <product-card
        v-for="product in similarProducts"
        :key="product.id"
        :product="product"
      ></product-card>
    </div>
    <body-footer></body-footer>
  </div>
</template>



<script setup>
import { getImageUrl } from "../assets";
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { defineAsyncComponent } from "vue";
import axios from "axios";

// Define async components
const ProductReviews = defineAsyncComponent(() =>
  import("../components/ReviewsSect.vue")
);
const ProductCard = defineAsyncComponent(() =>
  import("../components/ProductCard.vue")
);
const BodyFooter = defineAsyncComponent(() =>
  import("../components/FooterComponent.vue")
);

// Define props
const props = defineProps({
  id: String,
});

// Define refs and store
const store = useStore();
const router = useRouter();
const quantity = ref(1);
const product = ref(null);
const currentURL = ref("");

// Computed properties
const similarProducts = computed(() => {
  return store.getters.products
    .filter(
      (p) =>
        p.category === product.value?.category && p.id !== product.value?.id
    )
    .sort((a, b) => b.sales - a.sales);
});

const isInCart = computed(() => {
  return (
    product.value &&
    store.state.cart.cartItems.find((p) => product.value.id === p.id)
  );
});

const bill = computed(() => {
  const currentBill = store.getters.totalBill;
  const itemTotal =
    ((!isInCart.value && quantity.value) ||
      quantity.value - isInCart.value?.quantity) * product.value?.sp;
  return {
    current: currentBill,
    balance: itemTotal,
    willBe: currentBill + itemTotal,
  };
});

const budget = computed(() => {
  const budget = store.getters.budget;
  const willBe = bill.value.willBe;
  return {
    isSet: budget,
    exceeded: budget && willBe > budget,
    balance: budget && budget - willBe,
  };
});

// Methods
const incrementQuantity = () => {
  quantity.value++;
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const fetchProduct = async () => {
  const url = `products/${props.id}`;
  const response = await axios(url);
  product.value = response.data;
  currentURL.value = product.value.images[0].url;

  const cartProduct = store.state.cart.cartItems.find(
    (p) => product.value.id === p.id
  );

  if (cartProduct) {
    quantity.value = cartProduct.quantity;
  }
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
  if (budget) {
    store.dispatch("setBudget", budget);
  }
};

const addToWishList = async function () {
  try {
    await axios.patch(`auth/profile?wishList=${props.id}`)
  } catch (error) {}
};
// Watchers
watch(() => props.id, fetchProduct);

// Lifecycle hooks
onMounted(fetchProduct);
</script>
<style scoped>
.quantity button {
  width: 30px;
  height: 30px;
}

.quantity span {
  font-size: 18px;
  font-weight: bold;
}
.form-control {
  outline: none;
  border-radius: 0;
}

.product-header {
  min-height: fit-content;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  flex-direction: row;
}
@media (max-width: 768px) {
  .product-image {
    display: flex;
    flex-direction: row;
  }
  .product-image .card-img {
    width: 33%;
    height: auto;
    margin: 0 5px;
  }
  .product-info .img {
    width: 100%;
  }
}
@media (min-width: 768px) {
  .product-info .img {
    width: 50%;
  }
}
</style>