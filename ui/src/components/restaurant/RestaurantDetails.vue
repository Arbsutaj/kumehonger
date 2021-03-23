<template>
  <div>
    <Header></Header>
    <div class="restaurant-details">
      <div class="container section-padding">
        <md-tabs md-alignment="centered" class="mt-3">
          <md-tab id="tab-home" md-label="Details" md-icon="info">
            <hr>
            <div class="row justify-content-center">
              <h4>{{ restaurant.name }}</h4>
            </div>
            <div class="row restaurant-img justify-content-center mt-2">
              <img :src="'data:image/jpeg;base64,'+restaurant.logo">
            </div>

            <div class="row justify-content-center mt-2">
              <p>{{ restaurant.description }}</p>
            </div>
            <div class="row justify-content-center mt-2">
              <p>{{ restaurant.city + ', ' + restaurant.street }}</p>
            </div>
            <vs-row class="mt-2" justify="center">
              <vs-button danger icon v-if="isLikedByUser(restaurant.id)"
                         v-on:click="removeLikeFromRestaurant(restaurant.id)">
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
              <vs-button shadow :to="'/edit-restaurant/'+restaurant.id" v-if="isOwnerOfRestaurant">
                <box-icon name="edit"></box-icon>
              </vs-button>
            </vs-row>
          </md-tab>
          <md-tab id="tab-pages" md-label="Comments" md-icon="comment">
            <hr>
            <div>
              <div class="container mt-5 mb-5">
                <div class="d-flex justify-content-center row">
                  <div class="col-md-8">
                    <div class="d-flex flex-row align-items-center add-comment p-2 bg-white rounded"
                         v-if="hasUserProfile()">
                      <img
                          class="rounded-circle" v-bind:src="'data:image/jpeg;base64,' + profilePhotoOfLoggedInUser()"
                          width="40"><input v-model="restaurantComment.description" v-on:keyup.enter="addComment()"
                                            type="text"
                                            class="form-control border-0 no-box-shadow ml-1"
                                            placeholder="Leave a constructive comment...">
                    </div>
                    <div class="d-flex flex-row align-items-center add-comment p-2 bg-white rounded" v-else>
                      <img
                          class="rounded-circle" src="../../assets/user.png"
                          width="40"><input v-model="restaurantComment.description" v-on:keyup.enter="addComment()"
                                            type="text"
                                            class="form-control border-0 no-box-shadow ml-1"
                                            placeholder="Leave a constructive comment...">
                    </div>
                  </div>
                  <div class="col-md-8" v-for="(comment, i) in restaurantComments" :key="i">
                    <div class="p-3 bg-white mt-2 rounded" style="border: 1px solid rgba(0, 0, 0, .07) !important;">
                      <div class="d-flex justify-content-between" v-if="comment.user">
                        <div class="d-flex flex-row user"><img class="rounded-circle img-fluid img-responsive"
                                                               v-bind:src="'data:image/jpeg;base64,'+ comment.user.profilePhoto"
                                                               width="40" alt="">
                          <div class="d-flex flex-column ml-2"><span
                              class="font-weight-bold">{{ comment.userName + ' ' + comment.userLastName }}</span><span
                              class="day">{{ comment.createdAt | formatDate }}</span></div>
                        </div>
                      </div>
                      <div class="d-flex justify-content-between" v-else>
                        <div class="d-flex flex-row user"><img class="rounded-circle img-fluid img-responsive"
                                                               src="../../assets/user.png" width="40" alt="">
                          <div class="d-flex flex-column ml-2"><span
                              class="font-weight-bold">{{ comment.userName + ' ' + comment.userLastName }}</span><span
                              class="day">{{ comment.createdAt | formatDate }}</span></div>
                        </div>
                      </div>
                      <div class="comment-text text-justify mt-2">
                        <p v-if="i !== editable">{{ comment.description }}</p>
                        <b-textarea v-model="comment.description" v-if="i === editable">
                        </b-textarea>
                      </div>
                      <div class="d-flex justify-content-end align-items-center" v-if="isOwnerOfComment(comment)">
                        <vs-button icon color="danger"
                                   v-if="i !== editable"
                                   v-on:click="deleteComment(comment.id)">
                          <box-icon name="trash-alt" type="solid"></box-icon>
                        </vs-button>
                        <div v-if="i !== editable">
                          <vs-button icon color="success" flat
                                     v-on:click="editComment(i)">
                            <box-icon name="edit" type="regular"></box-icon>
                          </vs-button>
                        </div>
                        <div class="d-flex justify-content-end align-items-center mt-2" v-else>
                          <button v-on:click="cancelEditingComment()" class="template-btn2">Cancel</button>
                          <button v-on:click="saveComment(comment)" class="template-btn">Save</button>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <a class="template-btn3 mt-2" v-on:click="loadMoreComments()" v-if="showViewMoreButton">View more</a>
          </md-tab>
          <md-tab id="tab-posts" md-label="Menus" md-icon="lunch_dining">
            <hr>
            <section class="update-area section-padding">
              <div class="row">
                <div class="col-md-4 mt-2" v-for="(menu, i) in restaurantMenus" :key="i">
                  <div class="single-food">
                    <div class="restaurant-img">
                      <img :src="'data:image/jpeg;base64,'+menu.image.data" class="img-fluid" alt="">
                    </div>
                    <div class="food-content">
                      <h5>{{ menu.title }}</h5>
                      <div class="d-flex justify-content-between">
                        <span class="mr-5 d-block mb-2 mb-lg-0"><i class="fa fa-user-o mr-2"></i>Price</span>
                        <span class="style-change">€ {{ menu.price }}</span>
                      </div>
                      <div class="d-flex justify-content-between">
                      <span class="mr-5 d-block mb-2 mb-lg-0"><i
                          class="fa fa-user-o mr-2"></i>Serving time until: </span>
                        <span v-if="menu.servingTime.hour">{{ toHoursAndMinutesFullFormat(menu.servingTime) }}</span>
                      </div>
                      <hr>
                      <h6>Ingredients</h6>
                      <p v-if="menu.ingredients">{{ menu.ingredients.toString() }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </md-tab>
          <md-tab id="tab-daily-menu" md-label="Daily Menu" md-icon="event">
            <hr>
            <section class="update-area section-padding" v-if="menuSelected">
              <div class="row ">
                <div class="col-md-4 mt-2" style="margin: 0 auto;">
                  <div class="single-food">
                    <div class="restaurant-img">
                      <img :src="'data:image/jpeg;base64,'+menuSelected.image.data" class="img-fluid" alt="">
                    </div>
                    <div class="food-content">
                      <h5>{{ menuSelected.title }}</h5>
                      <div class="d-flex justify-content-between">
                        <span class="mr-5 d-block mb-2 mb-lg-0"><i class="fa fa-user-o mr-2"></i>Price</span>
                        <span class="style-change">€ {{ menuSelected.price }}</span>
                      </div>
                      <div class="d-flex justify-content-between">
                      <span class="mr-5 d-block mb-2 mb-lg-0"><i
                          class="fa fa-user-o mr-2"></i>Serving time until: </span>
                        <span> {{ toHoursAndMinutesFullFormat(menuSelected.servingTime) }}</span>
                      </div>
                      <hr>
                      <h6>Ingredients</h6>
                      <p>{{ menuSelected.ingredients.toString() }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div v-if="isOwnerOfRestaurant">
              <div class="center">
                <vs-table
                    v-model="menuSelected">
                  <template #thead>
                    <vs-tr>
                      <vs-th>
                        Name
                      </vs-th>
                      <vs-th>
                        Add menu of the week
                      </vs-th>
                    </vs-tr>
                  </template>
                  <template #tbody>
                    <vs-tr
                        :key="i"
                        v-for="(menu, i) in restaurantMenus"
                        :data="menu">
                      <vs-td>
                        {{ menu.title }}
                      </vs-td>
                      <vs-td>
                        <button v-on:click="makeMenuOfTheWeek(menu)" class="template-btn">
                          Save
                        </button>
                      </vs-td>
                    </vs-tr>
                  </template>
                </vs-table>
              </div>
            </div>
          </md-tab>
        </md-tabs>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import {RestaurantComment} from "@/components/restaurant/transport/restaurant-comment";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default {
  name: 'RestaurantDetails',
  components: {Footer, Header},
  computed: {
    isOwnerOfRestaurant: function () {
      if (this.$store.getters.getUserLoggedIn)
        return this.restaurant.owner === this.$store.getters.getUserLoggedIn.id;
      return false;
    }
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
    menuPage: false,
    editable: -1,
    newCommentDescription: '',
    showViewMoreButton: true,
    menuSelected: '',
    allCheck: false
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
    mapStateOfPages: function (detailsPage, menuPage) {
      this.detailsPage = detailsPage;
      this.menuPage = menuPage;
    },
    loadRestaurantMenus: async function () {
      this.mapStateOfPages(false, true);
      await this.axios.get(`/restaurant/${this.restaurant.id}/with-menu`)
          .then((response) => {
            this.restaurantMenus = response.data.menus;
            this.restaurantMenus.forEach(menu => {
              if (menu.isMenuOfTheWeek === true) this.menuSelected = menu;
            });
          })
          .catch(() => {
          });
    },
    loadComments: async function (page) {
      const params = new URLSearchParams([['page', page], ['limit', this.pageLimit]]);

      await this.axios.get(`/restaurant-comment/by-restaurant-paginated/${this.restaurant.id}`, {params})
          .then((response) => {
            if (this.currentPage >= response.data.pages)
              this.showViewMoreButton = false;

            this.restaurantComments.push(...response.data.restaurantComments);
          })
          .catch(() => {
          });
    },
    loadRestaurantComments: async function () {
      await this.loadComments(this.currentPage)
    },
    loadMoreComments: async function () {
      this.currentPage++;
      await this.loadComments(this.currentPage);
    },
    addComment: async function () {
      this.restaurantComment.restaurant = this.restaurant.id;
      await this.axios.post(`/restaurant-comment/add`, this.restaurantComment)
          .then((res) => {
            this.restaurantComment = new RestaurantComment();

            const restaurantCommentInDb = res.data;
            restaurantCommentInDb.userName = this.$store.getters.getUserLoggedIn.name;
            restaurantCommentInDb.userLastName = this.$store.getters.getUserLoggedIn.lastName;
            restaurantCommentInDb.user  = { profilePhoto: this.profilePhotoOfLoggedInUser() };
            restaurantCommentInDb.userId  = this.$store.getters.getUserLoggedIn.id;
            this.restaurantComments.unshift(restaurantCommentInDb);
            this.restaurantComments.splice(this.currentPage * 4, 1);
            if (this.restaurantComments.length === 4)
              this.showViewMoreButton = true;

            this.restaurant.numberOfComments += 1;
          }).catch(() => {
          });
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
            this.restaurant.likes += 1;
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
            this.restaurant.likes -= 1;
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
    },
    hasUserProfile: function () {
      if (this.isAuthenticated()) {
        if (this.$store.getters.getLoggedInUserProfile.profilePhoto)
          return true;
      }

      return false;
    },
    saveComment: async function (comment) {
      await this.axios.put(`/restaurant-comment/${comment.id}`, comment)
          .then((res) => {
            this.restaurantComments[this.restaurantComment.index] = this.res.data;
            this.restaurantComment = res.data;
          }).catch(() => {
          });
      this.editable = -1;
    },
    editComment: async function (index) {
      this.editable = index;
    },
    cancelEditingComment: function () {
      this.editable = -1;
    },
    deleteComment: async function (commentId) {
      await this.axios.delete(`restaurant-comment/${commentId}`)
          .then(() => {
            const index = this.restaurantComments.findIndex(comment => comment.id === commentId);
            this.restaurantComments.splice(index, 1);
          })
          .catch()
    },
    profilePhotoOfLoggedInUser: function () {
      return this.$store.getters.getLoggedInUserProfile.profilePhoto;
    },
    toHoursAndMinutesFullFormat: function (servingTime) {
      const hour = servingTime.hour.toString().length < 2 ? '0' + servingTime.hour : servingTime.hour;
      const minutes = servingTime.minutes.toString().length < 2 ? '0' + servingTime.minutes : servingTime.minutes;
      return hour + ':' + minutes;
    },
    makeMenuOfTheWeek: async function (menu) {
      const menuOfTheWeek = {id: menu.id, restaurant: menu.restaurant, isMenuOfTheWeek: true};
      this.menuSelected = menu;

      await this.axios.post(`menu/of-the-week`, menuOfTheWeek).then((response) => {
        const index = this.restaurantMenus.findIndex(menu => menu.id === response.data.id);

        this.restaurantMenus[index] = response.data;
      });
    },
    isOwnerOfComment: function (comment) {
      return comment.userId === this.$store.getters.getUserLoggedIn.id;
    }
  },
  async created() {
    const id = this.$route.params.id;
    await this.getRestaurantDetails(id);
    await this.getUsersFavoriteRestaurant();
    await this.getUsersLikedRestaurants();
    await this.loadRestaurantComments();
    await this.loadRestaurantMenus();
  },
  watch: {
    async $route(to) {
      const id = to.params.id;
      await this.getRestaurantDetails(id);
    }
  }
}
</script>

<style scoped>
.md-tabs + .md-tabs {
  margin-top: 24px;
}

h1 {
  color: #000;
  font-family: "Playfair Display", serif;
  font-size: 60px !important;
  font-weight: 700;
  font-style: italic
}

h4 {
  color: #000;
  font-family: "Roboto", sans-serif;
  font-size: 24px !important;
  font-weight: 400;
  font-style: italic;
  text-transform: capitalize
}

h6 {
  color: #000;
  font-family: "Roboto", sans-serif;
  font-size: 24px !important;
  font-weight: 400;
  text-transform: capitalize;
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

.restaurant-img img {
  max-height: 350px;
  min-height: 350px;
  min-width: 350px;
  max-width: 350px;
  object-fit: fill;

}

.single-food:hover {
  -webkit-transform: scale(1.1, 1.1);
  -moz-transform: scale(1.1, 1.1);
  -ms-transform: scale(1.1, 1.1);
  -o-transform: scale(1.1, 1.1);
  transform: scale(1.1, 1.1)
}

.single-food {
  height: 600px;
  width: 350px;
}

.food-content {
  min-height: 252px;
  overflow: hidden;
}

.single-food .food-content .style-change {
  color: #ffb606;
  font-family: "Roboto", sans-serif;
  font-size: 20px;
  font-weight: 700;
  -webkit-transition: .5s;
  -moz-transition: .5s;
  -o-transition: .5s;
  transition: .5s
}

.restaurant-details {
  min-height: 690px;
}

.no-box-shadow {
  box-shadow: none
}

.no-box-shadow:focus {
  box-shadow: none
}

.day {
  font-size: 9px
}

.comment-text {
  font-size: 12px
}

.section-padding {
  padding: 40px 0;
}

.template-btn {
  color: #131230;
  background: #ffb606;
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid transparent;
  display: inline-block;
  padding: 12px 30px !important;
  -webkit-transition: all .5s;
  -moz-transition: all .5s;
  -o-transition: all .5s;
  transition: all 0.5s;
  margin-left: 20px;
}

.template-btn:hover {
  color: #131230;
  background: transparent;
  border: 1px solid #ffb606
}

.template-btn2 {
  color: #ffb606;
  background: #131230;
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid transparent;
  display: inline-block;
  padding: 12px 30px !important;
  -webkit-transition: all .5s;
  -moz-transition: all .5s;
  -o-transition: all .5s;
  transition: all 0.5s
}

.template-btn2:hover {
  color: #131230;
  background: transparent;
  border: 1px solid #ffb606
}

</style>