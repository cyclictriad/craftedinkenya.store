<script setup>
import axios from "axios";
import moment from "moment";
import { ref } from "vue";

const rmas = ref([]);
const getRMAs = async function () {
  try {
    const { data } = await axios.get("rma");
    rmas.value = data;
  } catch (error) {
    console.error(error);
  }
};

getRMAs();
</script>

<template>
  <div class="row">
    <div
      v-for="rma in rmas"
      :key="rma._id"
      class="mx-lg-2 g-2 py-5 px-4 col-12 col-sm-10 col-md-8 col-lg-6 mb-3 shadow-sm rounded-1 border"
    >
      <div class="mb-2">
        <h6>Customer Info</h6>
        <p>Name: {{ rma.customer.fullName }}</p>
        <p>Email: {{ rma.customer.email }}</p>
        <p>Phone: {{ rma.customer.phoneNumber }}</p>
      </div>
      <hr />
      <div class="mb-2">
        Requesting return for order [{{ rma.order.id }}] placed on
        {{ moment(rma.order.date).format("dddd, do, MMMM, yyyy  HH:MM a") }}
      </div>
      <hr />
      <div class="mb-2">
        <h6>Product Information</h6>
        <p v-for="product in rma.products" :key="product._id" class="my-2">
          Product: {{ product.id }} - Quantity: {{ product.quantity }} - Reason:
          {{ product.reason }} - Condition: {{ product.condition }}
        </p>
      </div>
      <hr />
      <div class="mb-2">
        <h6>Shipping Information</h6>
        <h6> Address:</h6>
        <p v-for="(entry, index) in Object.entries(rma.shipping.address).filter(arr => !arr.join('').includes('_id'))" :key="index">
         
        <strong>{{ entry[0] }}:</strong> <span>{{ entry[1] }}</span>
        </p>
        <p>Label: {{ rma.shipping.label }}</p>
      </div>

      <div class="mb-2" v-if="rma.instructions">
        Other Instructions: {{ rma.instructions }}
      </div>
    </div>
  </div>
</template>

<style>
</style>