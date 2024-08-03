<template>
  <div class="container my-5">
    <h3 class="text-center">Create your shop</h3>
    <form @submit.prevent="createShop(inputDetails)" class="row g-3">
      <div class="col-md-6">
        <label for="shopName" class="form-label">Shop Name</label>
        <input
          v-model="inputDetails.name"
          type="text"
          id="shopName"
          class="form-control"
          placeholder="Enter your shop name"
          required
        />
      </div>
      <div class="col-md-6">
        <label for="email" class="form-label">Email</label>
        <input
          v-model="inputDetails.email"
          type="email"
          id="email"
          class="form-control"
          placeholder="Enter your email address"
          required
        />
      </div>

      <div class="col-12">
        <h5>Payment Methods</h5>
      </div>
      <div class="col-md-4">
        <div class="form-check">
          <input
            type="checkbox"
            v-model="inputDetails.paypal"
            id="paypal"
            class="form-check-input"
          />
          <label for="paypal" class="form-check-label">PayPal</label>
        </div>
        <div v-if="inputDetails.paypal" class="mt-2">
          <label for="paypalEmail" class="form-label">PayPal Email</label>
          <input
            v-model="inputDetails.paypalEmail"
            type="email"
            id="paypalEmail"
            class="form-control"
            placeholder="Enter your PayPal email"
          />
        </div>
      </div>
      <div class="col-md-4">
        <div class="form-check">
          <input
            type="checkbox"
            v-model="inputDetails.mpesa"
            id="mpesa"
            class="form-check-input"
          />
          <label for="mpesa" class="form-check-label">Mpesa</label>
        </div>
        <div v-if="inputDetails.mpesa" class="mt-2">
          <label for="mpesaPhone" class="form-label">Phone Number</label>
          <input
            v-model="inputDetails.mpesaPhone"
            type="text"
            id="mpesaPhone"
            class="form-control"
            placeholder="Enter your Mpesa phone number"
          />
        </div>
      </div>
      <div class="col-md-4">
        <div class="form-check">
          <input
            type="checkbox"
            v-model="inputDetails.bank"
            id="bank"
            class="form-check-input"
          />
          <label for="bank" class="form-check-label">Credit Card</label>
        </div>
        <div v-if="inputDetails.bank" class="mt-2">
          <label for="creditNumber" class="form-label">Account Number</label>
          <input
            v-model="inputDetails.creditNumber"
            type="text"
            id="creditNumber"
            class="form-control"
            placeholder="Enter your credit card account number"
          />
        </div>
      </div>

      <div class="col-12 mt-4">
        <button type="submit" class="btn btn-success" aria-label="Add Shop">
          Add Shop
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useStore } from "vuex";
const emit  = defineEmits(["shop-created"]);
const store = useStore();
const inputDetails = ref({
  name: "",
  email: store.getters.GET_USER?.email,
  paypal: false,
  mpesa: false,
  bank: false,
  paypalEmail: store.getters.GET_USER?.email,
  mpesaPhone: "",
  creditNumber: "",
});

const createShop = async function (details) {
  try {
    let shopDetails = {
      name: details.name,
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      paymentOptions: [],
    };

    if (details.paypal) {
      shopDetails.paymentOptions.push({
        paypal: {
          email: details.paypalEmail,
        },
      });
    }
    if (details.mpesa) {
      shopDetails.paymentOptions.push({
        "M-Pesa": {
          phone: details.mpesaPhone,
        },
      });
    }
    if (details.bank) {
      shopDetails.paymentOptions.push({
        bank: {
          account: details.creditNumber,
        },
      });
    }
    await axios.post(`shop`, {
      details: shopDetails,
    });
    emit("shop-created");
  } catch (error) {
    alert(error);
  }
};
</script>