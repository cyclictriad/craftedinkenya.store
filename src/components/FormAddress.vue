<script setup>
const props = defineProps({
    address:{
        type:Object,
        required:true
    },
    errors:{
      type:String
      
    }
})

</script>

<template>
  <div
    id="addressForm"
   class="text-start"
  >
  <div class="form-text">Fields marked in <sup class="required-marker">*</sup> must be filled</div>
    <div class="col-auto">
      <label for="name" class="form-label">Name <sup class="required-marker">*</sup></label>
      <input
        v-model="address.recipient_name"
        type="text"
        class="form-control"
        id="name"
        name="name"
        placeholder="John Doe"
        autocapitalize="words"
        autocomplete="name"
        required
        aria-required="true"
      />
      <p v-if="errors.includes('recipient_name')" class="w-100 form-text text-danger">Please enter a valid name</p>
    </div>
    <div class="col-auto">
      <label for="address-line-1" class="form-label">Street <sup class="required-marker">*</sup></label>
      <input
        v-model="address.address_line_1"
        type="text"
        class="form-control"
        id="address-line-1"
        name="address_line_1"
        placeholder="123, test road"
        autocomplete="street-address"
        required
        aria-required="true"
      />
      <p v-if="errors.includes('address_line_1')" class="w-100 form-text text-danger">Please enter a valid street address</p>
    </div>
    <div class="col-auto">
      <label for="address-line2" class="form-label">Address Line 2</label>
      <input
        v-model="address.address_line_2"
        type="text"
        class="form-control"
        id="address-line-2"
        name="address_line_2"
        placeholder="123, test road"
        autocomplete="address-line2"
        aria-required="false"
      />
    </div>
    <div class="col-auto">
      <label for="city" class="form-label">City <sup class="required-marker">*</sup></label>
      <input
        v-model="address.city"
        type="text"
        class="form-control"
        id="city"
        name="city"
        placeholder="New York"
        autocomplete="address-level2"
        required
        aria-required="true"
      />
      <p v-if="errors.includes('city')" class="w-100 form-text text-danger">Please enter a valid city name</p>
    </div>
    <div class="col-auto">
      <label for="state" class="form-label">State <sup class="required-marker">*</sup></label>
      <input
        v-model="address.state"
        type="text"
        class="form-control"
        id="state"
        name="state"
        placeholder="New York or NY"
        autocomplete="address-level1"
        required
        aria-required="true"
      />
      <p v-if="errors.includes('state')" class="w-100 form-text text-danger">Please enter a valid state code</p>

    </div>
    <div class="col-auto">
      <label for="postal-code" class="form-label">Postal Code <sup class="required-marker">*</sup></label>
      <input
        v-model="address.postal_code"
        type="text"
        class="form-control"
        id="postal-code"
        name="postal_code"
        placeholder="12345"
        autocomplete="postal-code"
        required
        aria-required="true"
      />
      <p v-if="errors.includes('postal_code')" class="w-100 form-text text-danger">Please enter a valid postal code </p>

    </div>
    <div class="col-auto">
      <label for="country" class="form-label">Country <sup class="required-marker">*</sup></label>
      <input
        v-model="address.country_code"
        type="text"
        class="form-control"
        id="country"
        name="country_code"
        placeholder="United States or US"
        autocomplete="country-name"
        required
        aria-required="true"
      />
      <p v-if="errors.includes('country_code')" class="w-100 form-text text-danger">Please enter a valid country code</p>
    </div>
    <div class="col-auto">
      <label for="phone" class="form-label">Phone </label>
      <input
        v-model="address.phone_number"
        type="tel"
        class="form-control"
        id="phone"
        name="phone_number"
        placeholder="+(251) 123456"
        autocomplete="tel"
        aria-required="false"
      />
    </div>
  </div>
</template>

<style>
.required-marker{
  color:red;
  padding-top: 45px;;
  margin:15px 3px 0px 3px;
}
label{
  box-sizing: border-box;
}
</style>