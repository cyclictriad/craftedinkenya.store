<template>
  <form
    @submit.prevent="postProduct"
    class="px-2 col-lg-10 border"
    :class="{ 'border-success rounded-0 px-5': !product }"
  >
    <div class="d-flex">
      <div class="w-50 form-floating my-3 me-1">
        <select
          v-model="input.category"
          @click="fetchCategories"
          name=""
          id="category"
          class="form-select"
          required
        >
          <option
            v-for="category in categories"
            :key="category._id"
            :value="category.category"
          >
            {{ category.category }}
          </option>
        </select>
        <label for="category">Product Category</label>
      </div>
      <div class="w-50 form-floating my-3 ms-1">
        <input
          v-model="input.name"
          type="text"
          id="name"
          class="form-control"
          required
        />
        <label class="form-label" for="name">Product Name</label>
        <p v-if="input.name" class="text-start">
          <span v-if="!invalid.name" class="text-success fw-bold"
            >Remaining Characters ( {{ 25 - input.name.length }} )</span
          >
          <span v-else class="text-danger fw-bolder"> Exceeded characters</span>
        </p>
      </div>
    </div>

    <div class="form-floating my-3">
      <textarea
        v-model="input.summary"
        type="text"
        id="summary"
        cols="300"
        rows="300"
        class="form-control"
        required
      ></textarea>
      <label class="form-label" for="summary">Product Summary</label>
    </div>
    <div class="form-floating my-3">
      <textarea
        v-model="input.description"
        type="text"
        id="description"
        style="height: auto"
        class="form-control"
        required
      ></textarea>
      <label class="form-label" for="description">Product Description</label>
    </div>
    <div class="my-3">
      <h5 class="fs-5 text-start">Image Files</h5>
      <div class="d-flex">
        <div
          class="card col-12 col-sm-6 col-md-4 col-lg-3"
          v-for="image in input.images"
          :key="image.public_id"
        >
          <div
            class="card-body product-image"
            :style="{ backgroundImage: `url(${image.url})` }"
          >
            <button
              type="button"
              class="btn overlay btn-delete text-danger"
              style="background-color: rgba(0, 0, 0, 0.8)"
              @click="deleteImage(image.public_id)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="card-footer">
            <input
              type="text"
              v-model="image.label"
              placeholder="Image label"
              aria-label="image label"
              required
              aria-required="true"
            />
          </div>
        </div>

        <div
          v-if="status.uploading.loading"
          class="card col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <div
            class="card-body product-image"
            :style="{ backgroundImage: `url(${status.uploading.url})` }"
          >
            <div
              class="overlay"
              :style="{
                opacity: `rgba(0,0,0,${1 - status.uploading.progress / 100})`,
              }"
            ></div>
          </div>
          <div class="card-footer p-0">
            <div class="progress rounded-0">
              <div
                class="progress-bar progress-bar-striped progress-bar-animated bg-success"
                :style="{ width: `${status.uploading.progress}%` }"
                aria-valuemin="0"
                :aria-valuenow="status.uploading.progress"
                aria-valuemax="100"
              >
                Uploading ({{ status.uploading.progress }}%)
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row px-2">
        <button
          @click="selectFile"
          type="button"
          class="btn text-success fw-bolder w-auto my-2"
          style="background-color: #99ff99"
        >
          <input
            @change="uploadImage"
            type="file"
            name="image"
            id="image"
            ref="image"
            accept="image/*"
            class="d-none"
          />
          <span>Add</span>
          <i class="bi bi-image mx-2"></i>
        </button>
      </div>
    </div>

    <div class="d-flex">
      <div class="form-floating input-group my-3 mx-1">
        <input
          v-model="input.price"
          type="number"
          id="price"
          class="form-control"
          min="5"
          :class="{ 'text-danger fw-bolder': invalid.price }"
          required
        />
        <span class="input-group-text">USD</span>
        <label class="form-label" for="price">Buy Price</label>
      </div>
      <div class="form-floating input-group my-3 mx-1">
        <input
          v-model="input.profit"
          type="number"
          id="profit"
          class="form-control"
          min="30"
          :class="{ 'text-danger fw-bolder': invalid.profit }"
          required
        />
        <span class="input-group-text">%</span>
        <label class="form-label" for="profit">Target Profit</label>
      </div>
      <div class="form-floating input-group my-3 mx-1">
        <input
          v-model="input.discount"
          type="number"
          id="discount"
          class="form-control"
          :class="{ 'text-danger fw-bolder': invalid.discount }"
        />
        <span class="input-group-text">%</span>
        <label class="form-label" for="discount">Discount</label>
      </div>
    </div>
    <div
      v-if="invalid.profit"
      class="alert alert-primary alert-dismissible fade show w-100 d-flex align-items-center"
      role="alert"
    >
      <i class="bi bi-info-fill"></i>
      <div>Take into account shipping charges</div>
      <button
        type="button"
        data-bs-dismiss="alert"
        class="btn position-absolute end-0"
        aria-label="close"
      >
        Ok
      </button>
    </div>
    <button
      type="submit"
      class="btn rounded-0 my-2"
      :class="{
        'rounded-circle disabled p-3': status.submit.loading,
        'btn-danger': status.submit.failed,
        'btn-outline-success px-5':
          !status.submit.loading && !status.submit.failed,
      }"
      :aria-label="`${(product && 'Update') || 'Add'} Product`"
    >
      <div
        v-if="status.submit.loading"
        class="spinner-border spinner-border-sm"
      ></div>
      <p v-else-if="status.submit.failed">
        <i class="bi-bi-exclamation-circle-fill mx-2"></i>
        Failed
      </p>
      <span v-else>Sell at ${{ sellingPrice }}</span>
    </button>
  </form>
</template>

<script setup>
import axios from "axios";
import { computed, ref } from "vue";
const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
  shopId: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["product-posted"]);

const categories = ref([]);
const image = ref(null);

const input = ref({
  category: "",
  name: "",
  summary: "",
  description: "",
  price: 5,
  discount: 0,
  profit: 30,
  images: [],
});

const status = ref({
  uploading: {
    loading: false,
    url: null,
    progress: 0,
    failed: false,
  },
  submit: {
    loading: false,
    failed: false,
  },
});

const sellingPrice = computed(() => {
  return Number(
    (
      (1 - input.value.discount / 100) *
      input.value.price *
      (1 + input.value.profit / 100)
    ).toFixed(2)
  );
});

const invalid = computed(() => {
  return {
    profit: input.value.profit < 30,
    price: input.value.price < 5,
    discount: sellingPrice.value < 1.3 * input.value.price,
    name: input.value.name.length > 25,
  };
});

const selectFile = () => image.value.click();
const uploadImage = async function (e) {
  try {
    const imageFile = e.target.files[0];

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      const reader = new FileReader();
      reader.onload = function (e) {
        status.value.uploading.url = e.target.result;
      };
      reader.readAsDataURL(imageFile);
      status.value.uploading.failed = false;
      status.value.uploading.loading = true;
      const response = await axios.post(`uploads`, formData, {
        onUploadProgress: function (uploadEvent) {
          const progress = Math.trunc(
            (uploadEvent.loaded / uploadEvent.total) * 100
          );
          status.value.uploading.progress = progress;
        },
      });
      const { url, public_id } = response.data;
      input.value.images.push({
        url,
        public_id,
        label: "",
      });
    }
  } catch (error) {
    status.value.uploading.failed = true;
    console.log(error);
  }
  status.value.uploading.loading = false;
};
const fetchCategories = async function () {
  try {
    const response = await axios(`categories`);
    categories.value = response.data;
  } catch (error) {
    alert(`Unexpected error occured: ${error}`);
  }
};

const postProduct = async function () {
  if (
    Object.values(invalid.value).some((val) => val) ||
    !input.value.images.length
  )
    return;
  try {
    status.value.submit.loading = true;
    status.value.submit.failed = false;
    const method = props.product ? "put" : "post";
    const url = props.product ? `products/${props.product.id}` : `products`;
    await axios[method](url, input.value);
    emit("product-posted");
  } catch (error) {
    status.value.submit.failed = true;
    console.log(error);
  }
  status.value.submit.loading = false;
};

const deleteImage = async function (public_id) {
  try {
    await axios.delete(`uploads?public_id=${encodeURIComponent(public_id)}`);
    input.value.images = input.value.images.filter(
      (image) => image.public_id != public_id
    );
  } catch (error) {}
};

if (props.product) input.value = props.product;
input.value.sId = props.shopId;
fetchCategories();
</script>

<style>
.img-card {
  position: relative;
}
.btn-delete {
  visibility: none;
}
.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.img-card:hover .btn-delete {
  display: block;
}
.product-image {
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100px;
}
</style>