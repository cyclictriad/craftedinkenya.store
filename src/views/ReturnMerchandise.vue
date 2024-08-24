<script setup>
import axios from "axios";
import { defineAsyncComponent, ref } from "vue";

const AddressForm = defineAsyncComponent({
  loader: () => import("../components/FormAddress.vue"),
});

const status = ref({
  order: {
    loading: false,
    failed: false,
  },
  rma: {
    loading: false,
    failed: false,
  },
});
const otherReason = ref(false);
const wantsReturn = ref(0);
const orderProducts = ref([]);

const sameAddress = ref(false);
const shippingAddressErrors = "";

const agreedToTerms = ref(false);
const formData = ref({
  customer: {},
  order: {},
  products: [],
  shipping: {
    address: {},
    label: "Prepaid",
  },
});

const pushProduct = () => {
  wantsReturn.value++;
  formData.value.products.push({
    id: orderProducts.value[0].id,
    quantity: 0,
    reason: "",
    condition: "",
  });
};
const popProduct = (id) => {
  wantsReturn.value++;
  formData.value.products = formData.value.products.filter(
    (product) => product.id !== id
  );
};

const returnMerchandise = async () => {
  try {
    status.value.rma.failed = false;
    status.value.rma.loading = true;
    await axios.post("/rma", formData.value);
  } catch (error) {
    status.value.rma.failed = true;
  }
  status.value.rma.loading = false;
};
const getOrder = async () => {
  if (formData.value.order.id.length === 24) {
    try {
      status.value.order.failed = false;
      status.value.order.loading = true;
      orderProducts.value = (
        await axios.get(`orders/${formData.value.order.id}`)
      ).data;
      pushProduct();
    } catch (error) {
      status.value.order.failed = true;
    }
    status.value.order.loading = false;
  }
};
</script>
<template>
  <form
    class="watermark col-12 col-sm-9 col-md-8 col-lg-6 mx-auto my-5 shadow-lg px-3 py-5"
    @submit.prevent="returnMerchandise"
  >
    <p class="form-text text-muted text-center">
      Haven't read our returns and exchanges policy?
      <router-link class="theme-text" to="/faqs">Take a look</router-link>
    </p>
    <h5 class="text-center">Return Merchandise Authorization Form</h5>

    <section class="mb-5">
      <h6 class="theme-text">Customer Information</h6>
      <div class="mb-2">
        <label class="form-label" for="name">Full Name</label>
        <input
          type="text"
          v-model="formData.customer.fullName"
          class="form-control"
          id="name"
          name="name"
          required
          aria-required="true"
          autocomplete="name"
        />
      </div>
      <div class="mb-2">
        <label class="form-label" for="email">Email</label>
        <input
          type="email"
          v-model="formData.customer.email"
          class="form-control"
          id="email"
          name="email"
          required
          aria-required="true"
          autocomplete="email"
        />
      </div>
      <div class="mb-2">
        <label class="form-label" for="tel">Phone Number</label>
        <input
          type="tel"
          v-model="formData.customer.phoneNumber"
          name="phone_number"
          class="form-control"
          id="phone"
          autocomplete="tel"
          required
          aria-required="true"
        />
      </div>
    </section>
    <section class="mb-5">
      <h6 class="theme-text">Order Information</h6>
      <div class="mb-2">
        <label class="form-label" for="order-id">Order Number</label>
        <input
          type="text"
          v-model="formData.order.id"
          class="form-control"
          id="order-id"
          name="order_id"
          @input="getOrder"
          required
          aria-required="true"
        />
      </div>
      <div class="mb-2">
        <label class="form-label" for="order-date">Order Date</label>
        <input
          type="date"
          v-model="formData.order.date"
          class="form-control"
          id="order-date"
          name="order_date"
          required
          aria-required="true"
        />
      </div>
      <div class="mb-2">
        <label class="form-label" for="order-secret">Order Secret</label>
        <input
          type="password"
          v-model="formData.order.secret"
          class="form-control secret"
          id="secret"
          name="order_secret"
          required
          aria-required="true"
        />
      </div>
    </section>
    <section class="mb-5">
      <h6 class="theme-text">Product Details</h6>
      <div v-for="(_, index) in wantsReturn" :key="index" class="mb-5">
        <div class="mb-1 input-group">
          <select
            name="product"
            v-model="formData.products[index].id"
            :id="`product-${index}`"
            class="form-select theme-text"
            required
            aria-required="true"
          >
            <option
              v-for="product in orderProducts"
              :value="product.id"
              :key="product.id"
            >
              {{ product.name }}
            </option>
          </select>
          <button
            @click="popProduct(formData.products[index].id)"
            type="button"
            class="btn btn-danger"
          >
            <span class="d-none d-md-inline-block">Remove</span
            ><i class="bi bi-trash"></i>
          </button>
        </div>
        <input
          v-model="formData.products[index].quantity"
          type="text"
          class="form-control"
          id="quantity"
          aria-placeholder="How many?"
          value="0"
        />
        <select
          name="reason"
          v-model="formData.products[index].reason"
          :id="`reason-${index}`"
          class="form-select"
          required
          aria-required="true"
        >
          <option value="">Reason for return</option>
          <option value="Defective">Defective</option>
          <option value="Wrong">Wrong Item</option>
          <option value="Indescribed">Not as Described</option>
        </select>
        <p>
          <input
            type="checkbox"
            v-model="otherReason"
            name="other_reason_check"
            id="other-reason-check"
          />
          Other (please specify)
        </p>
        <textarea
          v-if="otherReason"
          v-model="formData.products[index].reason"
          name="other-reason"
          id="other-reason"
          cols="30"
          rows="3"
          class="form-control mb-2"
        ></textarea>
        <select
          name="product_condition"
          v-model="formData.products[index].condition"
          :id="`condition-${index}`"
          class="form-select"
          required
          aria-required="true"
        >
          <option value="">Condition</option>
          <option value="Unopened">Unopened</option>
          <option value="Used">Used</option>
          <option value="Damaged">Damaged</option>
        </select>
      </div>
      <buttton
        type="button"
        class="btn theme"
        v-if="wantsReturn"
        @click="pushProduct"
        >Add</buttton
      >
    </section>
    <section class="mb-5">
      <h6 class="theme-text">Shipping Address</h6>
      <p>
        <input
          type="checkbox"
          v-model="sameAddress"
          name="changed_address"
          id="changed-address"
        />
        Same as original
      </p>
      <address-form
        v-if="!sameAddress"
        :address="formData.shipping.address"
        :errors="shippingAddressErrors"
      ></address-form>
      <div class="mb-2">
        <label class="form-label" for="tel">Return label</label>
        <select
          name="shipping_label"
          id="shipping-label"
          v-model="formData.shipping.label"
          class="form-select"
          required
          aria-required="true"
        >
          <option value="Prepaid">Include Pre-Paid Return Label</option>
          <option value="Instruct">
            Provide Instructions for Return Shipping
          </option>
        </select>
      </div>
      <p class="form-text" :class="{ 'text-danger': !agreedToTerms }">
        <input
          v-model="agreedToTerms"
          type="checkbox"
          name="agree_terms"
          id="agree-terms"
          required
          aria-required="true"
        />
        I have read and agree to the return policy, including any restocking
        fees and conditions
      </p>
    </section>
    <section class="mb-5">
      <h6 class="theme-text">Additional instructions</h6>
      <textarea
        class="form-control"
        v-model="formData.instrutions"
        name="instructions"
        id="instructions"
        cols="30"
        rows="3"
        placeholder="I wish that...."
        aria-required="false"
      ></textarea>
    </section>
    <div class="my-3 text-center">
      <button type="submit" class="theme">Submit Form</button>
    </div>
  </form>
</template>

<style scoped>
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