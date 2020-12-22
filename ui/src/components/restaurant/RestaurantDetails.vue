<template>

    <div>
        <b-tabs content-class="mt-3" justified class="restaurant-details">
            <b-tab title="Details" active>
                <b-card>
                    <div class="d-flex flex-wrap justify-content-center" v-if="restaurant.logo">
                        <b-card
                                :title="restaurant.name"
                                img-alt="Restaurant's logo"
                                :img-src="'data:image/jpeg;base64,'+restaurant.logo"
                                img-top
                                tag="article"
                                style="max-width: 20rem;"
                                class="mt-2">
                            <b-card-text>
                                {{restaurant.description}}
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
                                </vs-row>
                            </template>
                        </b-card>
                    </div>
                </b-card>
            </b-tab>
            <b-tab title="Menus" v-on:click="loadRestaurantMenus()" lazy>
                <div  class="d-flex flex-wrap justify-content-center">
                    <vs-card type="5" class="mt-3 ml-2" v-for="(menu, i) in restaurantMenus" :key="i">
                        <template #img>
                            <img :src="'data:image/jpeg;base64,'+menu.image.data" alt="Menu image">
                        </template>
                        <template #text>
                            <p>
                                {{menu.description}}
                            </p>
                        </template>
                        <template #interactions>
                            <vs-button danger icon>
                                <i class='bx bx-heart'></i>
                                <box-icon name="heart"></box-icon>
                            </vs-button>
                            <vs-button class="btn-chat" shadow primary>
                                <box-icon name="chat"></box-icon>

                                <span class="span">
                                  54
                                </span>
                            </vs-button>
                        </template>
                    </vs-card>
                </div>
            </b-tab>
            <b-tab title="Rating"><p>I'm the tab with the very, very long title</p></b-tab>
        </b-tabs>
    </div>
</template>

<script>
    export default {
        name: 'RestaurantDetails',
        data: () => ({
            restaurant: {},
            usersFavoriteRestaurants: [],
            restaurantMenus: []
        }),
        methods: {
            getRestaurantDetails: async function (restaurantId) {
                await this.axios.get(`/restaurant/by-id/${restaurantId}`).then(res => {
                    this.restaurant = res.data;
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
            }
        },
        async created() {
            const id = this.$route.params.id;
            await this.getRestaurantDetails(id);
            await this.getUsersFavoriteRestaurant();
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
    }

    .vs-card {
        display: inline-block;
    }
</style>
