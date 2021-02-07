<template>
    <div>
        <div class="d-flex flex-wrap justify-content-center restaurants mt-2">
            <div v-for="(restaurant, i) in restaurants" :key="i">
                <RestaurantCard :restaurant="restaurant" :users-favorite-restaurants="usersFavoriteRestaurants" class="ml-2"></RestaurantCard>
            </div>
        </div>
        <div class="d-flex flex-row-reverse bd-highlight">
            <sliding-pagination
                    :current="currentPage"
                    :total="totalPages"
                    @page-change="pageChangeHandler"
            ></sliding-pagination>
        </div>
    </div>
</template>

<script>
    import SlidingPagination from 'vue-sliding-pagination';
    import RestaurantCard from "../restaurant/RestaurantCard";

    export default {
        name: 'MainPage',
        components: {
            RestaurantCard,
            SlidingPagination
        },
        data: () => ({
            restaurants: [],
            currentPage: 1,
            totalPages: 3,
            pageLimit: 6,
            usersFavoriteRestaurants: []
        }),
        methods: {
            getRestaurants: async function (page) {
                const params = new URLSearchParams([['page', page], ['limit', this.pageLimit]]);
                await this.axios.get('/restaurant/paginated', {params}).then(res => {
                    this.restaurants = res.data.restaurants;
                    this.totalPages = res.data.pages;
                    this.currentPage = res.data.page;
                });
            },
            getUsersFavoriteRestaurant: async function() {
                this.$store.dispatch('getUsersFavoriteRestaurants').then(() => {
                    this.usersFavoriteRestaurants = this.$store.getters.getUsersFavoriteRestaurants;
                });
            },
            pageChangeHandler: async function (selectedPage) {
                await this.getRestaurants(selectedPage);
            }
        },
        async created() {
            await this.getRestaurants(this.currentPage);
            await this.getUsersFavoriteRestaurant();
        }
    }
</script>

<style>
    @import "~vue-sliding-pagination/dist/style/vue-sliding-pagination.css";

    @media {
        .restaurants {
            min-height: 680px;
        }
    }
</style>
