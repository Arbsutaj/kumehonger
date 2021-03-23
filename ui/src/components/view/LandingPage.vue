<template>
  <div>
    <Header></Header>

    <RestaurantList :restaurants="restaurants" :show-action-buttons="false"></RestaurantList>
    <div class="container">
      <div class="row justify-content-end more-restaurants">
        <a v-on:click="navigateToAllRestaurants()" class="template-btn3 mt-2">See all <span><box-icon type='solid'
                                                                                                      name='right-arrow-alt'></box-icon></span></a>
      </div>
    </div>

    <div class="reservation-area section-padding-menu text-center">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <h2>Below are the ingredients of the food</h2>
            <h4 class="mt-4">above restaurants daily menus</h4>
          </div>
        </div>
      </div>
    </div>

    <div class="daily-menu-area section-padding">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="section-top2 text-center">
              <h3>Our <span>daily</span> menus</h3>
              <p><i>daily menus of most liked restaurants</i></p>
            </div>
          </div>
        </div>
        <div v-for="(menu, i) in menus" :key="i">
          <div class="row" v-if="menu[0]">
            <div class="col-lg-5 col-md-6 align-self-center">
              <h1>0{{ getIndex(1, i) }}.</h1>
              <div class="menu-text">
                <h3><span>{{ menu[0].title }}</span></h3>
                <p class="pt-3">{{ menu[0].ingredients.toString() }}</p>
                <span class="style-change">€{{ menu[0].price }}</span>
              </div>
            </div>
            <div class="col-lg-5 offset-lg-2 col-md-6 align-self-center mt-4 mt-md-0">
              <img :src="'data:image/jpeg;base64,'+menu[0].image.data" alt="" class="img-fluid">
            </div>
          </div>
          <div class="row mt-5" v-if="menu[1]">
            <div class="col-lg-5 col-md-6 align-self-center order-2 order-md-1 mt-4 mt-md-0">
              <img :src="'data:image/jpeg;base64,'+menu[1].image.data" alt="" class="img-fluid">
            </div>
            <div class="col-lg-5 offset-lg-2 col-md-6 align-self-center order-1 order-md-2">
              <h1>0{{ getIndex(2, i) }}.</h1>
              <div class="menu-text">
                <h3><span>{{ menu[1].title }}</span></h3>
                <p class="pt-3">{{ menu[1].ingredients.toString() }}</p>
                <span class="style-change">€{{ menu[1].price }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>

import Header from "@/components/view/Header";
import Footer from "@/components/view/Footer";
import RestaurantList from "@/components/view/RestaurantList";


export default {
  name: "LandingPage",
  components: {RestaurantList, Header, Footer},
  data: () => ({
    restaurants: [],
    page: 1,
    pageLimit: 6,
    menus: [],
    index: 1
  }),
  methods: {
    loadRestaurants: async function () {
      const params = new URLSearchParams([['page', this.page], ['limit', this.pageLimit], ['sort', 'likes,asc']]);

      await this.axios.get(`/restaurant/paginated`, {params}).then(async res => {
        this.restaurants = res.data.restaurants;
        const restaurants = {restaurants: this.restaurants.map(m => m.id)};
        await this.loadMenus(restaurants);
      });
    },
    navigateToAllRestaurants: function () {
      this.$router.push('/all-restaurants');
    },
    getIndex: function (firstOrSecond, index) {
      if (firstOrSecond === 1)
        return firstOrSecond * index + (index + 1);

      return firstOrSecond * index + 2;
    },
    loadMenus: async function (restaurants) {
      await this.axios.put(`menu/of-the-week`, restaurants).then((resp) => {
        for (let i = 0; i < resp.data.length; i++) {
          let menus = [];
          menus.push(resp.data[i]);
          if (++i <= resp.data.length)
            menus.push(resp.data[i]);

          this.menus.push(menus);
        }
      });
    }
  },
  created() {
    this.loadRestaurants();
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700");
@import url("https://fonts.googleapis.com/css?family=Playfair+Display:400,700");

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

@-webkit-keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0)
  }
  100% {
    -webkit-transform: scale(1);
    opacity: 0
  }
}

@keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0)
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0
  }
}

b, sup, sub, u, del {
  color: #f8b600
}

h2 {
  color: #fff;
  font-family: "Playfair Display", serif;
  font-size: 42px !important;
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

.template-btn3 {
  color: #131230;
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  position: relative
}

.template-btn3 span {
  position: absolute;
  top: 0;
  left: 110%;
  color: #131230;
  -webkit-transition: all .5s;
  -moz-transition: all .5s;
  -o-transition: all .5s;
  transition: all 0.5s
}

.template-btn3:hover {
  color: #131230
}

.template-btn3:hover span {
  color: #ffb606;
  left: 115%
}

.section-top2 .style-change {
  color: #ffb606;
  font-family: "Playfair Display", sans-serif;
  font-size: 25px;
  font-weight: 700;
  -webkit-transition: .5s;
  -moz-transition: .5s;
  -o-transition: .5s;
  transition: .5s;
  font-style: italic;
}

h3 {
  color: #131230;
  font-family: "Playfair Display", serif !important;
  font-size: 36px !important;
  font-weight: 700
}

.daily-menu-area img {
  max-width: 300px;
  max-height: 300px;
  min-width: 300px;
  min-height: 300px;

}

.daily-menu-area span {
  color: #ffb606
}

.daily-menu-area h1 {
  color: #131230;
  font-family: "Playfair Display", serif !important;
  font-style: inherit;
  position: relative
}

.daily-menu-area h1:after {
  content: '';
  position: absolute;
  top: 30px;
  left: 90px;
  width: 200px;
  height: 1px;
  background: #131230
}

.daily-menu-area .style-change {
  font-family: "Roboto", sans-serif;
  font-size: 30px;
  font-weight: 700;
  display: block
}

.daily-menu-area .menu-text {
  padding-right: 150px;
}

@media (max-width: 575.98px) {
  .daily-menu-area .menu-text {
    padding-left: 0
  }
}

h1 {
  padding-right: 300px;
}

.pt-3 {
  color: #777;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 400;
}

.reservation-area {
  background-image: url("../../assets/images/reservation-bg.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover
}

.section-padding-menu {
  padding: 130px 0
}

</style>