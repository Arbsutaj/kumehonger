<template>
  <div>
    <Header></Header>

    <RestaurantList :restaurants="restaurants" :show-action-buttons="false"></RestaurantList>
    <div class="more-restaurants  mt-2">
      <div class="container">
        <div class="row justify-content-end mb-3">
          <a v-on:click="navigateToAllRestaurants()" class="template-btn3 mt-2">See all <span><box-icon type='solid'
                                                                                                        name='right-arrow-alt'></box-icon></span></a>
        </div>
      </div>
    </div>
    <hr>
    <div class="section-top2">
      <span class="style-change mt-2 mb-2">daily menus</span>
      <div class="container mt-3">
        <vueper-slides class="no-shadow"
                       :visible-slides="3"
                       slide-multiple
                       :gap="3"
                       :slide-ratio="1 / 4"
                       :dragging-distance="200"
                       :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }">
          <vueper-slide v-for="(i, index) in menus" :key="index" :image="'data:image/jpeg;base64,' +i.image.data" @mouseenter="navigateToRestaurant($event)" />
        </vueper-slides>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>

import Header from "@/components/view/Header";
import Footer from "@/components/view/Footer";
import RestaurantList from "@/components/view/RestaurantList";
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";


export default {
  name: "LandingPage",
  components: {RestaurantList, Header, Footer, VueperSlides, VueperSlide},
  data: () => ({
    restaurants: [],
    page: 1,
    pageLimit: 6,
    menus: []
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
    navigateToAllRestaurants: function() {
      this.$router.push('/all-restaurants');
    },
    navigateToRestaurant: function(menu) {
      console.log(menu);
    },
    loadMenus: async function(restaurants) {
      await this.axios.put(`menu/of-the-week`, restaurants).then((resp) => {
        this.menus = resp.data;
      })
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


/*h4 {*/
/*  color: #fff;*/
/*  font-family: "Roboto", sans-serif;*/
/*  font-size: 24px !important;*/
/*  font-weight: 400;*/
/*  font-style: italic;*/
/*  text-transform: capitalize*/
/*}*/

/*h5 {*/
/*  color: #131230;*/
/*  font-size: 16px !important;*/
/*  font-family: "Playfair Display", serif;*/
/*  font-weight: 300;*/
/*}*/

/*.section-padding span {*/
/*  color: #ffb606 !important;*/
/*  font-size: 16px !important;*/
/*  font-family: "Playfair Display", serif;*/
/*  font-weight: 300;*/
/*}*/

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
  font-family: "Roboto", sans-serif;
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
  font-family: "Playfair Display", serif;
  font-size: 36px !important;
  font-weight: 700
}

.more-restaurants a {
  display: block;
}

</style>