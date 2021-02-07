<template>
  <div>
    <b-tabs content-class="mt-3" justified class="restaurant-details">
      <b-tab title="Details" active>
        <b-card>
          <b-card-group deck>
            <b-card
                :title="restaurant.name"
                img-alt="Restaurant's logo"
                :img-src="'data:image/jpeg;base64,'+restaurant.logo"
                img-top
                tag="article"
                style="max-width: 20rem;"
                class="mt-2 ml-2 logo"
                v-if="restaurant.logo">
              <b-card-text>
                {{ restaurant.description }}
              </b-card-text>
              <template v-slot:footer>
                <vs-row vs-justify="flex-start">
                  <vs-button danger icon>
                    <box-icon name="heart"></box-icon>
                  </vs-button>
                  <template v-if="isUsersFavorite(restaurant.id)">
                    <vs-button color="rgb(245, 209, 66)" icon
                               v-on:click="removeFavoriteRestaurant(restaurant.id)">
                      <box-icon type="solid" name="star"></box-icon>
                    </vs-button>

                  </template>
                  <template v-else>
                    <vs-button color="rgb(245, 209, 66)" icon
                               v-on:click="addFavoriteRestaurant(restaurant.id)">
                      <box-icon name="star" type="regular"></box-icon>
                    </vs-button>
                  </template>
                  <vs-button class="btn-chat" shadow>
                    <box-icon name="chat"></box-icon>

                    <span class="span">
                                        54
                                        </span>
                  </vs-button>
                  <vs-button shadow :to="'/edit-restaurant/'+restaurant.id">
                    <box-icon name="edit"></box-icon>
                  </vs-button>
                </vs-row>
              </template>
            </b-card>
            <b-card class="mt-2">
              <b-card-body>
                <div v-for="(comment, i) in restaurantComments" :key="i">
                  <b-form-textarea
                      id="textarea"
                      v-model="comment.message"
                      placeholder="Enter something..."
                      rows="4"
                      max-rows="5"
                      disabled>
                  </b-form-textarea>
                  <div class="d-flex flex-row-reverse bd-highlight">
                    <div class="align-self-center">
                      <span class=""><strong>Created at: </strong> {{ comment.createdAt }}</span>
                    </div>
                    <div>
                      <vs-button size="mini" shadow>
                        <box-icon name="edit"></box-icon>
                      </vs-button>
                    </div>
                  </div>
                </div>
                <div class="d-flex">
                  <div class="ml-auto bd-highlight mt-1">
                    <sliding-pagination
                        :current="currentPage"
                        :total="totalPages"
                        @page-change="pageChangeHandler"
                    ></sliding-pagination>
                  </div>
                  <div class="ml-auto">
                    <vs-tooltip>
                      <vs-button
                          circle
                          icon
                          floating
                          success>
                        <box-icon name="plus"></box-icon>
                      </vs-button>
                      <template #tooltip>
                        New comment
                      </template>
                    </vs-tooltip>
                  </div>

                </div>
              </b-card-body>

            </b-card>
          </b-card-group>
        </b-card>
      </b-tab>
      <b-tab title="Menus" v-on:click="loadRestaurantMenus()" lazy>
        <div class="d-flex flex-wrap justify-content-center">
          <vs-card type="5" class="mt-3 ml-2" v-for="(menu, i) in restaurantMenus" :key="i">
            <template #img>
              <img :src="'data:image/jpeg;base64,'+menu.image.data" alt="Menu image">
            </template>
            <template #text>
              <p>
                {{ menu.description }}
              </p>
            </template>
            <template #interactions>
              <vs-button danger icon>
                <box-icon name="heart"></box-icon>
                <span class="span">
                                  54
                                </span>
              </vs-button>
            </template>
          </vs-card>
        </div>
      </b-tab>
      <b-tab title="Rating" lazy><p>I'm the tab with the very, very long title</p></b-tab>
    </b-tabs>
  </div>
</template>

<script>
import SlidingPagination from "vue-sliding-pagination";

export default {
  name: 'RestaurantDetails',
  components: {
    SlidingPagination
  },
  data: () => ({
    restaurant: {},
    usersFavoriteRestaurants: [],
    restaurantMenus: [],
    restaurantComments: [
      {message: 'best restaurant in town', restaurant: 'id12314', userId: '1231321', createdAt: '2020-02-02'},
      {message: 'best restaurant in town', restaurant: 'id12314', userId: '1231321', createdAt: '2020-02-02'},
      {message: 'best restaurant in town', restaurant: 'id12314', userId: '1231321', createdAt: '2020-02-02'},
      {message: 'best restaurant in town', restaurant: 'id12314', userId: '1231321', createdAt: '2020-02-02'}
    ],
    currentPage: 1,
    totalPages: 3,
    pageLimit: 6,
  }),
  methods: {
    getRestaurantDetails: async function (restaurantId) {
      await this.axios.get(`/restaurant/by-id/${restaurantId}`).then(res => {
        this.restaurant = res.data;
      }).catch(() => {
        this.restaurant = {};
        this.restaurantMenus = [];
      });
    },
    getUsersFavoriteRestaurant: async function () {
      this.usersFavoriteRestaurants = this.$store.getters.getUsersFavoriteRestaurants;
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
          })
          .catch(() => {
          });
    },
    isUsersFavorite: function (restaurantId) {
      return this.usersFavoriteRestaurants.find(favorite => favorite.restaurant === restaurantId);
    },
    loadRestaurantMenus: async function () {
      await this.axios.get(`/restaurant/${this.restaurant.id}/with-menu`)
          .then((response) => {
            this.restaurantMenus = response.data.menus;
          })
          .catch(() => {

          });
    },
    pageChangeHandler: async function (selectedPage) {
      console.log(selectedPage);
    }
  },
  async created() {
    const id = this.$route.params.id;
    await this.getRestaurantDetails(id);
    await this.getUsersFavoriteRestaurant();
  },
  watch: {
    async $route(to) {
      const id = to.params.id;
      await this.getRestaurantDetails(id);
    }
  }
}
</script>

<style>
.restaurant-details {
  margin-top: 20px;
}

@media {
  .restaurant-details {
    min-height: 680px;
  }

  .restaurant-details .logo {
    max-height: 550px;
  }
}
</style>
