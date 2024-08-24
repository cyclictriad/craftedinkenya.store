<template>
    <ul class="list-inline payment-icons">
      <h5 class="mb-3 text-md-right">We Accept</h5>
        <li class="list-inline-item"><i class="bi bi-credit-card"></i></li>
        <li class="list-inline-item"><i class="bi bi-paypal"></i></li>
        <li class="list-inline-item"><i class="bi bi-apple"></i></li>
        <li class="list-inline-item"><i class="bi bi-google"></i></li>
        <li class="list-inline-item"><i class="bi bi-afterpay"></i></li>
    </ul>
</template>

<script>

export default{
    name:'PaymentIcons',

}

</script>

<style scoped>
  .payment-icons i {
    margin-right: 10px; /* Adjust margin for payment icons */
    font-size: 24px;
    color: #6c757d;
    margin-right: 15px; /* Add some margin between the icons */
  }
</style>