<template>
    <div class="row justify-content-center">
      <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"> -->
    <p v-if="!res">Waiting for response...</p>
    <div v-else>

      <div class="col-md-8 text-center">
        <div class="alert alert-success p-5" role="alert">
          <div class="icon-container mb-4">
            <i class="fas fa-check-circle fa-5x text-success"></i>
          </div>
          <h1 class="alert-heading">Order Placed Successfully!</h1>
          <p class="lead">Thank you for your purchase. Your order number is <strong>{{ orderNumber }}</strong>.</p>
          <hr>
          <p class="mb-0">You will receive an email confirmation shortly with the order details and shipping information.</p>
        </div>
        <div class="card shadow-lg mt-4">
          <div class="card-body">
            <h5 class="card-title">Order Summary</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center" v-for="item in orderItems" :key="item.id">
                <div>
                  <h6 class="my-0">{{ item.name }}</h6>
                  <small class="text-muted">{{ item.description }}</small>
                </div>
                <span class="text-muted">{{ `${item.price}|${currency}` }}</span>
              </li>
            </ul>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <h5>Total</h5>
              <h5>{{ `${orderTotal}|${currency}` }}</h5>
            </div>
            <button @click="goToStore" class="btn btn-primary mt-3">Continue Shopping</button>
          </div>
          <div class="card-footer">
            <span class="text-muted">powered by {{  }}</span>
          </div>
        </div>
      </div>
    </div>
    </div>

  
  
</template>

<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
const route = useRoute();
const res = ref(null);

onBeforeMount(async function () {
  res.value = (await axios.post(`/orders${route.fullPath}`)).data;
});
const link = document.createElement('link')
link.rel = "stylesheet",
link.href ="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
// Example order data (replace with actual data from your store or API)
const orderNumber = ref("123456");
const orderItems = ref([
  {
    id: 1,
    name: "Product 1",
    description: "Description for product 1",
    price: 29.99,
  },
  {
    id: 2,
    name: "Product 2",
    description: "Description for product 2",
    price: 49.99,
  },
]);
const orderTotal = computed(() =>
  orderItems.value.reduce((total, item) => total + item.price, 0)
);

const currency = ref('USD')
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
</style>

       

