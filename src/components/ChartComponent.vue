
<template>
  <div>
    <h1 class="text-center fs-3 fw-bolder my-2 f-Serif"><slot></slot></h1>
    <canvas
      ref="chartCanvas"
      class="mb-5"
      :height="height"
      :width="width"
    ></canvas>
  </div>
</template>
  

  
  <script setup>
import Chart from "chart.js/auto";
import { onMounted, ref } from "vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  labels: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    required: true,
  },
  legend: {
    type: String,
    required: false,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
});
const chart = ref(null);
const chartCanvas = ref(null);

const renderChart = function () {
  const ctx = chartCanvas.value.getContext("2d");
  chart.value = new Chart(ctx, {
    type: props.type,
    data: {
      labels: props.labels,
      datasets: [
        {
          data: props.data,
          label: props.legend,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: props.title, // Specify your desired title here
          font: {
            size: 16, // Adjust the font size as needed
          },
        },
      },
      animations: {
        tension: {
          duration: 800,
          delay: 200,
          easing: "easeInSine",
          from: 0.4,
          to: 0.3,
          loop: true,
        },
      },
      ...props.options, // Merge with any additional options passed from the parent component
    },
  });
};
onMounted(renderChart);
</script>
<!-- 
  <script>
  import Chart from 'chart.js/auto';
  
  export default {
    props: {
      type: {
        type: String,
        required: true
      },
      labels: {
        type: Array,
        default: () => []
      },
      data: {
        type: Array,
        default: () => []
      },
      options: {
        type: Object,
        default: () => ({})
      },
      title:{
        type: String,
        required: true
      },
      legend:{
        type: String,
        required: false
      },
      width:{
        type:Number,
        required:true
      },
      height:{
        type:Number,
        required:true
      }
    },
    data(){
      return{
        chart:null
      }
    },
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        const ctx = this.$refs.chartCanvas.getContext('2d');
        this.chart = new Chart(ctx, {
          type: this.type,
          data: {
            labels: this.labels,
            datasets: [{
              data: this.data,
              label:this.legend
            }]
          },
          options:{
            plugins: {
                title: {
                    display: true,
                    text: this.title, // Specify your desired title here
                    font: {
                        size: 16 // Adjust the font size as needed
                    }
                }
            },
            animations: {
              tension: {
                duration: 800,
                delay:200,
                easing: 'easeInSine',
                from: 0.4,
                to: 0.3,
                loop: true
              },
            },
            ...this.options // Merge with any additional options passed from the parent component
        }
        });
      }
    },
  };
  </script>
  
  <style scoped>
  </style>
   -->