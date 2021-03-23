<template>
<div>
  <Header></Header>
  <RestaurantList :restaurants="restaurants"></RestaurantList>
  <Footer></Footer>
</div>
</template>

<script>
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import RestaurantList from "@/components/restaurant/RestaurantList";

export default {
name: "FavoriteRestaurants",
  components: {RestaurantList, Footer, Header},
  data:() => ({
    restaurants: []
  }),
  methods: {
    loadFavoriteRestaurants: async function() {
      await this.axios.get(`/favorite-restaurant/with-restaurant/logged-in`).then((response) => {
        this.restaurants = response.data.restaurants;
      })
    }
  },
  created() {
  this.loadFavoriteRestaurants();
  }
}
</script>

<style scoped>

</style>