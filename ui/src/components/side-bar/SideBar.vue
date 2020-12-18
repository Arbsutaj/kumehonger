<template>
    <div>
        <vs-navbar shadow square center-collapsed v-model="active">
            <template #left>
                <vs-button @click="activeSidebar = !activeSidebar" flat icon>
                    <box-icon name="menu"></box-icon>
                </vs-button>
            </template>
            <template #right v-if="showLoginButton">
                <vs-button flat v-on:click="navigateToRoute('/login')">Login</vs-button>
            </template>
        </vs-navbar>
        <vs-sidebar
                absolute
                v-model="active"
                :open.sync="activeSidebar">
            <vs-sidebar-item v-for="sidebarItem in sideBarItems.items" :key="sidebarItem.index" :id="sidebarItem.id" :to="sidebarItem.route">
                <template #icon>
                    <box-icon :name="sidebarItem.icon"></box-icon>
                </template>
                {{sidebarItem.name}}
            </vs-sidebar-item>
            <div v-if="sideBarItems.length">
                <vs-sidebar-group v-for="sidebarGroup in sideBarItems" :key="sidebarGroup.title">
                    <template #header>
                        <vs-sidebar-item arrow>
                            <template #icon>
                                <box-icon :name="sidebarGroup.icon"></box-icon>
                            </template>
                            {{sidebarGroup.title}}
                        </vs-sidebar-item>
                    </template>
                    <vs-sidebar-item v-for="sidebarItem in sidebarGroup.items" :key="sidebarItem.index" :to="sidebarItem.route">
                        <template #icon>
                            <box-icon :name="sidebarItem.icon"></box-icon>
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

                    <vs-avatar badge-color="danger" badge-position="top-right">
                        <box-icon name="bell" type="solid"></box-icon>
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

    import {SideBar} from "./SideBarItems";
    import 'boxicons';

    export default {
        name: 'SideBar',
        data: () => ({
            notExpand: false,
            reduce: true,
            colorx: '#F2AB27',
            indexActive: 0,
            sideBarItems: [],
            active: 'home',
            activeSidebar: false,
            showLoginButton: true,
        }),
        methods: {
            navigateToRoute: function (path) {
                if (path === '/login')
                    this.showLoginButton = false;
                this.$router.push(path);
            }
        },
        created() {
            this.reduce = true;
            this.sideBarItems = SideBar;
            console.log(this.$route);
            if (this.$route.path.includes('/login')) {
                this.showLoginButton = false;
            }
        },
        mounted() {
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
