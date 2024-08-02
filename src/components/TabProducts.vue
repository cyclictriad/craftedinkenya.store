<template>
  <div>
    <form
      class="d-flex form mx-auto my-3 w-75 border border-2"
      :class="{ rounded: query.length }"
    >
      <select
        v-if="query.length"
        @change="searchProducts"
        v-model="input.filter"
        id=""
        class="form-select"
        style="max-width: fit-content"
      >
        <option value="">All <i class="bi bi-filter"></i></option>
        <option value="_id">Id</option>
        <option value="name">Name</option>
        <option value="category">Category</option>
      </select>

      <input
        @input="searchProducts"
        v-model="query"
        type="text"
        name=""
        id=""
        :placeholder="`Search for products...`"
        class="m-0 form-control border-0"
      />
      <i
        v-if="query.length"
        class="fw-bolder bi bi-search my-auto p-2 bg-primary-subtle"
      ></i>
    </form>

    <section v-if="someProducts">
      <div
        v-for="(filterProducts, index) in products.toDisplay"
        :key="index"
        class="my-2"
      >
        <h5 v-if="filterProducts.length" class="text-center fs-4">
          {{ statuses[index] }} Products
          <span> ({{ filterProducts.length }})</span>
        </h5>
        <table
          v-if="filterProducts.length"
          class="table table-responsive table-striped table-danger my-3 mx-auto"
        >
          <thead class="bg-danger">
            <th>
              <span class="d-none d-md-inline-block bg-transparent"
                >Product</span
              >
              ID
            </th>
            <th>Product Name</th>
            <th>Category</th>
            <th class="d-none d-md-block">Status</th>
          </thead>
          <tbody>
            <tr v-for="product in filterProducts" :key="product.id">
              <td>
                <span class="d-none d-md-inline-block bg-transparent">{{
                  product._id
                }}</span>
                <span class="d-inline-block d-md-none bg-transparent">{{
                  `${product._id.slice(0, 6)}..`
                }}</span>
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td class="d-none d-md-block">
                <select
                  @change="updateStatus(product._id)"
                  :id="product._id"
                  class="form-control text-center"
                >
                  <option
                    value="approved"
                    :selected="product.status === 'approved'"
                  >
                    Approved
                  </option>
                  <option
                    value="pending"
                    :selected="product.status === 'pending'"
                  >
                    Pending
                  </option>
                  <option
                    value="flagged"
                    :selected="product.status === 'flagged'"
                  >
                    Flagged
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p v-else-if="query" class="text-center fs-4 text-dark">
      No results for your query
    </p>
    <!-- <p
      v-else
      class="alert alert-danger alert-dismissible fade show d-flex fs-4 bg-danger-subtle py-3 px-2"
      role="alert"
      style="justify-content: space-between"
    >
      <i class="bi bi-exclamation-triangle"></i>
      <span>No products to display...</span>
      <button type="button" data-bs-dismiss="alert" aria-label="close"></button>
    </p> -->
    <div v-if="status.loading" class="d-flex justify-content-center align-items-center text-success">
      <div class="spinner-border spinner-border-sm mx-2"></div>

      <p  class="fs-5 my-auto">Fetching products</p>
    </div>
    <div v-if="status.failed" class="d-flex text-danger">
      <i class="bi bi-exclamation-circle-fill mx-2"></i>

      <p class="fs-4 ">Error fetching products</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, ref } from "vue";
const input = ref({
  filter: "",
});
const statuses = ref([]);
const products = ref({
  cache: [],
  toDisplay: [],
});
const query = ref("");
const someProducts = computed(() =>
  products.value.toDisplay.some((products) => products.length)
);
const status = ref({
  loading: false,
  failed: false,
});
const filter = computed(() =>
  input.value.filter ? [input.value.filter] : ["_id", "name", "category"]
);
const fetchProducts = async function () {
  try {
    status.value.loading = true;
    status.value.failed = false;
    products.value.cache = [];
    products.value.toDisplay = [];
    statuses.value = [];
    const response = await axios(`products?auth=true`);
    const { data } = response;
    new Set(data.map((product) => product.status)).forEach((status) => {
      products.value.cache.push(
        data.filter((product) => product.status === status)
      );
      statuses.value.push(status);
    });
    products.value.toDisplay = products.value.cache;
  } catch (error) {
    status.value.failed = true;
    console.log("An error occured:", error);
  }
  status.value.loading = false;
};
const updateStatus = async function (productId) {
  try {
    const status = document.getElementById(productId).value;
    await axios.patch(`products/${productId}`, {
      status,
    });
    fetchProducts();
  } catch (error) {
    alert(error);
  }
};

const searchProducts = async function () {
  query.value = query.value.toLowerCase();
  products.value.toDisplay = products.value.cache.map((products) =>
    products.filter((product) =>
      filter.value
        .map((field) => product[field])
        .some((data) => data.toLowerCase().includes(query.value))
    )
  );
};
fetchProducts();
</script>