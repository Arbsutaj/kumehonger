<template>
  <div>
    <vs-navbar shadow square center-collapsed v-model="active">
      <template #left v-if="isLoggedIn">

      </template>
      <template #right v-if="isLoggedIn">
        <Dropdown
            :options="options"
            v-on:selected="navigateToRestaurantDetails($event._id)"
            :disabled="false"
            name="zipcode"
            :maxItem="10"
            placeholder="Search restaurant"
            v-on:filter="filterRestaurantsByName($event)">
        </Dropdown>
        <vs-button flat v-on:click="logout()">Logout</vs-button>
      </template>
    </vs-navbar>
    <vs-sidebar
        reduce
        hover-expand
        v-model="active"
        open>
      <vs-sidebar-item v-for="sidebarItem in sideBarItems.items" :key="sidebarItem.index" :id="sidebarItem.id"
                       :to="sidebarItem.route">
        <template #icon>
          <box-icon :name="sidebarItem.icon" :type="sidebarItem.iconType"></box-icon>
        </template>
        {{ sidebarItem.name }}
      </vs-sidebar-item>
      <div v-if="sideBarItems.sideBarGroups">
        <vs-sidebar-group v-for="sidebarGroup in sideBarItems.sideBarGroups" :key="sidebarGroup.title">
          <template #header>
            <vs-sidebar-item arrow>
              <template #icon>
                <box-icon :name="sidebarGroup.icon"></box-icon>
              </template>
              {{ sidebarGroup.title }}
            </vs-sidebar-item>
          </template>
          <vs-sidebar-item v-for="sidebarItem in sidebarGroup.items" :key="sidebarItem.index"
                           :to="sidebarItem.route">
            <template #icon>
              <box-icon :name="sidebarItem.icon" :type="sidebarItem.iconType"></box-icon>
            </template>
            {{ sidebarItem.name }}
          </vs-sidebar-item>
        </vs-sidebar-group>
      </div>
      <template #footer>
        <vs-row justify="space-between">
          <vs-avatar v-if="hasProfilePhoto" >
            <img v-bind:src="hasProfilePhoto" alt="Profile photo" >
          </vs-avatar>
          <vs-avatar v-else>
            <img src="@/assets/user.png" alt="Profile photo">
          </vs-avatar>
          <vs-avatar badge-color="danger" badge-position="top-right">
            <box-icon name='message-alt-detail' ></box-icon>
            <template #badge>
              28
            </template>
          </vs-avatar>
        </vs-row>
      </template>
    </vs-sidebar>
  </div>
</template>


<script>

import 'boxicons';
import {SideBar} from "./SideBarItems";
import Dropdown from 'vue-simple-search-dropdown';

export default {
  name: 'SideBar',
  components: {
    Dropdown
  },
  data: () => ({
    notExpand: false,
    reduce: true,
    indexActive: 0,
    sideBarItems: SideBar,
    active: 'home',
    activeSidebar: false,
    options: [],
    profilePhoto: ''
  }),
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isAuthenticated
    },
    hasProfilePhoto: function () {
      return 'data:image/jpeg;base64,' + this.$store.getters.getLoggedInUserProfile.profilePhoto;
    }
  },
  methods: {
    logout: async function () {
      await this.$store.dispatch('AUTH_LOGOUT');
      await this.$router.push('/login');
    },
    navigateToRestaurantDetails: async function (restaurantId) {
      if (restaurantId !== undefined)
        await this.$router.push({path: `/restaurant-details/${restaurantId}`});
    },
    filterRestaurantsByName: async function (name) {
      const params = new URLSearchParams([['name', name]]);

      await this.axios.get(`/restaurant//by-name`, {params})
          .then((response) => {
            this.options = response.data;
          })
          .catch(() => {
          });
    },
    created() {
    }
  }
}
</script>

<style>
.header-sidebar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}

.header-sidebar h4 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.header-sidebar > button {
  margin-left: 10px;
}

.footer-sidebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.footer-sidebar > button {
  border: 0px solid rgba(0, 0, 0, 0) !important;
  border-left: 1px solid rgba(0, 0, 0, .07) !important;
  border-radius: 0px !important;
}

.my-navbar {
  color: rgb(255, 255, 255);
}

*:focus {
  outline: 0 !important;
}

.vs-navbar-content {
  position: relative !important;
}
</style>
