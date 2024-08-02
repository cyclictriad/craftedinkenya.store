<template>
<div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
  <div class="offcanvas-header">
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body position-relative">
    <h5 v-if="categories" class="text-center">Categories</h5>
    <ul style="list-style-type: none;">
      <li class="text-center my-2" v-for="category in categories" :key="category.label">{{ category.category }}</li>
    </ul>

    <h5>Social links</h5>
    <p>
      <i class="mx-2 bi bi-twitter"></i>
      <span>Twitter</span>
      <a href="">@xpoKenya</a>
    </p>
    <p>
      <i class="mx-2 bi bi-instagram"></i>
      <span>Instagram</span>
      <a href="">@xpoKenya</a>
    </p>
    <p>
      <i class="mx-2 bi bi-facebook"></i>
      <span>Facebook</span>
      <a href="">@xpoKenya</a>
    </p>
    <p>
      <i class="mx-2 bi bi-whatsapp"></i>
      <span>Twitter</span>
      <a href="">254 753 936 201</a>
    </p>

    <footer class="position-absolute bottom-0  w-100">
      <p class="text-center">&copy; xpoKenya<sup>TM</sup> {{ (new Date()).getFullYear() }}</p>
    </footer>
  </div>
</div>
</template>
<script>

import axios from 'axios'
export default {
    name:"OffCanvas",
    data(){
      return{
        categories:null
      }
    },
    methods:{
      async fetchCategories(){
        try{
          const response = await axios(`categories`)
          this.categories =  response.data
        }catch(error){
          alert(error)
        }
      }
    },
    created(){
      this.fetchCategories()
    }
}
</script>

<style scoped>

</style>