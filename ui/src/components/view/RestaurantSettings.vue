<template>
  <div>
    <Header></Header>
    <RestaurantOperations></RestaurantOperations>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/view/Header";
import RestaurantOperations from "@/components/restaurant/RestaurantOperations";
import Footer from "@/components/view/Footer";

export default {
  name: "RestaurantSettings",
  components: {Footer, RestaurantOperations, Header}
}
</script>

<style scoped>

</style>