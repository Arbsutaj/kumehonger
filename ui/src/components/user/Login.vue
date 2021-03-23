<template>
  <div class="d-flex align-items-center min-vh-100 py-3 py-md-0 main">
    <div class="container">
      <div class="card login-card">
        <div class="row no-gutters">
          <div class="col-md-5">
            <img src="../../assets/images/food-bg.png" class="login-card-img">
          </div>
          <div class="col-md-7">
            <div class="card-body">
              <div class="brand-wrapper row">
                <h2>Ku me honger?</h2>
              </div>
              <div class="row">
                <p class="login-card-description">Sign into your account</p>
              </div>
              <div class="form">
                <div class="form-group">
                  <input type="email" name="email" id="email" class="form-control" placeholder="Email address" v-model="loginRequest.email">
                </div>
                <div class="form-group mb-4">
                  <input type="password" name="password" id="password" class="form-control" placeholder="***********" v-model="loginRequest.password">
                </div>
                <input name="login" id="login" class="btn btn-block login-btn mb-4" type="button" value="Login" v-on:click="login()">
              </div>
              <div class="mt-5">
                <p class="login-card-footer-text row">Don't have an account?<a v-on:click="navigateToRegister()" class="text-reset">Register
                  here</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginRequest from "@/components/user/transport/login-request";

export default {
  name: "Login",
  data: () => ({
    loginRequest: new LoginRequest(),
  }),
  methods: {
    navigateToRegister: function() {
      this.$router.push('/register');
    },
    login: function() {
      this.$store.dispatch('AUTH_LOGIN', this.loginRequest).then(() => {
        this.$router.push('/');
      });
    }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Karla:wght@200;300&display=swap");
.main {
  font-family: "Karla", sans-serif;
  background-color: #d0d0ce;
  min-height: 100vh;
}
.login-card-img {
  max-height: 700px;
}
h2 {
  color: black;
}

.brand-wrapper {
  margin-bottom: 19px;
}

.login-card {
  border: 0;
  border-radius: 27.5px;
  box-shadow: 0 10px 30px 0 rgba(172, 168, 168, 0.43);
  overflow: hidden;
}

.login-card .card-body {
  padding: 85px 60px 60px;
}

@media (max-width: 422px) {
  .login-card .card-body {
    padding: 35px 24px;
  }
}

.login-card-description {
  font-size: 25px;
  color: #000;
  font-weight: normal;
  margin-bottom: 23px;
}

.card-body .form {
  max-width: 326px;
}

.login-card .form-control {
  border: 1px solid #d5dae2;
  padding: 15px 25px;
  margin-bottom: 20px;
  min-height: 45px;
  font-size: 13px;
  line-height: 15;
  font-weight: normal;
}

.login-card .form-control::-webkit-input-placeholder {
  color: #919aa3;
}

.login-card .form-control::-moz-placeholder {
  color: #919aa3;
}

.login-card .form-control:-ms-input-placeholder {
  color: #919aa3;
}

.login-card .form-control::-ms-input-placeholder {
  color: #919aa3;
}

.login-card .form-control::placeholder {
  color: #919aa3;
}

.login-card .login-btn {
  padding: 13px 20px 12px;
  background-color: #000;
  border-radius: 4px;
  font-size: 17px;
  font-weight: bold;
  line-height: 20px;
  color: #fff;
  margin-bottom: 24px;
}

.login-card .login-btn:hover {
  border: 1px solid #000;
  background-color: transparent;
  color: #000;
}

.login-card .forgot-password-link {
  font-size: 14px;
  color: #919aa3;
  margin-bottom: 12px;
}

.login-card-footer-text {
  font-size: 16px;
  color: #0d2366;
  margin-bottom: 60px;
}

@media (max-width: 767px) {
  .login-card-footer-text {
    margin-bottom: 24px;
  }
}

.login-card-footer-nav a {
  font-size: 14px;
  color: #919aa3;
}
</style>