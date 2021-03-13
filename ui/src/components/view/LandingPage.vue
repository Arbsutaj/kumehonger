<template>
  <div>
    <Header></Header>
    <RestaurantList :restaurants="restaurants"></RestaurantList>
    <div class="more-restaurants container mt-3">
      <a v-on:click="navigateToAllRestaurants()" class="template-btn3 mt-2">See all <span><box-icon type='solid'
                                                                                    name='right-arrow-alt'></box-icon></span></a>
    </div>
    <section class="update-area section-padding">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="section-top2 text-center">
              <h3>Our daily <span>menus</span> for the week</h3>
              <p><i>Kori</i></p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="single-food">
              <div class="food-img">
                <img src="../../assets/images/update1.jpg" class="img-fluid" alt="">
              </div>
              <div class="food-content">
                <div class="post-admin d-lg-flex mb-3">
                  <span class="mr-5 d-block mb-2 mb-lg-0"><i class="fa fa-user-o mr-2"></i>Admin</span>
                  <span><i class="fa fa-calendar-o mr-2"></i>18/09/2018</span>
                </div>
                <h5>no finer food can be found</h5>
                <p>nancy boy off his nut so I said chimney pot be James Bond aking cakes he.</p>
                <a href="#" class="template-btn3 mt-2">read more <span><box-icon type='solid'
                                                                                 name='right-arrow-alt'></box-icon></span></a>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="single-food my-5 my-md-0">
              <div class="food-img">
                <img src="../../assets/images/update2.jpg" class="img-fluid" alt="">
              </div>
              <div class="food-content">
                <div class="post-admin d-lg-flex mb-3">
                  <span class="mr-5 d-block mb-2 mb-lg-0"><i class="fa fa-user-o mr-2"></i>Admin</span>
                  <span><i class="fa fa-calendar-o mr-2"></i>20/09/2018</span>
                </div>
                <h5>things go better with food</h5>
                <p>nancy boy off his nut so I said chimney pot be James Bond aking cakes he.</p>
                <a href="#" class="template-btn3 mt-2">read more <span><box-icon type='solid'
                                                                                 name='right-arrow-alt'></box-icon></span></a>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="single-food">
              <div class="food-img">
                <img src="../../assets/images/update3.jpg" class="img-fluid" alt="">
              </div>
              <div class="food-content">
                <div class="post-admin d-lg-flex mb-3">
                  <span class="mr-5 d-block mb-2 mb-lg-0"><i class="fa fa-user-o mr-2"></i>Admin</span>
                  <span><i class="fa fa-calendar-o mr-2"></i>22/09/2018</span>
                </div>
                <h5>food head above the rest</h5>
                <p>nancy boy off his nut so I said chimney pot be James Bond aking cakes he.</p>
                <a href="#" class="template-btn3 mt-2">read more <span><box-icon type='solid'
                                                                                 name='right-arrow-alt'></box-icon></span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
    pageLimit: 6
  }),
  methods: {
    loadRestaurants: async function () {
      const params = new URLSearchParams([['page', this.page], ['limit', this.pageLimit]]);

      await this.axios.get(`/restaurant/paginated`, {params}).then(res => {
        this.restaurants = res.data.restaurants;
      });
    },
    navigateToAllRestaurants: function() {
      this.$router.push('/all-restaurants');
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


.food-img img {
  min-height: 350px;
  object-fit: fill;

}

.food-area .food-img {
  overflow: hidden;
  object-fit: fill;

}

.food-area .food-img img {
  -webkit-transition: .5s;
  -moz-transition: .5s;
  -o-transition: .5s;
  transition: .5s;
}

.food-area .food-content {
  padding: 30px;
  background: #f9f9ff;
  -webkit-transition: .5s;
  -moz-transition: .5s;
  -o-transition: .5s;
  transition: .5s;
}

.food-area .food-content pt-3 {
  overflow: hidden;
  text-overflow: ellipsis;
}

.food-area .food-content .style-change {
  color: #ffb606;
  font-family: "Roboto", sans-serif;
  font-size: 20px;
  font-weight: 700;
  -webkit-transition: .5s;
  -moz-transition: .5s;
  -o-transition: .5s;
  transition: .5s
}

.food-area .food-content p {
  -webkit-transition: .5s;
  -moz-transition: .5s;
  -o-transition: .5s;
  transition: .5s;
}

.food-area .single-food:hover img {
  -webkit-transform: scale(1.1, 1.1);
  -moz-transform: scale(1.1, 1.1);
  -ms-transform: scale(1.1, 1.1);
  -o-transform: scale(1.1, 1.1);
  transform: scale(1.1, 1.1)
}

.food-area .single-food:hover .food-content {
  background: #ffb606
}

.food-area .single-food:hover .food-content .style-change {
  color: #131230
}

.food-area .single-food:hover .food-content p {
  color: #131230
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .update-area .single-food {
    width: 70%;
    margin: auto
  }
}

.update-area .single-food .food-content {
  padding: 40px 30px;
  background: #f9f9ff;
  -webkit-transition: .5s;
  -moz-transition: .5s;
  -o-transition: .5s;
  transition: .5s
}

.update-area .single-food:hover .food-content {
  background: #fff;
  -webkit-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1)
}


b, sup, sub, u, del {
  color: #f8b600
}

h1 {
  font-size: 36px
}

h2 {
  font-size: 30px
}

h3 {
  font-size: 24px
}

h4 {
  font-size: 18px
}

h5 {
  font-size: 16px
}

h6 {
  font-size: 14px
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

.section-padding {
  padding: 40px 0
}


.section-top2 {
  margin-bottom: 80px
}

.section-top2 span {
  color: #ffb606
}

.more-restaurants a {
  float: right;
}

</style>