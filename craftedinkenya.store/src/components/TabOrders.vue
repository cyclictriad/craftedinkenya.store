<template>
  <form
    class="col col-md-9 d-flex mx-auto my-3 border border-2"
    :class="{ rounded: query.length }"
  >
    <select
     v-model="sId"
      name=""
      id=""
      class="form-select rounded-0"
      style="width: fit-content"
    >
      <option v-for="(shop, index) in shops" :key="index" :value="shop._id">
        {{ shop.name }}
      </option>
    </select>
    <input
      @input="searchOrders"
      v-model="query"
      type="text"
      name=""
      id=""
      :placeholder="`Search for orders...`"
      class="m-0 form-control border-0 focus-ring-none"
    />
    <i
      v-if="query.length"
      class="fw-bolder bi bi-search my-auto p-2 bg-primary-subtle"
    ></i>
  </form>
  <table
    v-if="orders.orders.length"
    class="table table-responsive table-striped table-hover table-dark"
  >
    <thead class="bg-success">
      <th>Order_Id</th>
      <th>Product</th>
      <th>Quantity</th>
      <th>Totals</th>
      <th>Date</th>
    </thead>
    <tbody>
      <tr class="fw-bolder" v-if="!orders.toDisplay.length">
        <!-- <td colspan="5"></td> -->
        <caption>
          No results for your query
        </caption>
      </tr>
      <tr v-for="(order, id) in orders.toDisplay" :key="id">
        <td>{{ order.orderId }}</td>
        <td>{{ order.name }}</td>
        <td>{{ order.quantity }}</td>
        <td>{{ order.totalPrice }}</td>
        <td>{{ order.orderDate }}</td>
      </tr>
    </tbody>
  </table>
  <p v-else class="alert alert-danger py-3">No orders yet</p>
</template>

<script setup>
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
const store = useStore();
const orders = ref({
  orders: [],
  toDisplay: [],
});
const ordersToDisplay = computed(()=> {
  query.value = query.value.toLocaleLowerCase();
 return orders.value.orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(query) ||
      order.name.toLowerCase().includes(query) ||
      order.orderDate.toLowerCase().includes(query)
  );
})
const query = ref("");
const shops = computed(() => store.getters.GET_USER?.shops);
const sId = ref(shops.value[0]._id)
const fetchOrders = async function () {
  try {
    const response = await axios(`orders/${sId.value}/table`);
    orders.value.orders = response.data;
    orders.value.toDisplay = orders.value.orders;
  } catch (error) {
    alert(error);
  }
};
const searchOrders = function () {
  query.value = query.value.toLocaleLowerCase();
  orders.value.toDisplay = orders.value.orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(query) ||
      order.name.toLowerCase().includes(query) ||
      order.orderDate.toLowerCase().includes(query)
  );
};
watch(sId, fetchOrders)
fetchOrders();
</script>