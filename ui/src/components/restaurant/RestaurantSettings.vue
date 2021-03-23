<template>
  <div>
    <Header></Header>
    <div class="container">
      <div class="mt-5">
        <md-steppers :md-active-step.sync="active" md-linear>
          <md-step id="first" md-label="Create Restaurant" :md-error="firstStepError" :md-done.sync="first">
            <div class="row justify-content-center ">
              <div class="mt-4 mb-4 create-form">
                <div style="min-width: 300px; min-height: 300px;">
                  <div v-if="restaurant.logo">
                    <picture-input
                        ref="pictureInput"
                        width="300"
                        height="300"
                        accept="image/png,image/jpeg,image/ico"
                        size="10"
                        button-class="btn"
                        :prefill="'data:image/jpeg;base64,'+restaurant.logo"
                        :prefill-options="{mediaType: 'image/jpeg'}"
                        :custom-strings=" {
                            upload: '<h1>Bummer!</h1>',
                            drag: uploadMenuImage
                        }"
                        @change="onChange">
                    </picture-input>
                  </div>
                  <template v-else style="min-width: 300px; min-height: 300px;">
                    <picture-input
                        ref="pictureInput"
                        width="300"
                        height="300"
                        accept="image/png,image/jpeg,image/ico"
                        size="10"
                        button-class="btn"
                        :custom-strings=" {
                            upload: '<h1>Bummer!</h1>',
                            drag: uploadMenuImage
                        }"
                        @change="onChange">

                    </picture-input>
                  </template>
                  <span v-if="restaurantValidationError.logoError" class="validation-message">
                    Logo is required!
                </span>
                </div>
                <div class="d-flex justify-content-center mt-4">
                  <vs-input label-placeholder="Name" v-model="restaurant.name">
                    <template v-if="restaurantValidationError.nameError" #message-danger>
                      Name is required!
                    </template>
                  </vs-input>
                </div>
                <div class="mt-3">
                  <b-form-textarea
                      id="textarea"
                      placeholder="Enter Restaurant's Description"
                      rows="3"
                      max-rows="6"
                      v-model="restaurant.description"
                  ></b-form-textarea>
                  <span v-if="restaurantValidationError.descriptionError" class="validation-message">
                    Description is required!
                </span>
                </div>
                <div class=" d-flex row justify-content-between">
                  <div class="mt-5 col-7">
                    <vs-input
                        v-model="restaurant.opensAt"
                        type="time"
                        label="Opens at">
                      <template v-if="restaurantValidationError.opensAtError" #message-danger>
                        Opens at is required!
                      </template>
                    </vs-input>
                  </div>
                  <div class="mt-5 col-5">
                    <vs-input
                        v-model="restaurant.closesAt"
                        type="time"
                        label="Closes at">
                      <template v-if="restaurantValidationError.closesAtError" #message-danger>
                        Closes at is required!
                      </template>
                    </vs-input>
                  </div>
                </div>
                <div class="row">
                  <div class="mt-4 col-7">
                    <vs-input label-placeholder="City" v-model="restaurant.city">
                      <template v-if="restaurantValidationError.cityError" #message-danger>
                        City required!
                      </template>
                    </vs-input>
                  </div>
                  <div class="mt-4 col-5">
                    <vs-input label-placeholder="Street" v-model="restaurant.street">
                      <template v-if="restaurantValidationError.streetError" #message-danger>
                        Street is required!
                      </template>
                    </vs-input>
                  </div>
                </div>
                <div v-if="userCurrentGeoLocation.lat" class="mt-3">
                  <p>Click on the map to add restaurant location!</p>
                  <HereMap :center="userCurrentGeoLocation" :throwEvent="true"
                           @addRestaurantLocation="addRestaurantLocation($event)"
                           :marker-list="markerList"
                           ref="hereMap"></HereMap>
                  <span v-if="!restaurant.location" class="validation-message">
                        Restaurant location on the map is required!
                    </span>
                </div>
                <div class="d-flex justify-content-center">
                  <button class="template-btn2" v-on:click="cancelRestaurant()">
                    Cancel
                  </button>
                  <button class="template-btn" v-on:click="saveRestaurant()">Save</button>
                  <button class="template-btn3" v-on:click="goToMenuTab()" v-if="restaurant.id">Next</button>
                </div>
              </div>
            </div>
            <div class="center">
              <vs-dialog not-center v-model="activePopUp">
                <template #header>
                  <h4 class="not-margin">
                    Restaurant location
                  </h4>
                </template>
                <div class="con-content">
                  <p>
                    Is this the correct restaurant location?
                  </p>
                </div>

                <template #footer>
                  <div class="con-footer d-flex flex-row-reverse bd-highlight ">
                    <vs-button dark transparent v-on:click="cancel()">
                      No
                    </vs-button>
                    <div class="justify-content-center">
                      <vs-button v-on:click="saveRestaurantLocation()" transparent>
                        Yes
                      </vs-button>
                    </div>
                  </div>
                </template>
              </vs-dialog>
            </div>
          </md-step>
          <md-step id="second" md-label="Add menu" :md-done.sync="second">
            <div class="row justify-content-center">
              <div class="mt-4 mb-4 create-form" v-for="(menu, index) in menus" :key="index">
                <hr class="mt-3">
                <div style="min-width: 300px; min-height: 300px;">
                  <vs-button style="float:right;" icon danger v-on:click="deleteMenu(menu, index)">
                    <box-icon type='solid' name='trash-alt'></box-icon>
                  </vs-button>
                  <div v-if="menu.image.data">
                    <picture-input
                        ref="menuInput"
                        width="299"
                        height="299"
                        accept="image/png,image/jpeg,image/ico"
                        size="10"
                        button-class="btn"
                        :prefill="'data:image/jpeg;base64,'+menu.image.data"
                        :prefill-options="{mediaType: 'image/jpeg'}"
                        :custom-strings=" {
                            upload: '<h1>Bummer!</h1>',
                            drag: uploadPictureInputText
                        }"
                        @change="onMenuImageChange($event, menu)">
                    </picture-input>
                  </div>
                  <template v-else style="min-width: 300px; min-height: 300px;">
                    <picture-input
                        ref="menuInput"
                        width="300"
                        height="300"
                        accept="image/png,image/jpeg,image/ico"
                        size="10"
                        button-class="btn"
                        :custom-strings=" {
                            upload: '<h1>Bummer!</h1>',
                            drag: uploadPictureInputText
                        }"
                        @change="onMenuImageChange($event, menu)">
                    </picture-input>
                  </template>
                  <span v-if="index === menusValidationError.index && menusValidationError.menuImageError"
                        class="validation-message">
                    Image is required!
                </span>
                </div>
                <div class="d-flex justify-content-center mt-5">
                  <vs-input  label-placeholder="Name" v-model="menu.title">
                    <template v-if="index === menusValidationError.index && menusValidationError.nameError"
                              #message-danger>
                      Name is required!
                    </template>
                  </vs-input>
                </div>
                <div class="mt-3">
                  <md-chips class="md-primary" v-model="menu.ingredients" md-placeholder="Add ingredients...">
                    <label>Ingredients</label>
                    <div class="md-helper-text">Ingredients of menu</div>
                  </md-chips>
                  <span v-if="index === menusValidationError.index && menusValidationError.ingredientsError"
                        class="validation-message">
                    At least one ingredient is required!
                </span>
                </div>
                <div class="d-flex justify-content-between">
                  <div class="mt-5">
                    <vs-input
                        v-model="menu.servingTime"
                        type="time"
                        label="Serving Time Until:">
                      <template v-if="index === menusValidationError.index && menusValidationError.servingTimeError"
                                #message-danger>
                        Serving time is required!
                      </template>
                    </vs-input>
                  </div>
                  <div class="mt-5">
                    <vs-input
                        v-model="menu.price"
                        type="number"
                        label="Price">
                      <template v-if="index === menusValidationError.index && menusValidationError.priceError"
                                #message-danger>
                        Serving time is required!
                      </template>
                    </vs-input>
                  </div>
                </div>
                <div class="d-flex justify-content-center mt-5">
                  <vs-select label="Category" placeholder="Category" v-model="menu.category">
                    <vs-option label="General" value="general">
                      General
                    </vs-option>
                    <vs-option label="Salad" value="salad">
                      Salad
                    </vs-option>
                    <vs-option label="Starter" value="starter">
                      Starter
                    </vs-option>
                    <vs-option label="Speciality" value="speciality">
                      Speciality
                    </vs-option>
                  </vs-select>
                </div>
              </div>
            </div>
            <div class="d-flex bd-highlight">
              <div class="p-2 w-100 bd-highlight">
                <p>Click the button to add a new menu for restaurant.</p>
              </div>
              <div class="p-2 flex-shrink-1 bd-highlight">
                <vs-button icon v-on:click="addNewMenuToArrayForm()" style="float: right;" color="rgb(245, 209, 66)">
                  <box-icon type="regular" name="plus-circle"></box-icon>
                </vs-button>
              </div>
            </div>
            <div class="d-flex justify-content-center mt-3">
              <button class="template-btn2" v-on:click="cancelMenu()">
                Cancel
              </button>
              <button class="template-btn" v-on:click="saveMenus()">
                Save
              </button>
            </div>
          </md-step>
        </md-steppers>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import PictureInput from 'vue-picture-input'
import HereMap from "../map/HereMap";
import {CreateRestaurantRequest} from "./transport/create-restaurant-request";
import {Menu} from "@/components/restaurant/transport/menu";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default {
  name: 'RestaurantOperations',
  components: {
    Footer,
    Header,
    PictureInput,
    HereMap
  },
  data: () => ({
    uploadPictureInputText: 'Attach Restaurant\'s logo',
    uploadMenuImage: 'Attach menu\'s image',
    activePopUp: false,
    markerList: [],
    restaurantCoordinates: {},
    userCurrentGeoLocation: {},
    restaurant: new CreateRestaurantRequest(),
    active: 'first',
    first: false,
    second: false,
    firstStepError: null,
    menus: [],
    restaurantValidationError: {
      descriptionError: false,
      logoError: false,
      opensAtError: false,
      closesAtError: false,
      cityError: false,
      streetError: false,
      locationError: false,
      nameError: false
    },
    menusValidationError: {
      index: '',
      menuImageError: false,
      nameError: false,
      ingredientsError: false,
      servingTimeError: false,
      priceError: false
    }
  }),
  methods: {
    onChange: async function (image) {
      if (image) {
        this.restaurant.logo = this.removeBase64EncodingString(image);
        return;
      }
      this.$vs.notification({
        title: 'Image not uploaded!',
        text: `Please check the image format, it is not supported!`
      });
    },
    onMenuImageChange: function (image, menu) {
      if (image) {
        menu.image.data = this.removeBase64EncodingString(image);
        menu.image.contentType = 'image/jpeg';
        return;
      }

      this.$vs.notification({
        title: 'Image not uploaded!',
        text: `Please check the image format, it is not supported!`
      });
    },
    saveRestaurantLocation: function () {
      this.activePopUp = false;
      this.markerList.push(this.restaurantCoordinates);
      this.restaurant.location.coordinates.push(this.restaurantCoordinates.longitude);
      this.restaurant.location.coordinates.push(this.restaurantCoordinates.latitude);
    },
    addRestaurantLocation: function (coordinates) {
      this.activePopUp = true;
      this.restaurantCoordinates = coordinates;
    },
    cancel: function () {
      this.activePopUp = false;
      this.restaurantCoordinates = {}
    },
    saveRestaurant: async function () {
      const hasError = this.validateRestaurant(this.restaurant);
      if (!hasError) {
        this.setDone('first', 'second');
        if (this.restaurant.id) {
          return this.axios.put(`/restaurant/by-id/${this.restaurant.id}`, this.restaurant)
              .then((response) => {
                this.setDone('first', 'second');
                this.restaurant = response.data;
              }, (error) => {
                this.$vs.notification({
                  title: 'Error occurred!',
                  text: `Please try again.`
                });
                console.log(error.response);
              })
              .catch((error) => {
                console.log(error.response);
              });
        }
        this.restaurant.createdAt = new Date();
        this.axios.post('/restaurant/', this.restaurant)
            .then((response) => {
              this.setDone('first', 'second');
              this.restaurant = response.data;
            }, (error) => {
              console.log(error.response);
            })
            .catch((error) => {
              console.log(error.response);
            });
      }
    },
    saveMenus: async function () {
      let hasError = false;
      for (let i = 0; i < this.menus.length; i++) {
        hasError = this.validateMenu(this.menus[i], i);
        if (hasError)
          return;
      }

      if (!hasError) {
        this.menus.forEach(menu => {
          menu.restaurant = this.restaurant.id;
          menu.servingTime = {hour: menu.servingTime.split(':')[0], minutes: menu.servingTime.split(':')[1]};
        });

        await this.axios.post(`/menu/list-of-menu`, this.menus)
            .then((response) => {
              this.menus = response.data;
              this.$router.push(`/restaurant-details/${this.restaurant.id}`);
            })
      }
    },
    validateMenu: function (menu, index) {
      let hasError = false;
      if (!menu.image.data) {
        this.menusValidationError.menuImageError = true;
        hasError = true;
      }

      if (!menu.title) {
        this.menusValidationError.nameError = true;
        hasError = true;
      }

      if (!menu.servingTime) {
        this.menusValidationError.servingTimeError = true;
        hasError = true;
      }

      if (menu.ingredients.length < 1) {
        this.menusValidationError.ingredientsError = true;
        hasError = true;
      }

      if (hasError)
        this.menusValidationError.index = index;

      return hasError;
    },
    validateRestaurant: function (restaurant) {
      let hasError = false;
      if (!restaurant.description) {
        this.restaurantValidationError.descriptionError = true;
        hasError = true;
      }

      if (!restaurant.logo) {
        this.restaurantValidationError.logoError = true;
        hasError = true;
      }

      if (!restaurant.opensAt) {
        this.restaurantValidationError.opensAtError = true;
        hasError = true;
      }

      if (!restaurant.closesAt) {
        this.restaurantValidationError.closesAtError = true;
        hasError = true;
      }

      if (!restaurant.city) {
        this.restaurantValidationError.cityError = true;
        hasError = true;
      }

      if (!restaurant.street) {
        this.restaurantValidationError.streetError = true;
        hasError = true;
      }

      if (!restaurant.location.coordinates) {
        this.restaurantValidationError.locationError = true;
        hasError = true;
      }

      if (!restaurant.name) {
        this.restaurantValidationError.nameError = true;
        hasError = true;
      }

      return hasError;
    },
    removeBase64EncodingString: function (image) {
      const base64String = 'base64,';
      const index = image.indexOf(base64String);

      return image.substring(index + base64String.length, image.length);
    },
    getRestaurantDetails: function (restaurantId) {
      this.axios.get(`/restaurant/${restaurantId}/with-menu`)
          .then((response) => {
            this.restaurant = response.data;
            if (this.restaurant.location.coordinates.length > 0) {
              for (let i = 0; i < this.restaurant.location.coordinates.length; i++) {
                this.markerList.push({
                  longitude: this.restaurant.location.coordinates[i],
                  latitude: this.restaurant.location.coordinates[++i]
                });
              }
            }
          });
    },
    getUserCurrentLocation: function () {
      navigator.geolocation.getCurrentPosition(pos => {
        this.userCurrentGeoLocation = {lat: pos.coords.latitude, lng: pos.coords.longitude};
      });
    },
    cancelRestaurant: function () {
      this.$router.push('/');
    },
    setDone(id, index) {
      this[id] = true

      this.firstStepError = null

      if (index) {
        this.active = index
      }
    },
    addNewMenuToArrayForm: function () {
      this.menus.push(new Menu());
    },
    cancelMenu: function () {

    },
    goToMenuTab: function () {
      this.menus = this.restaurant.menus;
      this.menus.forEach(menu => menu.servingTime = menu.servingTime.hour + ':'+menu.servingTime.minutes);
      this.setDone('first', 'second');
    },
    deleteMenu: async function(menu, index) {
      if (menu.id) {
        await this.axios.delete(`/menu/${menu.id}`).then(() => {
          this.menus.splice(index, 1);
        });

        return;
      }
      this.menus.splice(index, 1);
    }
  },
  created() {
    const {id} = this.$route.params;
    if (id) {
      this.getRestaurantDetails(id);
    }
    this.getUserCurrentLocation();
  }
}
</script>

<style scoped>
.validation-message {
  padding-top: 2px;
  color: rgba(var(--vs-danger), 1);
  font-size: 0.7rem;
}

.create-form {
  min-width: 600px;
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

.template-btn3 {
  color: #131230;
  background: transparent;
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

.template-btn3:hover {
  color: #131230;
  background: #4cd3e3;
  border: 1px solid #131230;
}
</style>
