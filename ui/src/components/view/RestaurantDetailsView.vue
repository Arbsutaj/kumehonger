<template>
  <div>
    <Header></Header>
    <RestaurantDetails></RestaurantDetails>
    <Footer></Footer>
  </div>

</template>

<script>
import Header from "@/components/view/Header";
import RestaurantDetails from "@/components/restaurant/RestaurantDetails";
import Footer from "@/components/view/Footer";
export default {
  name: "RestaurantDetailsView",
  components: {Footer, RestaurantDetails, Header}
}
</script>

<style scoped>



</style>