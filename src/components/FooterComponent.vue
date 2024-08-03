<template>
  <footer class="bg-light py-5 text-center">
    <div class="container">
      <!-- Row 1: Get in Touch & Go to Top -->
      <div class="row mb-4">
        <div class="col-md-6">
          <h5 class="mb-3">Get In Touch</h5>
          <div class="d-flex flex-wrap">
            <p class="p-1"><i class="bi bi-chat-dots p-1"></i>24/7 Live Chat</p>
            <p class="p-1" v-if="profile && profile.phone">
              <i class="bi bi-telephone p-1"></i>{{ profile.phone }}
            </p>
            <p class="p-1" v-if="profile && profile.email">
              <i class="bi bi-envelope p-1"></i>{{ profile.email }}
            </p>
            <p v-if="profile && profile.address">
              <i class="bi bi-geo-alt mr-2"></i>{{ profile.address }}
            </p>
          </div>
        </div>
        <div class="col-md-6 text-md-right mt-3 mt-md-0">
          <button class="btn btn-primary" @click="goToTop">
            Scroll to Top
          </button>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-md-3 mb-4 mb-md-0">
          <img
            src="./../assets/logo.png"
            alt="Crafted in Kenya Logo"
            class="footer-logo"
          />
        </div>
        <div class="col-md-3">
          <h5 class="mb-3">Quick Links</h5>
          <ul class="list-unstyled">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Sell with Crafted in Kenya</a></li>
            <li><a href="#">Seller Login</a></li>
            <li><a href="#">Customer Reviews</a></li>
            <li><a href="#">Affiliates & Influencers</a></li>
            <li><a href="#">Become a Brand Ambassador</a></li>
            <li><a href="#">Sitemap</a></li>
          </ul>
        </div>
        <div class="col-md-3">
          <h5 class="mb-3">Customer Happiness</h5>
          <ul class="list-unstyled">
            <li><a href="#">Track your Order</a></li>
            <li><a href="/faqs?target=returns">Returns & Exchanges</a></li>
            <li><a href="/faqs?target=privacy">Privacy Policy</a></li>
            <li><a href="/customer-care">Contact Us</a></li>
            <li><a href="#">Accessibility</a></li>
          </ul>
        </div>
        <div class="col-md-3">
          <h5 class="mb-3">Sign Up For Exclusive Deals & Offers</h5>
          <form @submit.prevent="subscribeEmail">
            <div class="form-group">
              <input
                v-model="email"
                type="email"
                class="form-control"
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" class="mt-2 btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-md-6">
          <SocialIcons />
        </div>
        <div class="col-md-6">
          <PaymentIcons />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <p>&copy; {{ new Date().getFullYear() }} - Crafted in Kenya</p>
        </div>
        <div class="col-md-6">
          <ul class="list-inline text-md-right">
            <li class="list-inline-item">
              <a href="#">Website Accessibility Policy</a>
            </li>
            <li class="list-inline-item"><a href="#">DMCA</a></li>
            <li class="list-inline-item"><a href="#">Terms of Service</a></li>
            <li class="list-inline-item"><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
  

  <script setup>
import axios from "axios";
import { defineAsyncComponent, ref } from "vue";
const PaymentIcons = defineAsyncComponent({
  loader: () => import("./IconPayment.vue"),
});
const SocialIcons = defineAsyncComponent({
  loader: () => import("./IconSocial.vue"),
});
const email = ref(null);
const profile = ref(null);
const fetchProfile = async () => {
  profile.value = (await axios("profile")).data;
};
const subscribeEmail = async () => {
  try {
    await axios.post(`emails`, {
      email: email.value,
    });
    alert(
      " Successfully added to our email list.\n You will receive weeekly updates"
    );
  } catch (error) {
    alert(error);
  }
};
const goToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
requestIdleCallback(fetchProfile);
</script>
  
  <style scoped>
  .footer-logo {
  max-width: 150px; /* Adjust the maximum width as needed */
  height: auto; /* Allow the height to adjust proportionally */
}
</style>
  