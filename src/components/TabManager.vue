<template>
  <div class="row">
    <h5 class="fw-bolder">Profile Information</h5>

    <div v-if="profile" class="form-floating input-group my-5">
      <input v-model="profile.address" type="text" class="form-control" />
      <span class="input-group-text">
        <i class="bi bi-house"></i>
      </span>
      <label for="address">Address</label>
    </div>
    <div class="my-2 d-flex justify-content-space-between col-md-6 mx-auto">
      <img
        :src="getImageUrl(`logo.png`)"
        class="rounded-circle"
        style="max-height: 30vh"
      />

      <div class="position-relative w-25">
        <button class="btn btn-success position-absolute top-50 text-nowrap">
          Change Logo
          <i class="bi bi-cloud-arrow-up-fill"></i>
        </button>
      </div>
    </div>
    <div class="col-md-9 mx-auto mb-2">
      <h5 class="text-start text-danger">Ad manager</h5>
      <div v-if="ads.existing && ads.existing.length" class="ads">
        <div
          v-for="ad in ads.existing"
          :key="ad"
          class="d-flex flex-row align-items-center p-3 py-auto my-2 fw-bolder rounded-2 shadow-lg"
          style="justify-content: space-between"
        >
          <p class="text-start" :innerHTML="ad.ad"></p>
          <button @click.prevent="deleteAd(ad.id)" class="btn text-danger">
            <span>Delete</span>
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <div
        class="input-group my-3 border border-success rounded-2"
        style="height: 50px"
      >
        <input
          v-model="ads.new.text"
          placeholder="Ad html..."
          class="form-control"
        />
        <input
          v-model="ads.new.valid"
          placeholder="Ad valid for days?"
          class="form-control"
        />
        <button
          @click="ads.new.text && ads.new.valid && postAd()"
          class="btn btn-outline-success"
        >
          Run ad
        </button>
      </div>

      <div class="col-md-9 mx-auto my-3">
        <h5>Social links</h5>
        <form v-if="profile" @submit.prevent="postProfile">
          <div class="form-floating my-5 input-group">
            <input
              v-model="profile.email"
              type="email"
              class="form-control"
              placeholder="Enter email adress..."
              aria-placeholder="Enter email adress"
            />
            <span class="input-group-text">
              <i class="bi bi-inbox"></i>
            </span>
            <label for="">Email</label>
          </div>
          <div class="form-floating my-5 input-group">
            <input
              v-model="profile.phone"
              type="text"
              class="form-control"
              placeholder="Enter phone number..."
              aria-placeholder="Enter phone number"
            />
            <span class="input-group-text">
              <i class="bi bi-telephone-fill"></i>
            </span>
            <label for="phone">Phone Number</label>
          </div>
          <div class="form-floating my-5 input-group">
            <input
              v-model="profile.facebook"
              type="text"
              class="form-control"
              placeholder="Enter facebook page..."
              aria-placeholder="Enter facebook page"
            />
            <span class="input-group-text">
              <i class="bi bi-facebook"></i>
            </span>
            <label for="">Facebook</label>
          </div>
          <div class="form-floating my-5 input-group">
            <input
              v-model="profile.instagram"
              type="text"
              class="form-control"
              id="instagram"
              placeholder="Enter instagram..."
              aria-placeholder="Enter instagram"
            />

            <span class="input-group-text">
              <i class="bi bi-instagram"></i>
            </span>
            <label for="">Instagram</label>
          </div>
          <div class="form-floating my-5 input-group">
            <input
              v-model="profile.x"
              type="text"
              class="form-control"
              placeholder="Enter X dashboard..."
              aria-placeholder="Enter X dashboard"
            />
            <span class="input-group-text">
              <i class="bi bi-twitter-x"></i>
            </span>
            <label for="">Twitter</label>
          </div>
          <div class="form-floating my-5 input-group">
            <input
              v-model="profile.tiktok"
              type="text"
              class="form-control"
              placeholder="Enter tiktok..."
              aria-placeholder="Enter tiktok"
            />
            <span class="input-group-text">
              <i class="bi bi-tiktok"></i>
            </span>
            <label for="">Tiktok</label>
          </div>
          <div class="form-floating my-5 input-group">
            <input
              v-model="profile.pinterest"
              type="text"
              class="form-control"
              placeholder="Enter pinterest..."
              aria-placeholder="Enter pinterest"
            />
            <span class="input-group-text">
              <i class="bi bi-pinterest"></i>
            </span>
            <label for="">Pinterest</label>
          </div>
          <div class="form-floating my-5 input-group">
            <input
              v-model="profile.youtube"
              type="text"
              class="form-control"
              placeholder="Enter youtube channel..."
              aria-placeholder="Enter youtube channel"
            />
            <span class="input-group-text">
              <i class="bi bi-youtube"></i>
            </span>
            <label for="">Youtube Channel</label>
          </div>
          <button class="btn btn-primary">Update info</button>
        </form>
        <div v-else class="col-md-9 p-5">
          <p>Loading profile...</p>
        </div>
      </div>
    </div>

    <div class="users">
      <h5>
        Manage users
        <i class="bi bi-people-fill"></i>
      </h5>
      
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { getImageUrl } from '../assets';

const ads = ref({
  existing: null,
  new: {
    text: null,
    valid: null,
  },
});
const profile = ref(null);

const fetchAds = async function () {
  const response = await axios("/ads");
  ads.value.existing = response.data;
};
const postAd = async function () {
  await axios.post("/ads", ads.value.new);
  fetchAds();
};
const deleteAd = async function (id) {
  await axios.delete(`/ads/${id}`);
  fetchAds();
};
const fetchProfile = async function () {
  profile.value = (await axios("/profile")).data;
};
const postProfile = async function () {
  await axios.patch("profile", profile.value);
  fetchProfile();
};

fetchAds();
requestIdleCallback(fetchProfile);
</script>