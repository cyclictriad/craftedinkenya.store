<template>
  <div>
    <div v-if="inquiries && !inquiries.length" class="w-75 my-3 mx-auto">
      <p class="text-muted fs-4 fw-bolder">No questions at the moment.</p>
    </div>
    <div
      v-for="(inquiry, index) in inquiries"
      :key="index"
      class="col col-md-9  my-3 mx-auto"
    >
      <div class="bg-body-secondary  rounded">
        <div v-if="inquiry.name" class="bg-info text-start">
          <i class="bi bi-info-square-fill px-2"></i>
          <span>{{ inquiry.name }}</span>
        </div>
        <div class="d-flex justify-content-between">
          <p class="w-75 text-start my-auto px-2">{{ inquiry.inquiry }}</p>
          <i
            @click="
              (edit.state = !edit.state), (edit.id = edit.id ? '' : inquiry._id)
            "
            class="btn text-success bi bi-pen"
            >Answer</i
          >
        </div>
        
      </div>
      <form
        v-if="edit.id === inquiry._id && edit.state"
        @submit.prevent="postAnswer"
        class="form border border-2 rounded border-bg-secondary"
      >
        <textarea
          placeholder="Thanks for your message..."
          v-model="edit.answer"
          class="form-control"
          style="height: 50px"
        ></textarea>
        <button type="submit" class="btn w-100 btn-outline-info">Answer</button>
      </form>
    </div>
  </div>
</template>
  
<script setup>
import axios from "axios";
import { ref } from "vue";
const inquiries = ref(null);
const edit = ref({
  state: false,
  id: "",
  answer: "",
});
const fetchInquiries = async () => {
  try {
    const { data } = await axios(`inquiry`);
    inquiries.value = data;
  } catch (error) {
    alert(error);
  }
};
const postAnswer = async () => {
  try {
    await axios.patch(`inquiry/${edit.value.id}`, {
      answer: edit.value.answer,
    });
    fetchInquiries();
    reset();
  } catch (error) {
    alert(error);
  }
};
const reset = () => {
  edit.value = {
    state: false,
    id: "",
    answer: "",
  };
};
fetchInquiries();
</script>
    
    <style>
</style>