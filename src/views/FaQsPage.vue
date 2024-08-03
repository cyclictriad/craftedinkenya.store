<template>
  <div class="container mt-5">
    <h1 class="mb-4">FAQs & Policies</h1>

    <!-- FAQ Accordion -->
    <div class="accordion" id="faqAccordion">
      <!-- General FAQs -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingGeneral">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseGeneral"
            aria-expanded="true"
            aria-controls="collapseGeneral"
          >
            General Questions
          </button>
        </h2>
        <div
          id="collapseGeneral"
          class="accordion-collapse collapse"
          :class="{ show: !target || target === 'faqs' }"
          aria-labelledby="headingGeneral"
          data-bs-parent="#faqAccordion"
        >
          <div class="accordion-body">
            <h6>1. How do I place an order?</h6>
            <p>
              Browse our product catalog, select the items you want, and click
              "Add to Cart". Proceed to checkout and follow the instructions to
              complete your order.
            </p>

            <h6>2. What payment methods do you accept?</h6>
            <p>
              We accept various payment methods including credit/debit cards,
              PayPal, and other secure payment gateways.
            </p>

            <h6>3. How can I track my order?</h6>
            <p>
              Once your order is shipped, you will receive a tracking number via
              email. You can use this number to track your order on our website
              or the carrier's site.
            </p>

            <h6>4. How can I contact customer support?</h6>
            <p>
              You can reach our customer support team via email at
              [support@craftedinkenya.store] or through our contact form on the
              website.
            </p>
          </div>
        </div>
      </div>

      <!-- Privacy Policy -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingPrivacy">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsePrivacy"
            aria-expanded="false"
            aria-controls="collapsePrivacy"
          >
            Privacy Policy
          </button>
        </h2>
        <div
          id="collapsePrivacy"
          class="accordion-collapse collapse"
          :class="{ show: target === 'privacy' }"
          aria-labelledby="headingPrivacy"
          data-bs-parent="#faqAccordion"
        >
          <div class="accordion-body">
            <h5>Effective Date: [Insert Date]</h5>
            <h6>1. Introduction</h6>
            <p>
              We are committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, and safeguard your information when
              you visit our website [craftedinkenya.store].
            </p>
            <h6>2. Information We Collect</h6>
            <p>
              Personal Information: We collect personal information that you
              voluntarily provide to us when you make a purchase or contact us,
              such as your name, email address, and shipping address.
            </p>
            <p>
              Payment Information: We use secure payment gateways to process
              your payment information.
            </p>
            <p>
              Usage Data: We may collect data about your interactions with our
              site to improve our services.
            </p>
            <h6>3. How We Use Your Information</h6>
            <p>
              To Process Transactions: To fulfill orders and manage your
              purchases.
            </p>
            <p>
              To Communicate: To send order updates, respond to inquiries, and
              provide customer support.
            </p>
            <p>
              To Improve Our Services: To analyze usage trends and enhance our
              website.
            </p>
            <h6>4. Data Protection</h6>
            <p>
              We implement appropriate security measures to protect your
              information from unauthorized access, alteration, disclosure, or
              destruction.
            </p>
            <h6>5. Sharing Your Information</h6>
            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to outside parties except for the purposes of
              fulfilling orders and complying with legal obligations.
            </p>
            <h6>6. Your Rights</h6>
            <p>
              You have the right to access, correct, or delete your personal
              information. Contact us at [support@craftedinkenya.store] to
              exercise these rights.
            </p>
            <h6>7. Changes to This Policy</h6>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated effective date.
            </p>
            <h6>8. Contact Us</h6>
            <p>
              For questions about this Privacy Policy, please contact us at
              [support@craftedinkenya.store].
            </p>
          </div>
        </div>
      </div>

      <!-- Refund Policy -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingRefund">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseRefund"
            aria-expanded="false"
            aria-controls="collapseRefund"
          >
            Refund Policy
          </button>
        </h2>
        <div
          id="collapseRefund"
          class="accordion-collapse collapse"
          :class="{ show: target === 'returns' }"
          aria-labelledby="headingRefund"
          data-bs-parent="#faqAccordion"
        >
          <div class="accordion-body">
            <h5>Effective Date: [Insert Date]</h5>
            <h6>1. Introduction</h6>
            <p>
              Our Refund Policy outlines the terms and conditions under which
              you can request a refund for purchases made on
              [craftedinkenya.store].
            </p>
            <h6>2. Eligibility for Refunds</h6>
            <p>
              Product Issues: Refunds are available for products that are
              defective, damaged, or not as described.
            </p>
            <p>
              Return Period: Requests for refunds must be made within 30 days of
              receipt of the product.
            </p>
            <h6>3. Refund Process</h6>
            <p>
              Return Instructions: Contact our customer support at
              [support@craftedinkenya.store] to initiate a return. You will
              receive instructions on how to return the product.
            </p>
            <p>
              Condition of Product: Products must be returned in their original
              condition and packaging.
            </p>
            <p>
              Refund Method: Refunds will be processed to the original payment
              method within 7-10 business days after receiving the returned
              product.
            </p>
            <h6>4. Non-Refundable Items</h6>
            <p>
              Custom Products: Items made to order or personalized are
              non-refundable.
            </p>
            <p>
              Sale Items: Certain sale items may not be eligible for refunds.
            </p>
            <h6>5. Shipping Costs</h6>
            <p>
              Return Shipping: Customers are responsible for return shipping
              costs unless the product is defective or an error was made by us.
            </p>
            <h6>6. Contact Us</h6>
            <p>
              For any questions or concerns about our Refund Policy, please
              contact us at [support@craftedinkenya.store].
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const target = ref(() => route.query?.target);
</script>
  <script>
export default {
  name: "FaqsPage",
};
</script>
  
  <style scoped>
/* Optional: Add any additional styling here */
</style>
  