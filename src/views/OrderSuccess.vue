<template>
  <div
    class="row justify-content-center align-items-center"
    v-if="status.loading"
    style="width: 100%; height: 100vh"
  >
    <div  style="width: fit-content;">
      <div
        style="
          width: fit-content;
          height: fit-content;
          position: relative;
          margin: 0 auto;
        "
        class="theme-text"
      >
      <img src="../assets/logo.png" width="70" height="70" alt="">
        <div
          class="spinner-border"
          style="position: absolute; left:-5px;top:-5px; width: 80px; height: 80px"
        ></div>
      </div>

      <p class="theme-text">Processing payment</p>
    </div>
  </div>
  <div
    class="row justify-content-center align-items-center"
    v-else-if="status.failed"
    style="width: 100%; height: 100vh"
  >
    <div class="text-danger" style="width: fit-content; text-align: center">
      <i class="bi bi-exclamation-circle-fill fs-1"></i>
      <p>Oops! Could not authorize payment for your order</p>

      <button @click="authorizePayment" class="btn btn-danger">
        Authorize
      </button>
    </div>
  </div>
  <div class="row justify-content-center" v-else>
    <div class="col-md-8 text-center">
      <div class="alert alert-success p-5" role="alert">
        <div class="icon-container mb-4">
          <i class="bi bi-check-circle-fill fs-1 text-success"></i>
        </div>
        <h1 class="alert-heading">Order Placed Successfully!</h1>
        <p class="lead">
          Thank you for your purchase. Your order number is
          <strong>{{ orderId }}</strong>
        </p>
        <hr />
        <p class="mb-0">
          You will receive an email confirmation to
          <strong>{{ email }}</strong> shortly with the order details and
          shipping information.
        </p>
      </div>
      <div class="card shadow-lg mt-4">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <h5 class="card-title">Order Summary</h5>
            <a
              style="font-size: medium; margin-inline: 10px"
              :href="`${BASE_API_URL}/orders/${orderId}/pdf`"
              >Full Summary <i class="bi bi-download"></i
            ></a>
          </div>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
              v-for="item in orderItems"
              :key="item.id"
            >
              <div class="text-start">
                <h6 class="my-0">{{ item.name }}</h6>
                <p>
                  <span class="text-muted ms-0 fw-bolder">
                    <small style="font-weight: normal">{{ currency }}</small>
                    {{ item.unitPrice }}
                  </span>
                  <br />
                  <span class="text-danger"> Units [{{ item.quantity }}] </span>
                </p>
              </div>
              <div>
                <h6>Sub Total</h6>
                <span class="text-danger fw-bolder">{{
                  item.unitPrice * item.quantity
                }}</span>
              </div>
            </li>
          </ul>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <h5>Total</h5>
            <h5>{{ `${orderTotal}|${currency}` }}</h5>
          </div>
          <button @click="goToStore" class="theme mt-3">
            Continue Shopping
          </button>
        </div>
        <div class="card-footer">
          <p class="text-muted">
            Take a look at our returns and exchanges policy
            <router-link to="/faqs">here</router-link>
          </p>
          <p style="font-style: italic">
            <span class="text-muted"
              >powered by {{ serviceProvider }}
              <i class="bi" :class="`bi-${serviceProvider}`"></i
            ></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;
const route = useRoute();
const status = ref({
  loading: false,
  failed: false,
});
const orderId = ref("");
const orderItems = ref([]);
const orderTotal = computed(() =>
  orderItems.value.map((item) => item.unitPrice).reduce((a, b) => a + b)
);
const currency = ref("");
const serviceProvider = ref("");
const email = ref("");

const authorizePayment = async function () {
  try {
    if (status.value.failed) status.value.failed = false;
    status.value.loading = true;
    const { data } = await axios.post(`/orders${route.fullPath}`);
    orderId.value = data.id;
    orderItems.value = data.products;
    currency.value = data.currency.toUpperCase();
    serviceProvider.value = data.poweredBy;
    email.value = data.email;
  } catch (error) {
    status.value.failed = true;
  }
  setTimeout(()=> status.value.loading = false, 1)
};
onBeforeMount(authorizePayment);

const router = useRouter();
const goToStore = () => {
  router.push("/store");
};
</script>

<script>
export default {
  name: "OrderSuccessPage",
};
</script>

<style scoped>
.container {
  max-width: 800px;
}

.icon-container {
  animation: bounceIn 1s;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

.card {
  border-radius: 20px;
}

.alert {
  border-radius: 20px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.shadow-lg {
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
}
button {
  outline: none;
  border: none;
  border-radius: 0.3em;
  padding: 0.3em 0.4em;
}

.theme-text {
  color: #0101b9;
}
.theme {
  background-color: #0101b9;
  color: white;
}

.theme-border {
  border-color: #0101b9;
}

button.theme:hover {
  background-color: #0505e9;
  color: white;
}
</style>

       

