<template>
    <div class="text-white text-center font-bold p5 mb-4"
        v-if="reg_show_alert" :class="reg_alert_variant">
        {{reg_alert_msg}}
    </div>
    <vee-form :validation-schema="schema"
        @submit="register" :initial-values="userData" >
        <!-- Name -->
        <div class="mb-3">
            <label class="inline-block mb-2" for="register-name">Name
            <vee-field type="text" name="name" id="register-name"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Name" />
                <ErrorMessage class="text-red-600" name="name" />
            </label>
        </div>
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2" for="register-email">Email
            <vee-field type="email" name="email" id="register-email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
                <ErrorMessage class="text-red-600" name="email" />
            </label>
        </div>
        <!-- Age -->
        <div class="mb-3">
            <label class="inline-block mb-2" for="register-age">Age
            <vee-field type="number" name="age" id="register-age"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded" />
                <ErrorMessage class="text-red-600" name="age" />
            </label>
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2" for="register-password">Password
            <vee-field name="password" id="register-password"
                :bails="false" v-slot="{ field, errors }" >
                <input class="block w-full py-1.5 px-3 text-gray-800 border
                border-gray-300 transition duration-500 focus:outline-none
                focus:border-black rounded" type="password"
                placeholder="Password" v-bind="field"/>
                <div class="text-red-600" v-for="error in errors" :key="error">
                {{ error }}
                </div>
            </vee-field>
            </label>
        </div>
        <!-- Confirm Password -->
        <div class="mb-3">
            <label class="inline-block mb-2" for="register-confirm-password">Confirm Password
            <vee-field type="password" name="confirm_password" id="register-confirm-password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Confirm Password" />
                <ErrorMessage class="text-red-600" name="confirm_password" />
            </label>
        </div>
        <!-- Country -->
        <div class="mb-3">
            <label class="inline-block mb-2" for="register-country">Country
            <vee-field as="select" name="country" id="register-country"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded">
                <option value="USA">USA</option>
                <option value="Mexico">Mexico</option>
                <option value="Germany">Germany</option>
                <option value="Antarctica">Antarctrica</option>
            </vee-field>
                <ErrorMessage class="text-red-600" name="country" />
            </label>
        </div>
        <!-- Subscription Level -->
        <div class="mb-3">
            <label class="inline-block mb-2" for="register-subscription-level">Subscription
            <vee-field as="select" name="subscription" id="register-subscription-level"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded">
                <option value="Free">Free</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
            </vee-field>
                <ErrorMessage class="text-red-600" name="subscription" />
            </label>
        </div>
        <!-- TOS -->
        <div class="mb-3 pl-6">
            <label class="inline-block" for="register-tos">
            <vee-field id="register-tos" type="checkbox" name="tos" value="1"
                class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
            Accept terms of service</label>
            <ErrorMessage class="text-red-600" name="tos" />
        </div>
        <button type="submit" :disabled="reg_in_submission"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
            hover:bg-purple-700">
            Submit
        </button>
    </vee-form>
</template>

<script>

export default {
  name: 'registration-form',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|email',
        age: 'required|min_value:18|max_value:99',
        password: 'required|min:3|max:100',
        confirm_password: 'required|passwords_mismatch:@password',
        country: 'required|country_excluded:Antarctica',
        subscription: 'required',
        tos: 'tos',
      },
      userData: {
        country: 'USA',
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'Please wait! Your accountis being created.',
    };
  },
  methods: {
    async register(values) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = 'bg-blue-500';
      this.reg_alert_msg = 'Please wait! Your account is being created.';

      try {
        await this.$store.dispatch('register', values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = 'bg-red-500';
        this.reg_alert_msg = 'An unexpected error occured.';
        console.log(error);
        return;
      }

      this.reg_alert_variant = 'bg-green-500';
      this.reg_alert_msg = 'Success! Your account has been created.';
      window.location.reload();
    },
  },
};
</script>

<style>

</style>
