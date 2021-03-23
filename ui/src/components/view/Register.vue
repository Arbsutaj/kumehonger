<template>
  <div class="main">
    <div class="page-wrapper p-t-180 p-b-100 font-robo">
      <div class="wrapper wrapper--w960">
        <div class="card card-2">
          <div class="card-heading"></div>
          <div class="card-body">
            <h2 class="title">Registration Info
              <br>
              <hr>
            </h2>
            <div class="row row-space">
              <div class="col-4">
                <vs-input border v-model="registerRequest.firstName" label="Name" color="success">
                  <template v-if="userRequestValidation.nameError" #message-danger>
                    Name is required!
                  </template>
                </vs-input>
              </div>
              <div class="col-4">
                <vs-input border v-model="registerRequest.lastName" label="Last Name" color="success">
                  <template v-if="userRequestValidation.lastNameError" #message-danger>
                    Last Name is required!
                  </template>
                </vs-input>
              </div>
            </div>
            <hr class="mt-2">
            <div class="row row-space">
              <div class="col-4 mt-5">
                <vs-input border label="Email" v-model="registerRequest.email" color="success">
                  <template v-if="userRequestValidation.emailError" #message-danger>
                    Email not correct!
                  </template>
                </vs-input>
              </div>
            </div>
            <hr class="mt-2">
            <div class="row row-space">
              <div class="col-4 mt-5">
                <vs-input type="password" color="success" border v-model="registerRequest.password" label="Password">
                  <template #icon>
                    <box-icon name="lock"></box-icon>
                  </template>
                  <template v-if="userRequestValidation.passwordError" #message-danger>
                    Password not correct!
                  </template>
                  <template v-if="userRequestValidation.passwordsNotEqual" #message-danger>
                    Passwords are not equal!
                  </template>
                </vs-input>
              </div>
              <div class="col-4 mt-5">
                <vs-input type="password" color="success" border v-model="passwordRepeat" label="Repeat password">
                  <template #icon>
                    <box-icon name="lock"></box-icon>
                  </template>
                  <template v-if="userRequestValidation.passwordError" #message-danger>
                    Password not correct!
                  </template>
                  <template v-if="userRequestValidation.passwordsNotEqual" #message-danger>
                    Passwords are not equal!
                  </template>
                </vs-input>
              </div>
            </div>
            <hr class="mt-2">
            <div class="row row-space mt-5">
              <div class="col-4">
                <vs-input color="success" type="date" v-model="registerRequest.dateOfBirth" label="Date" border>
                  <template v-if="userRequestValidation.dateOfBirthError" #message-danger>
                    Date of birth is required!
                  </template>
                </vs-input>
              </div>
              <div class="col-5">
                <vs-select label="Gender" v-model="registerRequest.gender" color="success" state="success">
                  <vs-option label="Female" value="1">
                    Female
                  </vs-option>
                  <vs-option label="Male" value="2">
                    Male
                  </vs-option>
                  <template v-if="userRequestValidation.genderError" #message-danger>
                    Gender is required!
                  </template>
                </vs-select>
              </div>
            </div>
            <hr class="mt-2">
            <div class="mt-4 left-side">
              <vs-button class="login-btn" success flat v-on:click="register()">
                Register
              </vs-button>
              <span>Do you already have an account? <a v-on:click="navigateToLogin()">Login</a></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {CreateUserRequest} from "@/components/user/create.user.request";

export default {
  name: "Register",
  data: () => ({
    registerRequest: new CreateUserRequest(),
    userRequestValidation: {},
    passwordRepeat: ''
  }),
  methods: {
    register: async function () {
      const hasError = this.validateUserRequest(this.registerRequest);

      if (!hasError) {
        await this.axios.post(`users/register`, this.registerRequest)
            .then(() => {
              this.$router.push('/login');
            });
      }
    },
    validateUserRequest: function (user) {
      this.userRequestValidation = {};
      let hasError = false;
      if (!user.firstName) {
        hasError = true;
        this.userRequestValidation.nameError = true;
      }

      if (!user.lastName) {
        hasError = true;
        this.userRequestValidation.lastNameError = true;
      }

      if (!user.gender) {
        hasError = true;
        this.userRequestValidation.genderError = true;
      }

      if (!user.dateOfBirth) {
        hasError = true;
        this.userRequestValidation.dateOfBirthError = true;
      }

      if (!user.email) {
        hasError = true;
        this.userRequestValidation.emailError = true;
      }

      if (user.email) {
        const isValid = this.isEmailValid(user.email);
        if (!isValid) {
          hasError = true;
          this.userRequestValidation.emailError = true;
        }
      }

      if (!user.password) {
        hasError = true;
        this.userRequestValidation.passwordError = true;
      }

      if (user.password) {
        if(user.password !== this.passwordRepeat) {
          hasError = true;
          this.userRequestValidation.passwordsNotEqual = true;
        }
        if (user.password.length < 8) {
          hasError = true;
          this.userRequestValidation.passwordError = true;
        }
      }

      return hasError;
    },
    isEmailValid: function (email) {
      return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
    },
    navigateToLogin: function() {
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.main {
  background-color: #d0d0ce;
}
.font-robo {
  font-family: "Roboto", "Arial", "Helvetica Neue", sans-serif;
}

.row {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.row-space {
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -moz-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}


@media (max-width: 767px) {
  .col-2 {
    width: 100%;
  }
}

html {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

* {
  padding: 0;
  margin: 0;
}

*, *:before, *:after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
}


/**
 * Remove default table spacing.
 */
table {
  border-collapse: collapse;
  border-spacing: 0;
}

/**
 * 1. Reset Chrome and Firefox behaviour which sets a `min-width: min-content;`
 *    on fieldsets.
 */
fieldset {
  min-width: 0;
  /* [1] */
  border: 0;
}

button {
  outline: none;
  background: none;
  border: none;
}

/* ==========================================================================
   #PAGE WRAPPER
   ========================================================================== */
.page-wrapper {
  min-height: 100vh;
}

h2 {
  font-size: 30px;
  color: black;
  font-weight: 400;

}

.p-t-180 {
  padding-top: 180px;
}

.p-b-100 {
  padding-bottom: 100px;
}

.wrapper {
  margin: 0 auto;
}

.wrapper--w960 {
  max-width: 960px;
}

.login-btn {
  padding: 13px 20px;
  background-color: #fdbb28;
  color: #fff;
}

.login-btn:hover {
  border: 1px solid #fdbb28;
  background-color: #fff;
  color: #fdbb28;
}

input[type="date" i] {
  padding: 14px;
}

.table-condensed td, .table-condensed th {
  font-size: 14px;
  font-family: "Roboto", "Arial", "Helvetica Neue", sans-serif;
  font-weight: 400;
}

input {
  outline: none;
  margin: 0;
  border: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  width: 100%;
  font-size: 14px;
  font-family: inherit;
}

.title {
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 37px;
}

.card {
  overflow: hidden;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  background: #fff;
}

.card-2 {
  -webkit-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  width: 100%;
  display: table;
}

.card-2 .card-heading {
  background: url("../../assets/images/welcome-bg.png") top left/cover no-repeat;
  width: 29.1%;
  display: table-cell;
}

.card-2 .card-body {
  display: table-cell;
  padding: 80px 90px;
  padding-bottom: 88px;
}

@media (max-width: 767px) {
  .card-2 {
    display: block;
  }

  .card-2 .card-heading {
    width: 100%;
    display: block;
    padding-top: 300px;
    background-position: left center;
  }

  .card-2 .card-body {
    display: block;
    padding: 60px 50px;
  }
}

.left-side {
  float: left;
}

</style>