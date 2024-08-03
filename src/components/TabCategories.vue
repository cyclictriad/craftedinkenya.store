<template>
  <div>
    <h5 class="fs-3 fw-bolder text-center">All Categories</h5>
    <div
      v-for="category in categories"
      :key="category._id"
      class="d-flex flex-row my-2 mx-auto col-md-6 position-relative align-items-center"
      style="justify-content: space-between"
    >
      <p class="text-center">{{ category.category }}</p>
      <button
        type="button"
        class="btn btn-outline-warning"
        @click="categories.length && deleteCategory(category._id)"
      >
        Remove
      </button>
    </div>
    <div class="form col-md-6 mx-auto mt-3">
      <h5 class="fs-4 fw-bold text-center">Add Category</h5>
      <form @submit.prevent="addCategory">
        <div class="d-flex form-floating">
          <input
            v-model="category"
            type="text"
            class="form-control"
            id="category"
          />
          <label for="category">Category</label>
          <button class="btn btn-outline-success border-2" type="submit">
            Add
          </button>
        </div>
        <div
          v-if="categoryExists"
          class="alert alert-danger d-flex align-items-center alert-dismissible fade show"
          role="alert"
        >
          <i class="bi bi-exclamation-triangle-fill"></i>
          <div>Category exists already</div>
          <button
            @click="categoryExists = !categoryExists"
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="close"
          ></button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
const categories = ref(null);
const category = ref(null);
const categoryExists = ref(false);
const fetchCategories = async function () {
  try {
    const response = await axios(`categories`);
    categories.value = response.data;
  } catch (error) {
    alert(error);
  }
};
const addCategory = async function () {
  categoryExists.value = false;
  try {
    await axios.post("categories", { category: category.value });
    fetchCategories();
  } catch (error) {
    if (error.response.status === 403) {
      categoryExists.value = true;
    }
  }
};
const deleteCategory = async function (id) {
  try {
    await axios.delete(`categories/${id}`);
    fetchCategories();
  } catch (error) {
    alert(error);
  }
};
fetchCategories();
</script>

<style>
</style>