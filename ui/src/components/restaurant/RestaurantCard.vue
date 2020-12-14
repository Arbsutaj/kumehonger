<template>
    <vs-card class="ml-3 mb-4">
        <template #title>
            <h3>{{restaurant.name}}</h3>
        </template>
        <template #img>
            <img :src="restaurant.image" alt="">
        </template>
        <template #text>
            <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            </p>
        </template>
        <template #interactions>
            <vs-button danger icon>
                <box-icon name="heart"></box-icon>
            </vs-button>
            <vs-tooltip top>
                <vs-button color="primary" icon>
                    <box-icon name="bookmark"></box-icon>
                </vs-button>
                <template #tooltip>
                    Save Restaurant
                </template>
            </vs-tooltip>
            <vs-tooltip top>
                <vs-button class="btn-chat" shadow icon v-on:click="restaurantDetails(123)">
                    <box-icon name="detail"></box-icon>
                </vs-button>
                <template #tooltip>
                    View Restaurant details
                </template>
            </vs-tooltip>
        </template>
    </vs-card>
</template>

<script>
    import Restaurant from "./Restaurant";

    export default {
        name: 'MainPage',
        data: () => ({}),
        props: {
            restaurant: Restaurant
        },
        methods: {
            restaurantDetails: function (restaurantId) {
                restaurantId = 123;
                this.$router.push({path: `/restaurant-details/${restaurantId}`});
            }
        }
    }
</script>

<style>
</style>
