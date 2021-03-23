<template>
  <div>
    <Header></Header>
    <RestaurantList :restaurants="restaurants" :show-action-buttons="true"></RestaurantList>
    <div class="section-padding more-restaurants container mt-3" v-if="showSeeMoreLink">
      <a v-on:click="loadMoreRestaurants()" class="template-btn3 mt-2">See more <span><box-icon type='solid' name='right-arrow-alt'></box-icon></span></a>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import RestaurantList from "@/components/restaurant/RestaurantList";

export default {
  name: "Restaurants",
  components: {RestaurantList, Header, Footer},
  data: () => ({
    restaurants: [],
    page: 1,
    pageLimit: 6,
    showSeeMoreLink: true
  }),
  methods: {
    loadRestaurants: async function () {
      await this.getRestaurants(this.page);
    },
    loadMoreRestaurants: async function () {
      this.page++;
      await this.getRestaurants(this.page);
    },
    getRestaurants: async function (page) {
      const params = new URLSearchParams([['page', page], ['limit', this.pageLimit], ['sort', 'createdAt,asc']]);

      await this.axios.get(`/restaurant/paginated`, {params}).then(res => {
        if (this.page === res.data.pages)
          this.showSeeMoreLink = false;
        this.restaurants.push(...res.data.restaurants);
      });
    }
  },
  async created() {
    await this.loadRestaurants();
  }
}
</script>

<style>

.more-restaurants a {
  float: right;
}

.section-padding {
  padding: 40px 0;
}

a:hover, a:focus {
  text-decoration: none;
  cursor: pointer;
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
</style>