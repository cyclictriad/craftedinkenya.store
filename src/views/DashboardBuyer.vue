
<script setup>
import { formatDate } from "../Mixins";
import axios from "axios";
import { defineAsyncComponent, ref, watch } from "vue";
import { useStore } from "vuex";
const orders = ref(null);
const store = useStore();
const AddressForm = defineAsyncComponent({
  loader: () => import("../components/FormAddress.vue"),
});
const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

const imageSelector = ref(null);
const sendOTP = ref(false);
const notifyMe = ref(false);
const address_list = ref([]);
const paymentMethods_list = ref([]);
const verified = ref(false);
const newOrder = ref(null);
const wantsDeleteUser = ref(false);
const reviews = ref(null);
const wishList = ref(null);
const card = ref(null);
const paypal = ref(null);

const selectImage = () => imageSelector.value.click();
const password = ref(null);
const profile = ref({
  name: "",
  avatar: "",
  nickname: "",
  email: "",
  phone: "",
});
const status = ref({
  password: {
    loading: false,
    failed: false,
    verifying: false,
    updating: false,
    updated: false,
  },
  avatar: {
    loading: false,
    progress: 0,
    url: null,
    failed: false,
  },
  address: {
    loading: false,
    failed: false,
  },
  reviews: {
    loading: false,
    failed: false,
  },
  deleteUser: {
    loading: false,
    failed: false,
    success: false,
  },
  payment: {
    loading: false,
    failed: false,
  },
  orders: {
    loading: false,
    failed: false,
    paste: {
      failed: false,
      loading: false,
    },
  },
});

const shippingAddress = ref({});
const payment_input = ref({});
const uploadImage = async function () {
  try {
    const file = imageSelector.value.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      status.value.avatar.url = e.target.result;
    };
    reader.readAsDataURL(file);
    const formData = new FormData();
    formData.append("avatar", file);
    status.value.avatar.failed = false;
    status.value.avatar.loading = true;
    await axios.post(`uploads/avatar`, formData, {
      onUploadProgress: function (e) {
        status.value.avatar.progress = Math.round((e.loaded / e.total) * 100);
      },
    });
    await fetchProfile();
  } catch (error) {
    status.value.avatar.failed = true;
  }
  status.value.avatar.loading = false;
};
const deleteImage = async function () {
  if (!profile.value.avatar) return;
  try {
    await axios.delete(`uploads`);
  } catch (error) {}
};
const fetchOrders = async function () {
  try {
    status.value.orders.loading = true;
    status.value.orders.failed = false;
    const response = await axios(`orders`);
    orders.value = response.data;
  } catch (err) {
    status.value.orders.failed = true;
    console.error(err);
  }
  status.value.orders.loading = false;
};

const fetchProfile = async function () {
  try {
    const { data } = await axios.post(`auth/profile`);
    profile.value = {
      name: data.name,
      avatar: data.avatar,
      nickname: data.nickname,
      email: data.email,
      phone: data.phone,
    };
    sendOTP.value = data.sendOTP;
    notifyMe.value = data.notifyMe;
    address_list.value = data.address.map(({ _id, ...address }) => {
      return {
        _id,
        address: Object.values(address).reduce((a, b) => `${a}, ${b}`),
      };
    });
    paymentMethods_list.value = data.paymentMethods;
    wishList.value = data.wishList;
    watch(
      sendOTP,
      async () => await axios.patch(`auth/profile?sendOTP=${sendOTP.value}`)
    );
    watch(
      notifyMe,
      async () => await axios.patch(`auth/profile?notifyMe=${notifyMe.value}`)
    );
  } catch (error) {
    console.error(error);
  }
};

const updateProfile = async function () {
  try {
    profile.value.edit = !profile.value.edit;
    if (!profile.value.edit) {
      await axios.patch(`auth/profile`, { profile: profile.value });
    } else return;
  } catch (error) {}
};
const verify = async function () {
  try {
    status.value.password.failed = false;
    status.value.password.updating = false;
    status.value.password.loading = true;
    status.value.password.verifying = true;

    await axios.post(`auth/verify`);
    verified.value = true;
    status.value.password.verifying = false;
  } catch (error) {
    status.value.password.failed = true;

    console.error(error);
  }
  status.value.password.loading = false;
};

const deleteUser = async function () {
  try {
    if (!wantsDeleteUser.value) {
      wantsDeleteUser.value = true;
    } else {
      status.value.deleteUser.failed = false;
      status.value.deleteUser.loading = true;
      await axios.post(`auth/delete`, {
        password: btoa(encodeURIComponent(password.value)),
      });
      wantsDeleteUser.value = false;
      status.value.deleteUser.success = true;
    }
  } catch (error) {
    status.value.deleteUser.failed = true;
  }
  status.value.deleteUser.loading = false;
};
const pushAddress = async function () {
  if (shippingAddress.value.edit) {
    if (Object.values(shippingAddress.value).some((value) => !value)) return;
    try {
      status.value.address.failed = false;
      status.value.address.loading = true;
      await axios.patch(`auth/profile`, { address: shippingAddress.value });
    } catch (error) {
      status.value.address.failed = true;
    }
    status.value.address.loading = false;
  }
  shippingAddress.value.edit = !shippingAddress.value.edit;
};
const popAddress = async function (id) {
  try {
    await axios.delete(`auth/profile?address=${id}`);
    fetchProfile();
  } catch (error) {}
};
const changePassword = async function () {
  try {
    if (!verified.value) {
      return await verify();
    } else {
      status.value.password.failed = false;
      status.value.password.verifying = false;
      status.value.password.loading = true;
      status.value.password.updating = true;

      await axios.patch(`auth/profile`, {
        password: password.value,
      });
      status.value.password.updating = false;
      status.value.password.updated = true;
      verified.value = false;
    }
  } catch (error) {
    status.value.password.failed = true;
  }
  status.value.password.loading = false;
};
const logout = function () {
  store.dispatch("logout");
};
const pasteOrder = async function () {
  try {
    status.value.orders.paste.failed = false;
    status.value.orders.paste.loading = true;
    await axios.post("orders/paste", { orderId: newOrder.value });

    await fetchOrders();
  } catch (error) {
    status.value.orders.paste.failed = true;
  }
  status.value.orders.paste.loading = false;
};
const fetchReviews = async function () {
  try {
    status.value.reviews.failed = false;
    status.value.reviews.loading = true;
    const response = await axios(`reviews?self=${true}`);
    reviews.value = response.data;
  } catch (error) {
    status.value.reviews.failed = true;
  }
  status.value.reviews.loading = false;
};

const deleteReview = async function (id) {
  try {
    await axios.delete(`reviews/${id}`);
    fetchReviews();
  } catch (error) {}
};

const popWishList = async function (id) {
  try {
    await axios.delete(`auth/profile?wishList=${id}`);
    fetchProfile();
  } catch (error) {}
};

fetchProfile();
fetchOrders();
fetchReviews();
</script>


 <template>
  <div class="container my-4">
    <!-- Dashboard Navigation -->
    <nav class="nav nav-tabs" id="myTab" role="tablist">
      <a
        class="nav-link active"
        id="account-tab"
        data-bs-toggle="tab"
        href="#account"
        role="tab"
        aria-controls="account"
        aria-selected="true"
      >
        Account
        <span class="d-none d-lg-inline-block">& security</span>
      </a>

      <a
        class="nav-link"
        id="orders-tab"
        data-bs-toggle="tab"
        href="#orders"
        role="tab"
        aria-controls="orders"
        aria-selected="false"
      >
        Orders
        <span class="d-none d-lg-inline-block">& Reviews</span>
      </a>

      <a
        class="nav-link"
        id="cart-tab"
        data-bs-toggle="tab"
        href="#cart"
        role="tab"
        aria-controls="cart"
        aria-selected="false"
      >
        Cart
        <span class="d-none d-lg-inline-block"> & Wishlist</span>
      </a>
    </nav>

    <!-- Tab Content -->
    <div class="border border-top-0 tab-content" id="myTabContent">
      <!-- ACCOUNT AND SECURITY TAB -->
      <div
        class="tab-pane fade show active"
        id="account"
        role="tabpanel"
        aria-labelledby="account-tab"
      >
        <div class="col-md-9 mx-auto">
          <h2>Welcome, {{ profile.name }}</h2>
          <p>Here's a quick overview of your account:</p>

          <!-- Account Overview -->
          <div class="card mb-4">
            <div class="card-header">Account Overview</div>
            <div class="card-body">
              <h6>Avatar / Image</h6>
              <div
                class="avatar-container"
                style="width: 100px; height: 100px"
                :style="{
                  backgroundImage: `url(${
                    (status.avatar.loading && status.avatar.url) ||
                    profile.avatar
                  })`,
                }"
              >
                <div
                  v-if="status.avatar.loading"
                  class="overlay"
                  :style="{ opacity: `${1 - status.avatar.progress / 100}` }"
                >
                  <span class="fw-bolder">
                    {{ status.avatar.progress }} %
                  </span>
                </div>

                <div v-else class="overlay">
                  <button @click="deleteImage" class="btn text-danger">
                    Remove
                  </button>
                  <button @click="selectImage" class="btn text-white">
                    Change
                  </button>
                </div>

                <input
                  @change="uploadImage"
                  type="file"
                  name="image"
                  id="image"
                  ref="imageSelector"
                  accept="image/*"
                  hidden
                />
              </div>

              <button type="button" @click="logout" class="m-2 btn btn-danger">
                Logout
              </button>
              <router-link to="/store" class="m-2 btn btn-outline-primary">Shop</router-link>
              <p class="text-muted font-decoration-italic">
                Used for display in reviews take a look at our privacy policy
                <router-link to="/faqs">here</router-link>.
              </p>
              <form @submit.prevent="updateProfile">
                <div class="col-auto">
                  <label for="name" class="form-label">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    :value="profile.name"
                    disabled
                    readonly
                  />
                </div>
                <div class="col-auto">
                  <label for="nickname" class="form-label">Nickname</label>
                  <input
                    v-model="profile.nickname"
                    type="text"
                    class="form-control"
                    id="nickname"
                    :disabled="!profile.edit"
                  />
                  <span class="form-text"
                    >For more controlled privacy in reviews etc.</span
                  >
                </div>
                <div class="col-auto">
                  <label for="email" class="form-label">Email</label>
                  <input
                    v-model="profile.email"
                    type="email"
                    class="form-control"
                    id="email"
                    :disabled="!profile.edit"
                  />
                </div>
                <div class="col-auto">
                  <label for="phone" class="form-label">Phone</label>
                  <input
                    v-model="profile.phone"
                    type="text"
                    class="form-control"
                    id="phone"
                    :disabled="!profile.edit"
                  />
                </div>
              </form>
              <a href="#" class="btn btn-primary" @click.prevent="updateProfile"
                >Edit Profile</a
              >
            </div>
          </div>
          <div class="card mb-4">
            <div class="card-header">Security</div>
            <div class="card-body">
              <form v-if="verified" @submit.prevent="changePassword">
                <label for="password" class="form-label">Password:</label>
                <input
                  v-model="password"
                  type="password"
                  name="password"
                  id="password"
                  class="form-control form-control-sm"
                />
              </form>
              <a
                href="javascript:void(0)"
                @click.prevent="changePassword"
                class="btn d-flex justify-content-center align-items-center"
                :class="{
                  'btn-danger': status.password.failed,
                  'btn-primary':
                    !status.password.loading & !status.password.failed,
                }"
                :disabled="status.password.loading"
                :aria-disabled="status.password.loading"
              >
                <div
                  v-if="status.password.loading"
                  class="spinner-border spinner-border-sm mx-2"
                ></div>

                <span v-if="status.password.verifying">Verification</span>
                <span v-else-if="status.password.updating">Updating</span>
                <span v-else-if="status.password.updated"
                  >Password updated</span
                >
                <span v-else
                  >Change Password <i class="bi bi-key-fill"></i
                ></span>
                <span class="mx-2" v-if="status.password.failed">failed</span>
              </a>
              <div class="form-text">Password last updated [date]</div>

              <div class="form-check form-switch">
                <input
                  type="checkbox"
                  v-model="sendOTP"
                  name="sendOTP"
                  id="sendOTP"
                  class="form-check-input"
                  role="switch"
                />
                <label class="form-check-label" for="sendOTP"
                  >Always send code to {{ profile.email }} for every login.
                </label>
              </div>
              <div class="form-check form-switch">
                <input
                  type="checkbox"
                  v-model="notifyMe"
                  name="notifyMe"
                  id="notifyMe"
                  class="form-check-input"
                  role="switch"
                />
                <label class="form-check-label" for="notifyMe"
                  >Notify me always for every login via {{ profile.email }} .
                </label>
              </div>
            </div>
          </div>
          <div class="card mb-4">
            <div class="card-header">Address Information</div>
            <div class="card-body">
              <div
                v-for="{ _id, address } in address_list"
                :key="_id"
                class="col-auto my-3 shadow-sm px-2 rounded p-2 d-flex justify-content-between"
              >
                <p class="my-auto">{{ address }}</p>
                <button @click="popAddress(_id)" class="btn btn-outline-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </div>

              <address-form
                v-if="shippingAddress.edit"
                :address="shippingAddress"
              ></address-form>
              <button
                @click="pushAddress"
                class="btn border-2 fw-bolder p-1 d-flex justify-content-center align-items-center"
                :class="{
                  'btn-outline-danger border-danger': status.address.failed,
                  'btn-outline-success border-success': !status.address.failed,
                }"
                :disabled="status.address.loading"
                :aria-disabled="status.address.loading"
              >
                <div
                  v-if="status.address.loading"
                  class="spinner-border spinner-border-sm"
                ></div>
                <span
                  class="mx-2"
                  v-if="status.address.loading || status.address.failed"
                  >Adding</span
                >
                <span v-if="status.address.failed">failed</span>
                <span v-if="!status.address.loading && !status.address.failed"
                  >+ Add an address</span
                >
              </button>
            </div>
          </div>
          <div class="card mb-4">
            <div class="card-header">Payment Methods</div>
            <div class="card-body">
              <form v-if="payment_input.edit">
                <div class="form-check form-check-inline">
                  <input
                    v-model="card"
                    type="radio"
                    class="form-check-input"
                    name="card"
                    id="card"
                    value="card"
                  />
                  <label for="card" class="form-check-label"
                    >Credit/Debit Card</label
                  >
                </div>
                <div class="form-check form-check-inline">
                  <input
                    v-model="paypal"
                    type="radio"
                    class="form-check-input"
                    name="paypal"
                    id="paypal"
                    value="paypal"
                  />
                  <label for="paypal" class="form-check-label">Paypal</label>
                </div>
                <div v-if="card" class="stripe"></div>
                <div v-if="paypal" class="paypal">
                  <input type="email" class="form-control" />
                </div>
              </form>
              <button
                @click="payment_input.edit = !payment_input.edit"
                class="btn btn-outline-success border-success border-2 fw-bolder p-1"
              >
                + Add a Method
              </button>
            </div>
          </div>

          <div class="card mb-4">
            <div
              class="card-header bg-danger text-white p-2"
              data-bs-theme="dark"
            >
              Danger zone
            </div>
            <div class="card-body p-4">
              <h6>Permanent account Deletion</h6>
              <p>
                Delete my account and all related data. Note this
                <strong>action</strong> is <strong>irreversible</strong>.
              </p>
              <form
                v-if="wantsDeleteUser"
                @submit.prevent="deleteUser"
                class="col-auto"
              >
                <input
                  v-model="password"
                  type="password"
                  name="password"
                  id="password"
                  class="form-control"
                  placeholder="Enter your password to continue"
                  aria-placeholder="Enter your password to continue"
                  required
                  aria-required="true"
                />
              </form>
              <p
                v-if="status.deleteUser.success"
                class="text-success fw-bolder"
              >
                Account deleted successfully.
              </p>

              <button
                v-else
                @click="deleteUser"
                class="btn btn-outline-danger d-flex justify-content-center align-items-center"
              >
                <div
                  v-if="status.deleteUser.loading && wantsDeleteUser"
                  class="spinner-border spinner-border-sm"
                ></div>
                <span v-if="status.deleteUser.loading && wantsDeleteUser"
                  >Deleting</span
                >
                <span v-else-if="wantsDeleteUser">Continue</span>
                <span v-else>Delete my account</span>
              </button>
              <p v-if="status.deleteUser.failed" class="text-danger form-text">
                Oops could not delete user
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ORDERS AND TRACKING TAB -->
      <div
        class="tab-pane fade"
        id="orders"
        role="tabpanel"
        aria-labelledby="orders-tab"
      >
        <div class="card mb-4">
          <div class="card-header">Recent Orders</div>
          <div class="card-body">
            <ul v-if="orders?.length" class="list-group">
              <li
                v-for="order in orders"
                :key="order._id"
                class="list-group-item d-flex"
              >
                <p class="me-auto">
                  Order - {{ order._id }} - {{ order.status }} ,
                  {{ formatDate(order.createdAt) }}
                </p>
                <a
                  :href="`${BASE_API_URL}/orders/${order._id}/pdf`"
                  class="btn btn-primary"
                  
                  >Download <i class="bi bi-file-pdf"></i
                ></a>
              </li>
            </ul>
            <div
              class="d-flex align-items-center"
              :class="{ 'text-danger': status.orders.failed }"
            >
              <div
                v-if="status.orders.loading"
                class="spinner-border spinner-border-sm"
              ></div>

              <p v-if="status.orders.loading">Fetching orders</p>
              <p v-else-if="status.orders.failed">Fetching orders failed</p>
              <p v-else>You don`t have any orders to see</p>
            </div>
            <form @submit.prevent="pasteOrder" class="collapse" id="order-form">
              <div class="col-auto">
                <label for="order-id" class="form-label w-fit-content"
                  >Order ID:</label
                >
                <div class="input-group">
                  <input
                    v-model="newOrder"
                    type="text"
                    class="form-control"
                    id="order-id"
                    placeholder="ie. 66a0e57f469db163874a8218"
                    required
                    aria-required="true"
                  />
                  <button
                    class="btn btn-outline-primary"
                    :disabled="status.orders.paste.loading"
                    :aria-disabled="status.orders.paste.loading"
                    :class="{
                      'btn-outline-danger': status.orders.paste.failed,
                      'btn-outline-primary': !status.orders.paste.failed,
                    }"
                  >
                    <div
                      v-if="status.orders.paste.loading"
                      class="spinner-border spinner-border-sm"
                    ></div>
                    <span v-else-if="status.orders.paste.failed">Retry</span>
                    <span v-else>Pull</span>
                  </button>
                </div>
                <p
                  v-if="status.orders.paste.failed"
                  class="form-text text-danger"
                >
                  Error occured while pulling order
                </p>
              </div>
            </form>
            <p>
              Did not purchase using your account's email or were logged out?
              Please click
              <a href="#" data-bs-toggle="collapse" data-bs-target="#order-form"
                >here</a
              >
              to add the order manually
            </p>
          </div>
        </div>

        <!-- Reviews -->
        <div class="card mb-4">
          <div class="card-header">Reviews</div>
          <div class="card-body">
            <ul v-if="reviews?.length" class="list-group">
              <li
                v-for="review in reviews"
                :key="review._id"
                class="list-group-item d-flex justify-content-between"
              >
                <p class="my-auto">{{ review.comment }}</p>

                <button
                  @click="deleteReview(review._id)"
                  class="btn btn-outline-danger"
                >
                  <i class="bi bi-trash-fill text-danger"></i>
                </button>

                <button class="btn btn-outline-primary">
                  <i class="bi bi-pen"></i>
                </button>
              </li>
            </ul>
            <p v-if="status.reviews.failed" class="text-danger">
              Error occured while fetching reviews
            </p>
            <p v-if="reviews && !reviews.length && !status.reviews.failed">
              Your reviews appear here.
            </p>
            <div
              v-if="status.reviews.loading"
              class="d-flex align-items-center"
            >
              <div class="spinner-border spinner-border-sm mx-2"></div>
              <p class="my-auto">Error fetching reviews</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CART AND WISHLIST TAB -->
      <div
        class="tab-pane fade"
        id="cart"
        role="tabpanel"
        aria-labelledby="cart-tab"
      >
        <div class="card mb-4">
          <div class="card-header">Wishlist</div>
          <div class="card-body">
            <ul v-if="wishList?.length" class="list-group">
              <li
                v-for="product in wishList"
                :key="product._id"
                class="list-group-item d-flex justify-content-between"
              >
                <p class="my-auto">{{ product.name }}</p>
                <router-link
                  class="btn btn-outline-primary"
                  :to="`/store/products/${product._id}`"
                  >Shop</router-link
                >
                <button
                  @click="popWishList(product._id)"
                  class="btn btn-outline-danger"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </li>
            </ul>
            <p v-else>
              Products you add to <strong>wishlist</strong> appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  name: "UserDashboard",
};
</script>

<style scoped>
.card {
  margin-bottom: 1rem;
}
.avatar-container {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.overlay {
  background-color: #000;
  opacity: 0.8;
  display: none;
  height: 100%;
  width: 100%;
}
.avatar-container:hover .overlay {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>

