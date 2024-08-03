<template>
  <div class="row p-0">
    <h5 class="section-title">
      <slot></slot>
    </h5>
    <div v-if="reviews.length && product" class="rating-summary">
      <div class="rating-overview">
        <p>Product Ratings</p>
        <hr />
        <p class="average-rating">
          {{
            Math.round(
              reviews.map(review => review.stars).reduce((a, b)=> a+b)/
                reviews.length
            )
          }}
        </p>
      </div>
      <div class="rating-distribution">
        <div
          v-for="(stars, index) in [5, 4, 3, 2, 1]"
          :key="index"
          class="star-row"
        >
          <span class="star-label">{{ stars }} <small>stars</small> </span>
          <progress
            class="rating-progress"
            max="100"
            :value="
              (reviews.filter((review) => review.stars === stars).length /
                reviews.length) *
              100
            "
          ></progress>
          <span class="star-percentage">
            {{
              Math.round(
                (reviews.filter((review) => review.stars === stars).length /
                  reviews.length) *
                  100
              )
            }}%
          </span>
        </div>
      </div>
    </div>
    <div v-else-if="!reviews.length">
      <p>Be the first to comment on this product...</p>
    </div>

    <div
      v-if="reviews.length"
      class="col-12 col-md-9 mx-auto carousel slide carousel-fade"
      id="reviewsCarousel"
      data-bs-ride="true"
    >
      <div class="carousel-inner p-2 rounded text-white fw-bolder text-center" 
      style="background-color: #117b99;"
      >
        <div class="carousel-item active " data-bs-interval="3000">
            <i class="bi bi-quote fs-1"></i>
          <h6 v-if="reviews[0].name">{{ reviews[0].name }}</h6>                    
          <p class="my-5">{{ reviews[0].comment }}</p>
          <p class="form-text">
            {{ formatDate(reviews[0].date) }}
          </p>
        </div>
        <div
          v-for="review in reviews.slice(1)"
          :key="review._id"
          class="carousel-item"
          data-bs-interval="3000"
        >
        <i class="bi bi-quote fs-1"></i>
          <h6 v-if="review.name">{{ review.name }}</h6>
          
          <p class="my-5">{{ review.comment }}</p>
          <p class="form-text">
            {{ formatDate(review.date) }}
          </p>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#reviewsCarousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#reviewsCarousel"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <form @submit.prevent="postReview" class="review-form">
      <div class="rating-input">
        <span class="rating-label">Star Rating</span>
        <i
          v-for="(count, index) in 5"
          :key="index"
          class="mx-1 bi"
          :class="count > starRating ? 'bi-star' : 'bi-star-fill'"
          @click="count > starRating ? starRating++ : starRating--"
        ></i>
      </div>
      
      <div class="input-group">
        <textarea
          v-model="comment"
          class="form-control"
          placeholder="Post a review..."
          rows="3"
          required
        ></textarea>
        <button type="submit" role="submit" class="btn send-btn">Post</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { getImageUrl } from "../assets";
import { formatDate } from "../Mixins";
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import { useStore } from "vuex";

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
});

const store = useStore();

// Reactive state
const reviews = ref([]);
const starRating = ref(0);
const comment = ref("");

// Computed properties
const name = computed(() => {
  return store.getters.GET_USER?.fullName;
});

const url = computed(() => {
  return props.product ? `reviews?pId=${props.product._id}` : `reviews`;
});

const fetchReviews = async () => {
  const response = await axios(url.value);
  reviews.value = response.data;
};

const postReview = async () => {
  await axios.post(url.value, {
    stars: starRating.value,
    comment: comment.value,
    name: name.value,
  });

  alert("Review added successfully.\n Thanks for your feedback.");
  fetchReviews();
  starRating.value = 0;
  comment.value = "";
};

const updateReview = async (id) => {
  const reviewUrl = props.product
    ? `reviews/${id}?productId=${props.product._id}`
    : `reviews/${id}`;
  await axios.patch(reviewUrl, edit.value);
  alert("Review updated successfully.\n Thanks for your feedback.");
  fetchReviews();
  edit.value = {
    id: null,
    state: false,
    stars: 0,
    comment: "",
  };
};

const deleteReview = async (id) => {
  try {
    const reviewUrl = props.product
      ? `reviews/${id}?productId=${props.product._id}`
      : `reviews/${id}`;
    await axios.delete(reviewUrl);
    alert("Review deleted successfully.");
    fetchReviews();
  } catch (error) {
    alert(error);
  }
};

// Watcher
watch(() => props.product, fetchReviews);

// Lifecycle hook
onMounted(() => {
  requestIdleCallback(fetchReviews);
});
</script>

<style scoped>
.review-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.section-title {
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.rating-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.rating-overview {
  flex: 1;
  text-align: center;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.rating-overview p {
  margin: 0;
}

.average-rating {
  font-size: 2.5rem;
  font-weight: bold;
  color: #007bff;
}

.rating-distribution {
  flex: 2;
}

.star-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.star-label {
  flex: 1;
}

.rating-progress {
  flex: 3;
  height: 20px;
  margin: 0 10px;
  background-color: #e9ecef;
  border-radius: 10px;
}

.star-percentage {
  flex: 1;
  text-align: right;
}

.review-card {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px;
  transition: transform 0.3s ease;
}

.review-card.editing {
  transform: scale(1.02);
}

.card-body {
  padding: 0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.avatar-container {
  flex: 0 0 50px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.review-info {
  flex: 1;
  margin-left: 10px;
}

.reviewer-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

.review-date {
  margin: 0;
  font-size: 0.9rem;
  color: #888;
}

.stars i {
  color: #ffd700; /* Gold color for stars */
}

.stars .grey {
  color: #ddd;
}

.editing-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.comment-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.action-icon {
  cursor: pointer;
  color: #888;
}

.action-icon:hover {
  color: #333;
}

.review-form {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  max-width: 800px;
  margin: 0 auto;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: #333;
}

.rating-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.rating-label {
  margin-right: 10px;
  font-weight: bold;
}

.send-btn {
  background-color: #007bff;
  color: #ffffff;
}

.send-btn:hover {
  background-color: #0056b3;
}
</style>
