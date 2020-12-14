<template>
    <div id="app">
        <side-bar />
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import SideBar from "./components/side-bar/SideBar";
    export default {
        name: 'App',
        components: {
            "side-bar": SideBar
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
