<template>
  <div
    class="modal fade text-center"
    id="checkOut"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">Checkout</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="cartItems.length">
            <table
              class="table table-responsive text-center table-bordered table-success border-primary table-striped table-hover"
            >
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Totals</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cartItems" :key="item.id">
                  <td class="position-relative">
                    <i
                      @click="$store.dispatch('removeFromCart', `${item.id}`)"
                      class="bi bi-trash position-absolute"
                      style="left: 0"
                    ></i>
                    {{ item.name }}
                  </td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.quantity * item.sp }}</td>
                </tr>
              </tbody>
            </table>
            <h6 class="my-3 text-start">Shipping address Information</h6>
            <address-form
              :address="shippingAddress"
              :errors="addressErrors"
            ></address-form>

            <form class="mx-auto" @submit.prevent="checkOut">
              
              <div class="my-5 form-floating">
                <select
                  v-model="paymentMethod"
                  name=""
                  id="modeOfPayment"
                  class="form-select pt-4"
                >
                  <option class="p-2" value="" selected>
                    Choose payment method
                  </option>
                  <option value="card" class="p-2">Credit/Debit card</option>
                  <option value="paypal" class="p-2">Paypal</option>
                  <option value="apple" class="p-2">Apple Pay</option>
                  <option value="google" class="p-2">Google Pay</option>
                  <option value="bnpl" class="p-2">
                    Buy Now Pay Later (BNPL)
                  </option>
                </select>
                <label for="modeOfPayment"
                  >Payment Method <sup class="text-danger mt-2"> * </sup></label
                >
              </div>
              <div class="my-5 form-floating">
                <select
                  v-model="poweredBy"
                  name="service_provider"
                  id="service-provider"
                  class="form-select pt-4"
                >
                  <option class="p-2" value="" selected>
                    Choose your preffered payment provider
                  </option>
                  <option value="stripe" class="p-2">Stripe</option>
                  <option value="paypal" class="p-2">Paypal</option>
                </select>
                <label for="service-provider">Service Provider</label>
              </div>
              <div
                v-for="(error, index) in errors"
                :key="index"
              >
              <div class="my-2 bg-danger-subtle text-start px-2 py-1" :innerHTML = "` <i class='bi bi-x-circle-fill text-danger mx-2'></i>
                <span> ${error.error}</span>`">

              </div>
              <div class="my-2 bg-success-subtle text-start px-2 py-1" :innerHTML = "` <i class='bi bi-lightbulb text-warning mx-2'></i>
                <span> ${error.tip}</span>`">

              </div>
               
              </div>
              <button
                class="m-3 btn rounded-pill py-2 px-5"
                :class="{
                  'btn-danger': status.failed,
                  'btn-success': !status.failed,
                }"
                :disabled="status.loading"
                :aria-disabled="status.loading"
              >
                <div
                  v-if="status.loading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                <span v-else-if="status.failed"
                  >Payment failed <i class="bi bi-exclamation-circle-fill"></i
                ></span>


                <span v-else>Pay ${{ totalBill }}</span>
              </button>
            </form>

            <PaymentIcons />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { defineAsyncComponent, ref, watch } from "vue";
import { useStore } from "vuex";
const AddressForm = defineAsyncComponent({
  loader: () => import("./FormAddress.vue"),
});
const PaymentIcons = defineAsyncComponent({
  loader: () => import("./IconPayment.vue"),
});
const store = useStore();
const cartItems = ref(store.state.cart.cartItems);
const shippingAddress = ref({});
const poweredBy = ref("");
const paymentMethod = ref("");
const totalBill = ref(store.getters.totalBill);
const errors = ref([]);
const addressErrors = ref("");
const checkOut = async () => {
  status.value.failed = false;
  status.value.loading = true;
  try {
    console.log({shippingAddress:shippingAddress.value})
    const { data } = await axios.post(`orders/create-order`, {
      cartItems: cartItems.value.map(({ id, quantity }) => ({ id, quantity })),
      shippingAddress: shippingAddress.value,
      poweredBy: poweredBy.value,
      paymentMethod: paymentMethod.value,
    });
    const { url } = data;
    window.location.href = url;
  } catch (error) {
    if (error && error.response) {
      const {data} =  error.response
      errors.value = data.errors;
      if(data.addressErrors) addressErrors.value = data.addressErrors 
      else addressErrors.value = "";
      
    }
    status.value.failed = true;
  }
  status.value.loading = false;
};

const status = ref({
  loading: false,
  failed: false,
});

watch(paymentMethod, function(){
    if(paymentMethod.value === 'paypal'){
      poweredBy.value = 'paypal'
    }else{
      poweredBy.value = 'stripe'
    }
  
})
</script>

<style>
</style>
