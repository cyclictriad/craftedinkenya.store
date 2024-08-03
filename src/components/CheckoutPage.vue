<template>
  <!-- Modal -->
  <div
    class="modal fade"
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
            
            <form
              class="mx-auto"
              @submit.prevent="checkOut"
            >
              <div class="my-5 form-floating">
                <select
                  v-model="checkoutInfo.mode"
                  name=""
                  id="modeOfPayment"
                  class="form-select pt-4"
                >
                  <option value="paypal" class="p-2">
                    <span>Paypal</span>
                    <span class="text-muted"> powered by </span>
                    <i class="bi bi-paypal"></i>
                  </option>
                  <option value="other" class="p-2">
                    <span>Other</span>
                    <span class="text-muted"> powered by </span>
                    <i class="bi bi-stripe"></i>
                  </option>
                </select>
                <label for="modeOfPayment">Payment Method</label>
              </div>

              <button class="m-3 btn rounded-pill py-2 px-5"
              :class="paymentStatus.isFailed && 'btn-danger' || 'btn-success'"
              :innerHTML=" paymentStatus.isLoading ? `
              <div class='spinner-border spinner-border-sm' role='status'>
              <span class='visually-hidden'>Loading...</span>
              </div>` : paymentStatus.isFailed  ? `<span>Payment failed <i class='bi bi-exclamation-circle-fill'> </i><span>` : `Pay ${totalBill}`
"
              >
              </button>
            </form>

            <PaymentIcons />
          </div>
          <div v-else>Nothing to see here</div>
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
import axios from 'axios'
import {defineAsyncComponent, ref} from 'vue'
import {useStore} from 'vuex'
const PaymentIcons = defineAsyncComponent({
  loader:()=> import('./IconPayment.vue')
})

const store = useStore()

const cartItems = ref(store.state.cart.cartItems)
const totalBill = ref(store.getters.totalBill)

const checkoutInfo = ref({
  cartItems:cartItems.value.map(({id, quantity})=>{
    return {id, quantity}
  }),
  mode:'paypal'
})

const checkOut = async()=>{
  paymentStatus.value.isFailed = false
  paymentStatus.value.isLoading = true
  try{
 const {data} = await axios.post(`orders/create-order`, checkoutInfo.value);
 const {url} = data;
 window.location.href = url
  }catch(error){
    paymentStatus.value.isLoading = false
    paymentStatus.value.isFailed = true
  }
}

const paymentStatus = ref({
  isLoading:false,
  isFailed:false
})



</script>

<script defer>
console.log(' I am defered ')
</script>

<style>
.isLoading{
  width:20px;
  height:20px;
  border-width: 3px 0px;
  border-color:  #f3f3f3;
  border-style: solid;
  border-radius:50%;
  animation:load infinite 1s ease-in-out;
  
}
@keyframes load{
 0%{
  transform: rotate(0deg);
 }
 15%{
  transform: rotate(90deg);
 }
 35%{
  transform: rotate(180deg);
 }
 70%{
  transform: rotate(270deg);
 }
 100%{
  transform: rotate(360deg);
 }
}
</style>
