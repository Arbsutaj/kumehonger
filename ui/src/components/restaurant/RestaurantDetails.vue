<template>
  <div>
    <b-tabs content-class="mt-3" justified class="restaurant-details">
      <b-tab title="Details" :active="detailsPage">
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
                <br>
                {{restaurant.city + ', ' + restaurant.street}}
              </b-card-text>
              <template v-slot:footer>
                <vs-row vs-justify="flex-start">
                  <vs-button danger icon v-if="isLikedByUser(restaurant.id)" v-on:click="removeLikeFromRestaurant(restaurant.id)">
                    <box-icon name="heart" type="solid"></box-icon>
                    <span class="span">{{ restaurant.likes }}</span>
                  </vs-button>
                  <vs-button danger icon v-else v-on:click="likeRestaurant(restaurant.id)">
                    <box-icon name="heart" type="regular"></box-icon>
                    <span class="span">{{ restaurant.likes }}</span>
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
                    <span class="span">{{ restaurant.numberOfComments }}</span>
                  </vs-button>
                  <vs-button shadow :to="'/edit-restaurant/'+restaurant.id" v-if="isAuthenticated">
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
                      v-model="comment.description"
                      placeholder="Enter something..."
                      rows="4"
                      max-rows="5"
                      disabled>
                  </b-form-textarea>
                  <div class="d-flex flex-row-reverse bd-highlight">
                    <div class="align-self-center">
                      <span class=""><strong>Created at: </strong> {{ comment.createdAt | formatDate }}</span>
                    </div>
                    <div>
                      <vs-button size="mini" danger v-on:click="removeComment(comment._id, i)">
                        <box-icon name="trash"></box-icon>
                      </vs-button>

                    </div>
                    <div>
                      <vs-button size="mini" success v-on:click="openDialogComment(true, i, comment.user)">
                        <box-icon name="edit"></box-icon>
                      </vs-button>
                    </div>
                  </div>
                </div>
              </b-card-body>
              <template #footer>
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
                          success
                          v-on:click="openDialogComment(false, null, null)">
                        <box-icon name="plus"></box-icon>
                      </vs-button>
                      <template #tooltip>
                        New comment
                      </template>
                    </vs-tooltip>
                  </div>

                </div>
              </template>
            </b-card>
          </b-card-group>
        </b-card>
      </b-tab>
      <b-tab title="Menus" :active="menuPage" v-on:click="loadRestaurantMenus()" lazy>
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
    <vs-dialog width="550px" not-center v-model="openDialog">
      <template #header>
        <h6 class="not-margin">
          Comment
        </h6>
      </template>
      <div class="con-content">
        <b-form-textarea
            id="textarea"
            placeholder="Write down your comment!"
            rows="3"
            max-rows="6"
            v-model="restaurantComment.description"
        ></b-form-textarea>
        <span v-if="!restaurantComment.description" class="validation-message">
                    Description is required!
        </span>
      </div>

      <template #footer>
        <div class="con-footer">
          <vs-button v-on:click="openDialog=false" dark>
            Cancel
          </vs-button>
          <vs-button v-on:click="addComment()">
            Add
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
import SlidingPagination from "vue-sliding-pagination";
import {RestaurantComment} from "@/components/restaurant/restaurant-comment";

export default {
  name: 'RestaurantDetails',
  components: {
    SlidingPagination
  },
  data: () => ({
    restaurant: {},
    usersFavoriteRestaurants: [],
    restaurantMenus: [],
    restaurantComments: [],
    currentPage: 1,
    totalPages: 3,
    pageLimit: 4,
    openDialog: false,
    restaurantComment: new RestaurantComment(),
    usersLikedRestaurants: [],
    detailsPage: true,
    menuPage: false
  }),
  methods: {
    getRestaurantDetails: async function (restaurantId) {
      this.mapStateOfPages(true, false);
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
    getUsersLikedRestaurants: async function () {
      this.usersLikedRestaurants = this.$store.getters.getUsersLikedRestaurants;
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
    mapStateOfPages: function(detailsPage, menuPage) {
      this.detailsPage =detailsPage;
      this.menuPage = menuPage;
    },
    loadRestaurantMenus: async function () {
      this.mapStateOfPages(false, true);
      await this.axios.get(`/restaurant/${this.restaurant.id}/with-menu`)
          .then((response) => {
            this.restaurantMenus = response.data.menus;
          })
          .catch(() => {
          });
    },
    loadRestaurantComments: async function (restaurantId, page) {
      const params = new URLSearchParams([['page', page], ['limit', this.pageLimit]]);

      await this.axios.get(`/restaurant-comment/by-restaurant-paginated/${this.restaurant.id}`, {params})
          .then((response) => {
            this.restaurantComments = response.data.restaurantComments;
            this.totalPages = response.data.pages;
            this.currentPage = response.data.page;
          })
          .catch(() => {
          });
    },
    pageChangeHandler: async function (selectedPage) {
      await this.loadRestaurantComments(this.restaurant.id, selectedPage);
    },
    openDialogComment: async function (edit, index, userId) {
      if (edit) {
        if (this.$store.getters.getUserLoggedIn.id === userId) {
          this.restaurantComment = this.restaurantComments[index];
          this.restaurantComment.index = index;
          this.openDialog = true;
          return;
        }
      }

      this.restaurantComment = await this.mapRestaurantDataToComment();
      this.openDialog = true;
    },
    mapRestaurantDataToComment: async function () {
      let restaurantComment = new RestaurantComment();
      restaurantComment.restaurant = this.restaurant.id;
      return restaurantComment;
    },
    addComment: async function () {
      if (this.restaurantComment._id) {
        await this.axios.put(`/restaurant-comment/${this.restaurantComment._id}`, this.restaurantComment)
            .then((res) => {
              this.restaurantComments[this.restaurantComment.index] = this.res.data;
              this.restaurantComment = res.data;
            }).catch(() => {
            });
        this.openDialog = false;
        return;
      }

      await this.axios.post(`/restaurant-comment/add`, this.restaurantComment)
          .then((res) => {
            this.restaurantComments.unshift(res.data);
            this.restaurantComments.splice(this.currentPage * 4, 1);
            this.restaurant.numberOfComments += 1;

          }).catch((res) => {
            console.log('err', res);
          });
      this.openDialog = false;

    },
    removeComment: async function (id, index) {
      await this.axios.delete(`/restaurant-comment/${id}`)
          .then(() => {
            this.restaurantComments.splice(index, 1);
            this.restaurant.numberOfComments -= 1;
          }).catch();
    },
    likeRestaurant: async function (restaurantId) {
      const userLikeRestaurant = {restaurant: restaurantId};

      await this.axios.post('/restaurant/like', userLikeRestaurant)
          .then((res) => {
            this.restaurant.likes +=1;
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
            this.restaurant.likes -=1;
            const index = this.usersLikedRestaurants.findIndex(like => like.restaurant === restaurantId);
            this.usersLikedRestaurants.splice(index, 1);
            this.$store.commit('setUsersLikedRestaurants', this.usersLikedRestaurants);
          }).catch(() => {
          });
    },
    isLikedByUser: function (restaurantId) {
      return this.usersLikedRestaurants.find(like => like.restaurant === restaurantId);
    },
    isAuthenticated: function () {
      return this.$store.getters.isAuthenticated;
    }
  },
  async created() {
    const id = this.$route.params.id;
    await this.getRestaurantDetails(id);
    await this.getUsersFavoriteRestaurant();
    await this.getUsersLikedRestaurants();
    await this.loadRestaurantComments(id, this.currentPage)
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

.con-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.con-footer vs-button {
  margin: 0px;
}

.con-footer vs-button__content {
  padding: 10px 30px;
}
</style>