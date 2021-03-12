<template>
  <b-card class="mt-4">
    <div class="row new-restaurant-form">
      <div class="col mt-4">
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
                            drag: uploadPictureInputText
                        }"
              @change="onChange">

          </picture-input>
        </div>
        <template v-else>
          <picture-input
              ref="pictureInput"
              width="300"
              height="300"
              accept="image/png,image/jpeg,image/ico"
              size="10"
              button-class="btn"
              :custom-strings=" {
                            upload: '<h1>Bummer!</h1>',
                            drag: uploadPictureInputText
                        }"
              @change="onChange">

          </picture-input>
        </template>


        <span v-if="restaurant.logo === ''" class="validation-message">
                    Logo is required!
                </span>
      </div>
      <div class="col mt-4">
        <div class="d-flex justify-content-start">
          <vs-input label-placeholder="Name" v-model="restaurant.name">
            <template v-if="restaurant.name === ''" #message-danger>
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
          <span v-if="!restaurant.description" class="validation-message">
                    Description is required!
                </span>
        </div>
        <div class="row">
          <div class="mt-4 col">
            <vs-input
                v-model="restaurant.opensAt"
                type="time"
                label="Opens at">
              <template v-if="!restaurant.opensAt" #message-danger>
                Opens at is required!
              </template>
            </vs-input>
          </div>
          <div class="mt-4 col">
            <vs-input
                v-model="restaurant.closesAt"
                type="time"
                label="Closes at">
              <template v-if="!restaurant.closesAt" #message-danger>
                Closes at is required!
              </template>
            </vs-input>
          </div>
        </div>
        <div class="row">
          <div class="mt-4 col">
            <vs-input label-placeholder="City" v-model="restaurant.city">
              <template v-if="restaurant.city === ''" #message-danger>
                City required!
              </template>
            </vs-input>
          </div>
          <div class="mt-4 col">
            <vs-input label-placeholder="Street" v-model="restaurant.street">
              <template v-if="restaurant.street === ''" #message-danger>
                Street is required!
              </template>
            </vs-input>
          </div>
        </div>
        <div class="d-flex justify-content-start">

        </div>
        <div v-if="userCurrentGeoLocation.lat">
          <p>Click on the map to add restaurant location!</p>
          <HereMap :center="userCurrentGeoLocation" :throwEvent="true"
                   @addRestaurantLocation="addRestaurantLocation($event)"
                   :marker-list="markerList"
                   ref="hereMap"></HereMap>
          <span v-if="!restaurant.location" class="validation-message">
                        Restaurant location on the map is required!
                    </span>
        </div>
      </div>
    </div>
    <div class="d-flex flex-row-reverse">
      <vs-button danger v-on:click="cancelRestaurant()">
        Cancel
      </vs-button>
      <vs-button v-on:click="saveRestaurant()">
        Save
      </vs-button>
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
  </b-card>
</template>

<script>
import PictureInput from 'vue-picture-input'
import HereMap from "../map/HereMap";
import {CreateRestaurantRequest} from "./create-restaurant-request";

export default {
  name: 'RestaurantOperations',
  components: {
    PictureInput,
    HereMap
  },
  data: () => ({
    uploadPictureInputText: 'Attach Restaurant\'s logo',
    activePopUp: false,
    markerList: [],
    restaurantCoordinates: {},
    userCurrentGeoLocation: {},
    restaurant: new CreateRestaurantRequest(),
    counter: 0
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
    saveRestaurant: function () {
      if (this.restaurant.id) {
        console.log(this.restaurant);
        return this.axios.put(`/restaurant/by-id/${this.restaurant.id}`, this.restaurant)
            .then((response) => {
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
            this.restaurant = response.data;
          }, (error) => {
            console.log(error.response);
          })
          .catch((error) => {
            console.log(error.response);
          });
    },
    validateRestaurant: function (restaurant) {
      console.log(restaurant);
    },
    removeBase64EncodingString: function (image) {
      const base64String = 'base64,';
      const index = image.indexOf(base64String);

      return image.substring(index + base64String.length, image.length);
    },
    getRestaurantDetails: function (restaurantId) {
      this.axios.get(`/restaurant/by-id/${restaurantId}`)
          .then((response) => {
            this.restaurant = response.data;
            console.log(this.restaurant.location.coordinates.length);
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

<style>
  .validation-message {
    padding-top: 2px;
    color: rgba(var(--vs-danger), 1);
    font-size: 0.7rem;
  }
</style>
