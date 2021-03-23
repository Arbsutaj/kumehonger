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
            <div v-if="!editCredentials">
              <button class="template-btn2 mt-2 align-self-center" type="button"
                      v-on:click="editCredentials = !editCredentials">
                <box-icon type='solid' name='lock' color="#ffb606"></box-icon>
                Edit credentials
              </button>
            </div>
            <div v-else>
              <button class="template-btn2 mt-2 align-self-center" type="button"
                      v-on:click="editCredentials = !editCredentials">
                Edit profile
              </button>
            </div>


            <span></span></div>
        </div>
        <div class="col-md-5 border-right" v-if="!editCredentials">
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
              <div class="col-md-12"><label class="labels">Address</label><input v-model="userProfile.address"
                                                                                 type="text"
                                                                                 class="form-control"
                                                                                 placeholder="Enter address"></div>
            </div>
            <div class="row mt-3">
              <div class="col-md-6"><label class="labels">Country</label><input v-model="userProfile.country"
                                                                                type="text"
                                                                                class="form-control"
                                                                                placeholder="country"></div>
              <div class="col-md-6"><label class="labels">State/Region</label><input v-model="userProfile.state"
                                                                                     type="text" class="form-control"
                                                                                     placeholder="state"></div>
            </div>

          </div>
        </div>
        <div class="col-md-4" v-if="!editCredentials">
          <div class="p-3 py-5">
            <div class="col-md-12 mt-5"><label class="labels">Website</label><input v-model="userProfile.website"
                                                                                    type="text"
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
              <button class="template-btn" type="button" v-on:click="save()">Save Profile</button>
            </div>
          </div>
        </div>
        <div class="col-md-5" v-if="editCredentials">
          <div class="p-3 py-5">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="text-right">Change password</h4>
            </div>
            <div class="form">
              <div class="form-group">
                <input type="email" class="form-control" placeholder="Old password"
                       v-model="changePasswordRequest.oldPassword">
              </div>
              <div class="form-group mb-4">
                <input type="password" class="form-control" placeholder="***********"
                       v-model="changePasswordRequest.newPassword">
              </div>
              <div class="form-group mb-4">
                <input type="password" class="form-control" placeholder="***********"
                       v-model="changePasswordRequest.newPasswordRepeated">
              </div>
              <button class="template-btn mb-4"
                     v-on:click="requestPasswordChange()">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>

</template>

<script>
import {UserProfile} from "@/components/user/transport/user.profile";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import {ChangePasswordRequest} from "@/components/user/transport/change.password.request";

export default {
  name: "ProfileSettings",
  components: {Footer, Header},
  data: () => ({
    userProfile: new UserProfile(),
    editCredentials: false,
    changePasswordRequest: new ChangePasswordRequest()
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
    },
    requestPasswordChange: async function() {
      await this.axios.post(`users/change-password`, this.changePasswordRequest).then(async () => {
        await this.$store.dispatch('AUTH_LOGOUT');
        await this.$router.push('/login');
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

.form-control:focus {
  box-shadow: none;
  border-color: #BA68C8
}

h4 {
  font-family: "Roboto", sans-serif;
  font-size: 24px !important;
  font-weight: 400;
  font-style: italic;
  text-transform: capitalize
}

.labels {
  font-size: 11px
}

.template-btn2 {
  color: #ffff;
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
  transition: all 0.5s
}

.template-btn:hover {
  color: #131230;
  background: transparent;
  border: 1px solid #ffb606
}

.template-btn2:hover {
  color: #131230;
  background: transparent;
  border: 1px solid #add8e6;
}

.form-control {
  border: 1px solid #d5dae2;
  padding: 15px 25px;
  margin-bottom: 20px;
  min-height: 45px;
  font-size: 13px;
  line-height: 15;
  font-weight: normal;
}

.form-control::-webkit-input-placeholder {
  color: #919aa3;
}

.form-control::-moz-placeholder {
  color: #919aa3;
}

.form-control:-ms-input-placeholder {
  color: #919aa3;
}

.form-control::-ms-input-placeholder {
  color: #919aa3;
}

.form-control::placeholder {
  color: #919aa3;
}

</style>