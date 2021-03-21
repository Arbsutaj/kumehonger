<template>
  <div>
    <header class="header-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-2">
          </div>
          <div class="col-lg-10">
            <div class="main-menu">
              <ul>
                <li class="active" v-for="(menuItem, i) in menuItems.items" :key="i"><a v-on:click="navigateTo(menuItem.route)">{{menuItem.name}}</a>
                  <ul class="sub-menu"  v-if="menuItem.children">
                    <li v-for="(childMenuItem, j) in menuItem.children" :key="j"><a v-on:click="navigateTo(childMenuItem.route)">{{childMenuItem.name}}</a></li>
                  </ul>
                </li>
                <li class="active" v-if="!isLoggedIn">
                  <a v-on:click="navigateTo('/register')">Login or Register</a>
                </li>
                <li class="active" v-else>
                  <a v-on:click="logout()">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
    <section class="banner-area text-center">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <h6>Find the best food in your town</h6>
            <h1>Ku me <span class="prime-color">honger</span>?</h1>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {SideBar} from "../side-bar/SideBarItems";

export default {
  name: "Header",
  data: () => ({
    menuItems: SideBar
  }),
  methods: {
    navigateTo: function(path) {
      this.$router.push(path);
    },
    logout: async function () {
      await this.$store.dispatch('AUTH_LOGOUT');
      await this.$router.push('/login');
    }
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isAuthenticated
    }
  },
  created() {
  }
}
</script>

<style scoped>
body {
  color: #777;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 400
}

h1 {
  color: #fff;
  font-family: "Playfair Display", serif;
  font-size: 60px !important;
  font-weight: 700;
  font-style: italic
}

h2 {
  color: #fff;
  font-family: "Playfair Display", serif;
  font-size: 42px !important;
  font-weight: 700
}

h3 {
  color: #131230;
  font-family: "Playfair Display", serif;
  font-size: 36px !important;
  font-weight: 700
}

h4 {
  color: #fff;
  font-family: "Roboto", sans-serif;
  font-size: 24px !important;
  font-weight: 400;
  font-style: italic;
  text-transform: capitalize
}

h5 {
  color: #131230;
  font-family: "Playfair Display", serif;
  text-transform: capitalize;
  font-size: 20px !important;
  font-weight: 700
}

h6 {
  color: #fff;
  font-size: 16px !important;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  text-transform: uppercase
}

ul {
  margin: 0;
  padding: 0;
  list-style: none
}

a:hover, a:focus {
  text-decoration: none
}

input:focus, textarea:focus {
  outline: none
}

.main-menu ul {
  float: right
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .main-menu ul {
    display: none;
    float: left;
    position: absolute;
    top: 20px;
    left: 0;
    z-index: 4;
    background: #f9f9ff;
    width: 100%;
    padding: 20px 20px 30px
  }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .main-menu ul {
    display: none;
    float: left;
    position: absolute;
    top: 20px;
    left: 0;
    z-index: 4;
    background: #f9f9ff;
    width: 100%;
    padding: 20px 20px 30px
  }
}

@media (max-width: 575.98px) {
  .main-menu ul {
    display: none;
    float: left;
    position: absolute;
    top: 20px;
    left: 0;
    z-index: 4;
    background: #f9f9ff;
    width: 100%;
    padding: 20px 20px 30px
  }
}

.main-menu ul li {
  display: inline;
  position: relative
}



@media (min-width: 768px) and (max-width: 991.98px) {
  .main-menu ul li {
    display: block
  }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .main-menu ul li {
    display: block
  }
}

@media (max-width: 575.98px) {
  .main-menu ul li {
    display: block
  }
}

.main-menu ul li a {
  color: #fff;
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;
  display: inline-block;
  padding: 15px
}

.main-menu ul li a:hover {
  color: #ffb606
}

.main-menu ul li:hover ul.sub-menu {
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
  opacity: 1;
  visibility: visible;
  top: 100%
}

.main-menu ul li ul.sub-menu {
  padding: 10px;
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: 150%;
  left: 30px;
  width: 250px;
  z-index: 2;
  -webkit-transition: .5s;
  -moz-transition: .5s;
  -o-transition: .5s;
  transition: .5s
}

.main-menu ul li ul.sub-menu li {
  display: block
}

.main-menu ul li ul.sub-menu li a {
  -webkit-transition: .3s;
  -moz-transition: .3s;
  -o-transition: .3s;
  transition: .3s
}

.main-menu ul li ul.sub-menu li a:hover {
  color: #ffb606
}

.header-area {
  padding: 20px 0;
  /*background: #fff;*/
  position: absolute;
  color: #fff;
  top: 20px;
  left: 50%;
  width: 80%;
  z-index: 1;
  -webkit-transform: translate(-50%, 0);
  -moz-transform: translate(-50%, 0);
  -ms-transform: translate(-50%, 0);
  -o-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -ms-border-radius: 3px;
  -o-border-radius: 3px;
  border-radius: 3px
}

@media (min-width: 1200px) and (max-width: 1440px) {
  .header-area {
    width: 90%
  }
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  .header-area {
    width: 100%
  }
}

@media (max-width: 575.98px) {
  .header-area {
    width: 100%
  }
}

.banner-area {
  padding: 150px 150px;
  background-color: #b0b0b0;
  background-image: url("../../assets/images/banner-bg.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: relative;
  height: 150px !important;
}

.banner-area .prime-color {
  color: #ffb606
}

.banner-area .style-change {
  font-style: normal
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .banner-area {
    padding: 280px 0 200px
  }
}

@media (max-width: 575.98px) {
  .banner-area {
    padding: 200px 0 140px
  }
}
</style>