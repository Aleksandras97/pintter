<template>
  <form @submit.prevent="SubmitForm" class="q-pa-xl">
    <div class="form-control q-py-lg">
      <q-input
        standout="bg-primary text-white"
        v-model.trim="email"
        label="Email"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'Please type something',
          (val) => val.includes('@') || 'Please type real email',
        ]"
      />
    </div>
    <div class="form-control q-py-lg">
      <q-input
        label="Password"
        standout="bg-primary text-white"
        v-model.trim="password"
        :type="isPwd ? 'password' : 'text'"
        hint="Password with toggle"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'Please type your password',
          (val) =>
            val.length > 6 || 'password must be greater then 6 characters',
        ]"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
    </div>
    <div>
      <q-btn
        :loading="isLoading"
        :label="submitButtonCaption"
        type="submit"
        color="primary"
        class="q-ml-sm"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
      <q-btn
        icon="fas fa-sync-alt"
        :label="switchModeButtonCaption"
        @click="switchAuthMode"
        type="button"
        color="primary"
        class="q-ml-sm"
      />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />

    </div>
  </form>
</template>

<script>
import { Notify } from "quasar";

export default {
  data() {
    return {
      email: "",
      password: "",
      isPwd: true,
      mode: "login",
      isLoading: false,
      error: null,
    };
  },
  methods: {
    showNotif(type, color, message, icon) {
      const textColor = "white";

      Notify.create({
        type,
        color,
        textColor,
        icon: icon ? icon : null,
        message,
        position: "bottom-right",
        avatar: null,
        multiLine: null,
        actions: null,
        timeout: Math.random() * 5000 + 3000,
      });
    },
    clearValidity(input) {
      this[input].isValid = true;
    },
    async SubmitForm() {
      this.isLoading = true;

      if (
        (this.email === "" && !this.email.includes("@"),
        this.password === "",
        this.password.length < 6)
      ) {
        this.isLoading = false;
        return;
      }

      try {
        if (this.mode === "login") {

          await this.$store.dispatch("login", {
            email: this.email,
            password: this.password,
          });

          this.showNotif(
            "positive",
            "green",
            "You have successfully logedin!",
            null
          );

        } else {

          this.$store.dispatch("signup", {
            email: this.email,
            password: this.password,
          });

          this.showNotif(
            "positive",
            "green",
            "You have successfully signup!",
            null
          );
        }

        const redirectURL = "/" + (this.$route.query.redirect || "pints");
        this.$router.replace(redirectURL);

      } catch (err) {
        this.error = err;
        this.showNotif(
          "negative",
          "red",
          err,
          null
        );
      }

      this.isLoading = false;
    },
    switchAuthMode() {
      if (this.mode === "login") {
        this.mode = "signup";
      } else {
        this.mode = "login";
      }
    },
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === "login") {
        return "Login";
      } else {
        return "Signup";
      }
    },
    switchModeButtonCaption() {
      if (this.mode === "login") {
        return "Signup instead";
      } else {
        return "Login instead";
      }
    },
    // user() {
    //   return this.$store.getters['auth'].userId
    // }
  },
};
</script>

<style scoped></style>
