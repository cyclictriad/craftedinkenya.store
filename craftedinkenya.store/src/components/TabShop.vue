<template>
  <div v-if="shops">
    <p class="d-inline-flex gap-1">
      <button
        v-for="(shop, index) in shops"
        :key="shop._id"
        class="btn"
        type="button"
        :class="view === index ? 'btn-primary' : 'btn-light'"
        @click="(view = index)"
      >
        {{ shop.name }}
      </button>
      <i
        v-if="!wantShop"
        @click="wantShop = true"
        class="btn align-self-end btn-outline-primary bi bi-shop border-3"
      >
        Add Shop
      </i>
    </p>
    <AddShop v-if="!hasShop || wantShop" @shopCreated="wantShop = false" />
    <div v-else class="row">
      <div class="col">
        <div :id="`shop${view}`">
          <div class="card card-body">
            <section v-if="hasShop && products.length">
              <h3 class="text-center fw-bolder my-3">
                {{ `${shops[view].name} Shop` }}
              </h3>
              <section
                v-for="(filterproducts, index) in products"
                :key="index"
                class="w-100 row mx-auto"
              >
                <h5 class="text-center fs-4">
                  {{ productLabel[index] }} Products ({{
                    filterproducts.length
                  }})
                </h5>
                <div
                  class="shop-products"
                  v-for="product in filterproducts"
                  :key="product._id"
                >
                  <div
                    class="d-flex col-lg-10 rounded bg-body-secondary mx-auto mt-2 p-2"
                    style="
                      min-width: fit-content;
                      justify-content: space-between;
                    "
                  >
                    <p class="text-start my-auto text-nowrap">
                      {{ product.name }}
                    </p>
                    <i
                      @click="
                        (edit.id = product.id), (edit.status = !edit.status)
                      "
                      v-if="product.status === 'approved'"
                      type="button"
                      class="btn bi bi-pen text-success my-auto text-nowrap"
                      style="height: fit-content"
                    >
                      Update Details</i
                    >
                    <i
                      @click="deleteProduct(product.id)"
                      type="button"
                      class="btn text-danger bi bi-trash my-auto text-nowrap"
                      style="height: fit-content"
                    >
                      Remove</i
                    >
                  </div>
                  <add-product
                    :shopId="shops[view]._id"
                    :product="product"
                    v-if="edit.status && edit.id === product.id"
                  ></add-product>
                </div>
              </section>
            </section>
            <section class="my-3 d-flex flex-column align-items-start" >
              <button @click="add.state = !add.state" class="btn btn-success rounded-0"><span>Add a product</span></button>
              <add-product
                :shopId="shops[view]._id"
                @productPosted="()=>{
                  add.state = false
                  fetchProducts()
                }"
                v-if="add.state"
              ></add-product>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, ref, watch, watchEffect } from "vue";
import AddShop from "./FormShop.vue";
import AddProduct from "./FormProduct.vue";
import { useStore } from "vuex";

const wantShop = ref(false);
const products = ref([]);
const productLabel = ref([]);
const store = useStore()
const edit = ref({
  id: "",
  state: false,
});
const add = ref({
  state: false,
});
const shops = computed(()=>store.getters.GET_USER?.shops)
const hasShop = computed(() => shops.value && shops.value.length);
const view = ref(0);
const fetchProducts = async function () {
  try {
    productLabel.value = [];
    products.value = [];
    const response = await axios(`products?sId=${shops.value[view.value]._id}`);
    const { data } = response;
    const statuses = new Set(response.data.map((product) => product.status));
    statuses.forEach((status) => {
      products.value.push(data.filter((product) => product.status === status));
      productLabel.value.push(status);
    });
  } catch (error) {
    //alert(error);
  }
};
const deleteProduct = async function (productId) {
  try {
    await axios.delete(`products/${productId}`);
    fetchProducts();
  } catch (error) {
    alert(error);
  }
};
watch(view, fetchProducts);
if (shops.value) fetchProducts()
</script>
