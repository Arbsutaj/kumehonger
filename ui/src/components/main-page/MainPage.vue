<template>
  <div>
    <b-tabs content-class="mt-3" justified class="restaurant-details">
      <b-tab active v-on:click="loadRestaurants()">
        <template #title>
          <div class="d-flex justify-content-center">
            <box-icon name="list-ul"></box-icon>
            <p>Suggested</p>
          </div>
        </template>
        <div class="d-flex flex-wrap justify-content-center restaurants mt-2">
          <div v-for="(restaurant, i) in restaurants" :key="i">
            <RestaurantCard :restaurant="restaurant" :users-favorite-restaurants="usersFavoriteRestaurants"
                            :users-liked-restaurants="usersLikedRestaurants"
                            class="ml-2"></RestaurantCard>
          </div>
        </div>
      </b-tab>
      <b-tab v-on:click="loadFavoriteRestaurants()">
        <template #title>
          <div class="d-flex justify-content-center">
            <box-icon name="star" type="solid"></box-icon>
            <p>Favorite</p>
          </div>
        </template>
        <div class="d-flex flex-wrap justify-content-center restaurants mt-2">
          <div v-for="(restaurant, i) in restaurants" :key="i">
            <RestaurantCard :restaurant="restaurant" :users-favorite-restaurants="usersFavoriteRestaurants"
                            :users-liked-restaurants="usersLikedRestaurants"
                            class="ml-2"
                            @removeFromFavorites="removeFromFavorites(restaurant.id)"></RestaurantCard>
          </div>
        </div>
      </b-tab>
      <b-tab title="My" v-on:click="loadMyRestaurants()">
        <template #title>
          <div class="d-flex justify-content-center">
            <box-icon name="store" type="solid"></box-icon>
            <p>My restaurants</p>
          </div>
        </template>
        <div class="d-flex flex-wrap justify-content-center restaurants mt-2"
             v-on:click="navigateToNewRestaurantPage()">
          <div class="add-new" v-if="currentPage === 1">
            <img src="@/assets/add-new.png"/>
          </div>
          <div v-for="(restaurant, i) in restaurants" :key="i">
            <RestaurantCard :restaurant="restaurant" :users-favorite-restaurants="usersFavoriteRestaurants"
                            :users-liked-restaurants="usersLikedRestaurants"
                            class="ml-2"></RestaurantCard>
          </div>
        </div>
      </b-tab>
      <div class="d-flex flex-row-reverse bd-highlight mt-2">
        <sliding-pagination
            :current="currentPage"
            :total="totalPages"
            @page-change="pageChangeHandler"
        ></sliding-pagination>
      </div>
    </b-tabs>
  </div>
</template>

<script>
import SlidingPagination from 'vue-sliding-pagination';
import RestaurantCard from "../restaurant/RestaurantCard";

export default {
  name: 'MainPage',
  components: {
    RestaurantCard,
    SlidingPagination
  },
  data: () => ({
    restaurants: [],
    currentPage: 1,
    totalPages: 3,
    pageLimit: 6,
    usersFavoriteRestaurants: [],
    currentTab: 'Main-Page',
    usersLikedRestaurants: [],
  }),
  methods: {
    getRestaurants: async function (page) {
      await this.setPageLimit(page);
      const params = new URLSearchParams([['page', page], ['limit', this.pageLimit]]);
      const apiEndpoint = await this.getUrlRequest(this.currentTab);

      await this.axios.get(apiEndpoint, {params}).then(res => {
        this.restaurants = res.data.restaurants;
        this.totalPages = res.data.pages;
        this.currentPage = res.data.page;
      });
    },
    getUsersFavoriteRestaurant: async function () {
      this.$store.dispatch('getUsersFavoriteRestaurants').then(() => {
        this.usersFavoriteRestaurants = this.$store.getters.getUsersFavoriteRestaurants;
      });
    },
    getUserRestaurantsLiked: async function () {
      await this.$store.dispatch('getUsersLikedRestaurants').then(() => {
        this.usersLikedRestaurants = this.$store.getters.getUsersLikedRestaurants;
      });
    },
    loadFavoriteRestaurants: async function () {
      this.currentTab = 'Favorite';
      this.restaurants = [];
      await this.getRestaurants(1);
    },
    loadRestaurants: async function () {
      this.currentTab = 'Main-Page';
      this.restaurants = [];
      await this.getRestaurants(1);
    },
    loadMyRestaurants: async function () {
      this.currentTab = 'My-Restaurants';
      this.pageLimit = 5;
      this.restaurants = [];
      await this.getRestaurants(1);
    },
    getUrlRequest: async function () {
      let urlRequest = '';
      if (this.currentTab === 'Favorite')
        urlRequest = '/favorite-restaurant/with-restaurant/logged-in';

      if (this.currentTab === 'Main-Page')
        urlRequest = '/restaurant/paginated';

      if (this.currentTab === 'My-Restaurants')
        urlRequest = '/restaurant/paginated';

      return urlRequest;
    },
    removeFromFavorites: async function (id) {
      if (this.currentTab === 'Favorite') {
        const index = this.restaurants.findIndex(restaurant => restaurant.id === id);

        this.restaurants.splice(index, 1);
      }
    },
    pageChangeHandler: async function (selectedPage) {
      await this.getRestaurants(selectedPage);
    },
    setPageLimit: async function (page) {
      if (this.currentTab === 'My-Restaurants' && page === 1) {
        this.pageLimit = 5;
        return;
      }

      this.pageLimit = 6;
    },
    navigateToNewRestaurantPage: function () {
      this.$router.push('/add-restaurant');
    }
  },
  async created() {
    await this.loadRestaurants();
    if (this.$store.getters.isAuthenticated) {
      await this.getUsersFavoriteRestaurant();
      await this.getUserRestaurantsLiked();
    }
  }
}
</script>

<style>
@import "~vue-sliding-pagination/dist/style/vue-sliding-pagination.css";

@media {
  .restaurants {
    min-height: 680px;
  }

  .add-new {
    width: 330px;
    height: 330px;
    display: flex;
    cursor: pointer;
  }
}

.add-new img {
  width: 200px;
  margin: auto;
}

</style>
