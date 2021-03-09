<template>
  <vs-card class="card-details">
    <template #title>
      <h3>{{ restaurant.name }}</h3>
    </template>
    <template #img>
      <img class="vs-card-image" v-bind:src="'data:image/jpeg;base64,'+restaurant.logo"/>
    </template>
    <template #text>
      <p>
        {{ restaurant.description }}
      </p>
    </template>
    <template #interactions>
      <vs-tooltip top v-if="isLikedByUser(restaurant.id)">
        <vs-button danger icon
                   v-on:click="removeLikeFromRestaurant(restaurant.id)">
          <box-icon type="solid" name="heart"></box-icon>

        </vs-button>
        <template #tooltip>
          Unlike
        </template>
      </vs-tooltip>
      <vs-tooltip v-else>
        <vs-button danger icon
                   v-on:click="likeRestaurant(restaurant.id)">
          <box-icon name="heart" type="regular"></box-icon>
        </vs-button>
        <template #tooltip>
          Like Restaurant
        </template>
      </vs-tooltip>
      <vs-tooltip top v-if="isUsersFavorite(restaurant.id)">
        <vs-button color="rgb(245, 209, 66)" icon
                   v-on:click="removeFavoriteRestaurant(restaurant.id)">
          <box-icon type="solid" name="star"></box-icon>
        </vs-button>
        <template #tooltip>
          Remove Restaurant from favorites
        </template>
      </vs-tooltip>
      <vs-tooltip v-else>
        <vs-button color="rgb(245, 209, 66)" icon
                   v-on:click="addFavoriteRestaurant(restaurant.id)">
          <box-icon name="star" type="regular"></box-icon>
        </vs-button>
        <template #tooltip>
          Favorite Restaurant
        </template>
      </vs-tooltip>
      <vs-tooltip>
        <vs-button shadow icon v-on:click="restaurantDetails($event, restaurant.id)">
          <box-icon name="detail"></box-icon>
        </vs-button>
        <template #tooltip>
          View Restaurant details
        </template>
      </vs-tooltip>
    </template>
  </vs-card>
</template>

<script>

export default {
  name: 'RestaurantCard',
  data: () => ({}),
  props: {
    restaurant: {},
    usersFavoriteRestaurants: {
      type: Array,
      default: () => []
    },
    usersLikedRestaurants: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    restaurantDetails: async function (event, restaurantId) {
      await new Promise(function (resolve) {
        setTimeout(resolve, 100);
      });
      await this.$router.push({path: `/restaurant-details/${restaurantId}`});
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
    isUsersFavorite: function (restaurantId) {
      return this.usersFavoriteRestaurants.find(favorite => favorite.restaurant === restaurantId);
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
    },
    isLikedByUser: function (restaurantId) {
      return this.usersLikedRestaurants.find(like => like.restaurant === restaurantId);
    }
  },
  created() {
  }
}
</script>

<style>
@media {
  .card-details {
    min-width: 350px;
    min-height: 340px;
    max-width: 350px;
    max-height: 340px;
  }

  .vs-card-image {
    min-height: 350px;
  }

}
</style>
