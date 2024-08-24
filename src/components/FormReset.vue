<script setup>
import axios from "axios";
import { ref } from "vue";
const props = defineProps({
  email: {
    type: String,
    required: true,
  },
});
const formData = ref({
  email: props.email,
  OTP: "",
  password1: "",
  password2: "",
});

const view = ref({
  password: false,
});

const errors = ref({
    OTP:[],
    password:[]
})

const resetPassword = async function () {
  try {
    await axios.post("reset-password", formData.value);
  } catch {

  }
};
</script>

<template>
  <form
    @submit.prevent="resetPassword"
    class="form col-md-7 col-lg-4 mx-auto rounded shadow-lg py-5 px-4 my-5 text-center"
  >
    <h6 class="text-start">
      We've sent a reset code to <strong>{{ email }}</strong>
    </h6>

    <div class="form-floating input-group mt-3">
      <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
      <input
        v-model="formData.OTP"
        class="form-control"
        type="text"
        name="OTP"
        id="OTP"
        placeholder="Enter the code here"
        aria-placeholder="Enter the code here"
        required
        aria-required="true"
      />
    </div>
    <div class="form-floating my-3 input-group">
      <span class="input-group-text">
        <i class="bi bi-lock-fill"></i>
      </span>
      <input
        v-model="formData.password1"
        class="form-control"
        :type="view.password ? 'text' : 'password'"
        name="password_1"
        id="password-1"
        placeholder="Type your new password"
        aria-placeholder="Enter your new password"
        autocomplete="current-password"
        required
        aria-required="true"
      />
      <span
        v-if="formData.password"
        @click="view.password = !view.password"
        class="input-group-text"
      >
        <i v-if="view.password" class="bi bi-eye-slash"></i>
        <i v-else class="bi bi-eye"></i>
      </span>
    </div>
    <div class="form-floating my-3 input-group">
      <span class="input-group-text">
        <i class="bi bi-lock-fill"></i>
      </span>
      <input
        v-model="formData.password2"
        class="form-control"
        :type="view.password ? 'text' : 'password'"
        name="password_2"
        id="password-2"
        placeholder="Confirm your new password"
        aria-placeholder="Confirm your new password"
        autocomplete="current-password"
        required
        aria-required="true"
      />
      <span
        v-if="formData.password"
        @click="view.password = !view.password"
        class="input-group-text"
      >
        <i v-if="view.password" class="bi bi-eye-slash"></i>
        <i v-else class="bi bi-eye"></i>
      </span>
    </div>
    <button class="btn btn-primary rounded-0 px-5">Reset</button>
    <br />
    <router-link class="my-5" to="/auth/signin">Back to login</router-link>
  </form>
</template>