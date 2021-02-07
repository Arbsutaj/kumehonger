<template>
    <div>
        <vs-navbar shadow square center-collapsed v-model="active">
            <template #left v-if="isLoggedIn">
                <vs-button @click="activeSidebar = !activeSidebar" flat icon>
                    <box-icon name="menu"></box-icon>
                </vs-button>
            </template>
            <template #right v-if="isLoggedIn">
                <Dropdown
                        :options="options"
                        v-on:selected="navigateToRestaurantDetails($event.id)"
                        :disabled="false"
                        name="zipcode"
                        :maxItem="10"
                        placeholder="Search restaurant">
                </Dropdown>
                <vs-button flat v-on:click="logout()">Logout</vs-button>
            </template>
        </vs-navbar>
        <vs-sidebar
                absolute
                v-model="active"
                :open.sync="activeSidebar">
            <vs-sidebar-item v-for="sidebarItem in sideBarItems.items" :key="sidebarItem.index" :id="sidebarItem.id"
                             :to="sidebarItem.route">
                <template #icon>
                    <box-icon :name="sidebarItem.icon" :type="sidebarItem.iconType"></box-icon>
                </template>
                {{sidebarItem.name}}
            </vs-sidebar-item>
            <div v-if="sideBarItems.length">
                <vs-sidebar-group v-for="sidebarGroup in sideBarItems" :key="sidebarGroup.title">
                    <template #header>
                        <vs-sidebar-item arrow>
                            <template #icon>
                                <box-icon :name="sidebarGroup.iconType"></box-icon>
                            </template>
                            {{sidebarGroup.title}}
                        </vs-sidebar-item>
                    </template>
                    <vs-sidebar-item v-for="sidebarItem in sidebarGroup.items" :key="sidebarItem.index"
                                     :to="sidebarItem.route">
                        <template #icon>
                            <box-icon :name="sidebarItem.iconType"></box-icon>
                        </template>
                        {{sidebarItem.name}}
                    </vs-sidebar-item>
                </vs-sidebar-group>
            </div>
            <template #footer>
                <vs-row justify="space-between">
                    <vs-avatar>
                        <!--                        <img src="/avatars/avatar-5.png" alt="">-->
                    </vs-avatar>

                    <!--                    <vs-button size="small">-->
                    <vs-avatar badge-color="danger" badge-position="top-right">
                        <box-icon name="bell" type="solid"></box-icon>
                        <template #badge>
                            28
                        </template>
                    </vs-avatar>
                    <!--                    </vs-button>-->
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
            options: [{name: 'Arb', id: '5fdd30908d71c42a5c9332b6'}, {name: 'Arbs', id: '123'}, {name: 'arb sutaj', id: '1234'}],
        }),
        computed: {
            isLoggedIn: function () {
                return this.$store.getters.isAuthenticated
            }
        },
        methods: {
            logout: async function () {
                await this.$store.dispatch('AUTH_LOGOUT');
                this.$router.push('/login');
            },
            navigateToRestaurantDetails: async function(restaurantId) {

                if (restaurantId !== undefined)
                    this.$router.push({path: `/restaurant-details/${restaurantId}`});
            }
        }
    }
</script>

<style href="boxicons.min.css">
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
