<template>
    <div class="d-flex flex-wrap justify-content-center">
        <RestaurantCard :restaurant="restaurant"/>
        <RestaurantCard :restaurant="restaurant"/>
        <RestaurantCard :restaurant="restaurant"/>
        <RestaurantCard :restaurant="restaurant"/>
        <RestaurantCard :restaurant="restaurant"/>
        <RestaurantCard :restaurant="restaurant"/>
        <vs-card-group>
            <vs-card v-for="card in 6" :key="card">
                <template #title>
                    <h3>Pot with a plant</h3>
                </template>
                <template #img>
                    <img src="https://picsum.photos/600/300/?image=25" alt="">
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
                    <vs-button class="btn-chat" shadow primary>
                        <box-icon name="detail"></box-icon>
                    </vs-button>
                </template>
            </vs-card>
        </vs-card-group>
    </div>
</template>

<script>
    import Restaurant from "../restaurant/Restaurant";
    import RestaurantCard from "../restaurant/RestaurantCard";

    export default {
        name: 'MainPage',
        components: {
            RestaurantCard
        },

        data: () => ({
            restaurant: Restaurant
        }),
        created() {
            this.restaurant = new Restaurant({title: 'Restaurant name', image: 'https://picsum.photos/600/300/?image=25'});
        }
    }
</script>

<style>
</style>
