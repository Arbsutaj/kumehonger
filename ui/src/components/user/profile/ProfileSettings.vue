<template>
  <div>
    <Header></Header>
    <div class="container bg-white mt-5 mb-5">
      <div class="row">
        <div class="col-md-3 border-right">
          <div class="d-flex flex-column align-items-center text-center p-3 py-5">
            <img class="rounded-circle mt-5"
                 width="150px"
                 v-bind:src="'data:image/jpeg;base64,' + userProfile.profilePhoto"
                 alt="Profile Photo">
            <span class="font-weight-bold">{{ getUserFullName() }}</span>
            <span class="text-black-50">{{ userProfile.user.userDto.email }}</span>
            <span></span></div>
        </div>
        <div class="col-md-5 border-right">
          <div class="p-3 py-5">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="text-right">Profile Settings</h4>
            </div>
            <div class="row mt-2">
              <div class="col-md-6"><label class="labels">Name</label><input type="text" class="form-control"
                                                                             placeholder="First name"
                                                                             v-model="userProfile.user.userDto.name">
              </div>
              <div class="col-md-6"><label class="labels">Surname</label><input type="text" class="form-control"
                                                                                placeholder="Surname"
                                                                                v-model="userProfile.user.userDto.lastName">
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-md-12"><label class="labels">Phone</label><input v-model="userProfile.phone" type="text"
                                                                               class="form-control"
                                                                               placeholder="Enter phone number"></div>
              <div class="col-md-12"><label class="labels">Mobile</label><input v-model="userProfile.mobile" type="text"
                                                                                class="form-control"
                                                                                placeholder="Enter mobile number"></div>
              <div class="col-md-12"><label class="labels">Street</label><input v-model="userProfile.street" type="text"
                                                                                class="form-control"
                                                                                placeholder="Enter street"></div>
              <div class="col-md-12"><label class="labels">Address</label><input v-model="userProfile.address" type="text"
                                                                                 class="form-control"
                                                                                 placeholder="Enter address"></div>
            </div>
            <div class="row mt-3">
              <div class="col-md-6"><label class="labels">Country</label><input v-model="userProfile.country" type="text"
                                                                                class="form-control"
                                                                                placeholder="country"></div>
              <div class="col-md-6"><label class="labels">State/Region</label><input v-model="userProfile.state"
                                                                                     type="text" class="form-control"
                                                                                     placeholder="state"></div>
            </div>

          </div>
        </div>
        <div class="col-md-4">
          <div class="p-3 py-5">
            <div class="col-md-12 mt-5"><label class="labels">Website</label><input v-model="userProfile.website" type="text"
                                                                               class="form-control"
                                                                               placeholder="Website">
            </div>
            <br>
            <div class="col-md-12">

              <label class="labels">Instagram</label>
              <input v-model="userProfile.instagram"
                     type="text"
                     class="form-control"
                     placeholder="Instagram">
            </div>
            <br>
            <div class="col-md-12">
              <label class="labels">Facebook</label>
              <input v-model="userProfile.facebook" type="text" class="form-control" placeholder="Facebook">
            </div>
            <div class="mt-5 text-center">
              <button class="btn btn-primary profile-button" type="button" v-on:click="save()">Save Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>

</template>

<script>
import {UserProfile} from "@/components/user/profile/user.profile";
import Header from "@/components/view/Header";
import Footer from "@/components/view/Footer";

export default {
  name: "ProfileSettings",
  components: {Footer, Header},
  data: () => ({
    userProfile: new UserProfile()
  }),
  methods: {
    save: async function () {
      if (this.userProfile.id) {
        await this.axios.put(`user-profile/${this.userProfile.id}`, this.userProfile)
            .then((response) => {
              this.userProfile = response.data;
            }).catch(() => {

            });

        return;
      }

      await this.axios.post(`user-profile/`, this.userProfile)
          .then((response) => {
            this.userProfile = response.data;
          }).catch(() => {

          });
    },
    getUserFullName: function () {
      return this.userProfile.user.userDto.name + " " + this.userProfile.user.userDto.lastName;
    },
    loadUserProfile: async function (userId) {
      await this.axios.get(`user-profile/${userId}`)
          .then((response) => {
            this.userProfile = response.data;
          }).catch(() => {
          });
    }
  },
  async created() {
    const id = this.$route.params.id;

    await this.loadUserProfile(id);
  }
}
</script>

<style scoped>
body {
  background: rgb(99, 39, 120)
}

.form-control:focus {
  box-shadow: none;
  border-color: #BA68C8
}

.profile-button {
  background: rgb(99, 39, 120);
  box-shadow: none;
  border: none
}

.profile-button:hover {
  background: #682773
}

.profile-button:focus {
  background: #682773;
  box-shadow: none
}

.profile-button:active {
  background: #682773;
  box-shadow: none
}

.back:hover {
  color: #682773;
  cursor: pointer
}

.labels {
  font-size: 11px
}

.add-experience:hover {
  background: #BA68C8;
  color: #fff;
  cursor: pointer;
  border: solid 1px #BA68C8
}
</style>