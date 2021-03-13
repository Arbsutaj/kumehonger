<template>
  <section class="food-area section-padding">
    <div class="container">
      <div class="row">
        <div class="col-md-5">
          <div class="section-top">
            <h3><span class="style-change">we serve</span> <br>delicious food</h3>
            <p class="pt-3">They're fill divide i their yielding our after have him fish on there for greater man
              moveth, moved Won't together isn't for fly divide mids fish firmament on net.</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="food-card col-md-4 mt-5 col-sm-6" v-for="(restaurant, i) in restaurants" :key="i"
             v-on:click="navigateToRestaurantDetails(restaurant.id)">
          <div class="single-food  mt-sm-0">
            <div class="food-img">
              <img v-bind:src="'data:image/jpeg;base64,'+restaurant.logo" class="img-fluid" alt="">
            </div>
            <div class="food-content">
              <div class="d-flex justify-content-between">
                <h5>{{ restaurant.name }}</h5>
                <div class="icons d-flex flex-row">
                  <vs-button icon color="rgb(245, 209, 66)" v-if="isUsersFavorite(restaurant.id)">
                    <box-icon type='solid' name='star' v-on:click="removeFavoriteRestaurant(restaurant.id)"></box-icon>
                  </vs-button>
                  <vs-button icon color="rgb(245, 209, 66)" v-else>
                    <box-icon type='regular' name='star' v-on:click="addFavoriteRestaurant(restaurant.id)"></box-icon>
                  </vs-button>
                  <vs-button icon danger v-if="isLikedByUser(restaurant.id)">
                    <box-icon type='solid' name='heart' v-on:click="removeLikeFromRestaurant(restaurant.id)"></box-icon>
                  </vs-button>
                  <vs-button icon danger v-else>
                    <box-icon type='regular' name='heart' v-on:click="likeRestaurant(restaurant.id)"></box-icon>
                  </vs-button>
                </div>
              </div>
              <p class="restaurant-description">{{ restaurant.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "RestaurantList",
  props: {
    restaurants: {
      type: Array,
      default: () => []
    },
  },
  data:() => ({
    usersFavoriteRestaurants: [],
    usersLikedRestaurants: []
  }),
  methods: {
    navigateToRestaurantDetails: function (id) {
      console.log(id);
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
    isUsersFavorite: function (restaurantId) {
      return this.usersFavoriteRestaurants.find(favorite => favorite.restaurant === restaurantId);
    },
    isLikedByUser: function (restaurantId) {
      return this.usersLikedRestaurants.find(like => like.restaurant === restaurantId);
    },
    addFavoriteRestaurant: async function (restaurantId) {
      const favoriteRestaurant = {restaurant: restaurantId};

      await this.axios.post('/favorite-restaurant/', favoriteRestaurant)
          .then((res) => {
            const favoriteRestaurant = res.data;
            this.usersFavoriteRestaurants.push(favoriteRestaurant);
            this.$store.commit('setUsersFavoriteRestaurants', this.usersFavoriteRestaurants);
          }).catch(() => {
          });
    },
    removeFavoriteRestaurant: async function (restaurantId) {
      const favoriteRestaurantId = this.usersFavoriteRestaurants.find(favorite => favorite.restaurant === restaurantId)._id;

      await this.axios.delete(`/favorite-restaurant/${favoriteRestaurantId}`)
          .then(() => {
            const index = this.usersFavoriteRestaurants.findIndex(favorite => favorite.restaurant === restaurantId);
            this.usersFavoriteRestaurants.splice(index, 1);
            this.$store.commit('setUsersFavoriteRestaurants', this.usersFavoriteRestaurants);
            this.$emit('removeFromFavorites');
          })
          .catch(() => {
          });

    },
    likeRestaurant: async function (restaurantId) {
      const userLikeRestaurant = {restaurant: restaurantId};

      await this.axios.post('/restaurant/like', userLikeRestaurant)
          .then((res) => {
            const userLikeRestaurant = res.data;
            this.usersLikedRestaurants.push(userLikeRestaurant);
            this.$store.commit('setUsersLikedRestaurants', this.usersLikedRestaurants);
          }).catch(() => {
          });
    },
    removeLikeFromRestaurant: async function (restaurantId) {
      const userLikeRestaurantId = this.usersLikedRestaurants.find(like => like.restaurant === restaurantId)._id;

      await this.axios.delete(`restaurant/remove-like/${userLikeRestaurantId}`)
          .then(() => {
            const index = this.usersLikedRestaurants.findIndex(like => like.restaurant === restaurantId);
            this.usersLikedRestaurants.splice(index, 1);
            this.$store.commit('setUsersLikedRestaurants', this.usersLikedRestaurants);
          }).catch(() => {
          });
    }
  },
  async created() {
    if (this.$store.getters.isAuthenticated) {
      await this.getUsersFavoriteRestaurant();
      await this.getUserRestaurantsLiked();
    }
  }
}
</script>

<style scoped>
.more-restaurants a {
  float: right;
}

.food-area .food-content {
  max-height: 150px;
  overflow: hidden;
}

.food-area .food-content .restaurant-description {
  text-overflow: ellipsis;
}

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

.food-area {
  background-image: url("../../assets/images/food-bg.png");
  background-repeat: no-repeat;
  background-position: top right;
  position: relative
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .food-area {
    background-image: none
  }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .food-area {
    background-image: none
  }
}

@media (max-width: 575.98px) {
  .food-area {
    background-image: none
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

.food-card {
  max-height: 516px;
}

.food-card:hover {
  cursor: pointer;
}

.section-padding {
  padding: 40px 0;
}

.section-top {
  margin-bottom: 80px
}

.section-top .style-change {
  color: #ffb606;
  font-style: italic
}

</style>