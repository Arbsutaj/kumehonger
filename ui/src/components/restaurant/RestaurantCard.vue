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
      <vs-tooltip>
        <vs-button danger icon>
          <box-icon name="heart"></box-icon>
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
    }
  },
  methods: {
    restaurantDetails: async function (event, restaurantId) {
      await new Promise(function (resolve) {
        setTimeout(resolve, 100);
      });
      this.$router.push({path: `/restaurant-details/${restaurantId}`});
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
