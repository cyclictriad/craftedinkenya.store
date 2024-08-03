<template>
  <div class="row">
    <p class="d-inline-flex gap-1">
      <button
        v-for="(shop, index) in shops"
        :key="shop.id"
        class="btn"
        type="button"
        :class="view === index ? 'btn-primary' : 'btn-light'"
        @click="(view = index)"
      >
        {{ shop.name }}
      </button>
    </p>
    <div class="card card-body">
      <div v-if="dataLoaded">
        <ChartComponent
          v-for="(data, index) in chart.chartData"
          :key="index"
          :type="chart.chartType[index]"
          :data="data"
          :labels="chart.chartLabels[index]"
          :legend="chart.chartLegends[index]"
          :title="chart.chartHeaders[index]"
          :options="chart.chartOptions"
          :height="25 * data.length"
          :width="50 * data.length"
        >
          {{ chart.chartHeaders[index] }}
          <span class="fw-bolder text-success"
            >(<span v-if="index">$</span>{{ chart.chartTotals[index] }})</span
          >
        </ChartComponent>
      </div>
      <div v-else class="no-products">
        <p class="text-center fs-3 text-danger">No data yet</p>
      </div>
    </div>
  </div>
</template>
    
 
<script setup>
import axios from "axios";
import ChartComponent from "./ChartComponent.vue";
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
const store = useStore();
const view = ref(0);
const chart = ref({
  chartType: [],
  chartLabels: [],
  chartLegends: [
    "Quantity in units",
    "Sales in US Dollars",
    "Profit in US Dollars",
  ],
  chartData: [],
  chartTotals: [],
  chartHeaders: ["Orders", "Sales", "Profit"],
  chartOptions: { animation: true, scales: { y: { beginAtZero: true } } },
});
const dataLoaded = ref(false);

const shops = computed(() => store.getters.GET_USER?.shops);

const fetchOrders = async function () {
  try {
    if (dataLoaded.value) {
      chart.value.chartData = [];
      chart.value.chartLabels = [];
      chart.value.chartType = [];
      chart.value.chartTotals = [];
    }
    const response = await axios(
      `orders/${shops.value[view.value]._id}/chart`
    );
    const { data } = response;
    if (data.chartData) {
      data.chartData.forEach((set) => chart.value.chartData.push(set));
      data.chartLabels.forEach((set) => {
        chart.value.chartLabels.push(set);
        set.length > 2
          ? chart.value.chartType.push("line")
          : chart.value.chartType.push("bar");
      });
      chart.value.chartTotals = data.chartTotals;
      dataLoaded.value = true;
    } else {
      dataLoaded.value = false;
    }
  } catch (error) {
    alert(error);
  }
};
watch(view, fetchOrders)
fetchOrders();
</script>
<!-- 
<script>
import axios from "axios";
import ChartComponent from "./ChartComponent.vue";

export default {
  components: {
    ChartComponent,
  },
  data() {
    return {
      view: {
        index: 0,
      },
      chart: {
        chartType: [],
        chartLabels: [],
        chartLegends: [
          "Quantity in units",
          "Sales in US Dollars",
          "Profit in US Dollars",
        ],
        chartData: [],
        chartTotals: [],
        chartHeaders: ["Orders", "Sales", "Profit"],
        chartOptions: { animation: true, scales: { y: { beginAtZero: true } } },
      },
      dataLoaded: false,
    };
  },
  computed: {
    shops() {
      return this.$store.getters.GET_USER?.shops;
    },
  },
  methods: {
    async fetchOrders(id) {
      try {
        if (this.dataLoaded) {
          this.chart.chartData = [];
          this.chart.chartLabels = [];
          this.chart.chartType = [];
          this.chart.chartTotals = [];
        }
        const response = await axios(`orders/${id}/chart`);
        const { data } = response;
        if (data.chartData) {
          data.chartData.forEach((set) => this.chart.chartData.push(set));
          data.chartLabels.forEach((set) => {
            this.chart.chartLabels.push(set);
            set.length > 2
              ? this.chart.chartType.push("line")
              : this.chart.chartType.push("bar");
          });
          this.chart.chartTotals = data.chartTotals;
          this.dataLoaded = true;
        } else {
          this.dataLoaded = false;
        }
      } catch (error) {
        alert(error);
      }
    },
  },
  async created() {
    this.fetchOrders(data[0].id);
  },
};
</script>
    
    <style>
</style> -->