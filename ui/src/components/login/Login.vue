<template>
    <vs-dialog prevent-close not-close v-model="active">
        <template #header>
            <h4 class="not-margin">
                Welcome to <b>Kumehonger</b>
            </h4>
        </template>


        <div class="con-form">
            <vs-input v-model="loginRequest.email" placeholder="Email">
                <template #icon>
                    <box-icon name="user"></box-icon>
                </template>
            </vs-input>
            <vs-input type="password" v-model="loginRequest.password" placeholder="Password">
                <template #icon>
                  <box-icon name="lock"></box-icon>
                </template>
            </vs-input>
            <div class="flex">
                <a href="#">Forgot Password?</a>
            </div>
        </div>

        <template #footer>
            <div class="footer-dialog">
                <vs-button block v-on:click="signIn()">
                    Sign In
                </vs-button>

                <div class="new">
                    New Here? <a href="#">Create New Account</a>
                </div>
            </div>
        </template>
    </vs-dialog>
</template>

<script>
    import LoginRequest from "./login-request";

    export default {
        name: 'Login',
        props: {
        },
        data: () => ({
            loginRequest: new LoginRequest(),
            active: true,
        }),
        methods: {
            signIn: function() {
                this.$store.dispatch('AUTH_LOGIN', this.loginRequest).then(() => {
                    this.$router.push('/');
                });
            }
        }
    }
</script>

<style>
    .label vs-input {
        margin: 10px;
    }

  .not-margin {
    margin: 0px;
    font-weight: normal;
    padding: 10px;
  }

  .con-form {

  }

  .con-form .vs-input-content {
    margin: 10px 0px;
    width: calc(100%);
  }

  .con-form .vs-input {
    width: 100%;
  }
</style>
