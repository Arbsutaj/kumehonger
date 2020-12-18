<template>
    <div>
        <b-card
                title="test"
                img-alt="Restaurant's logo"
                img-top
                tag="article"
                style="max-width: 20rem;"
                class="mt-2"
                border-variant="secondary">
            <b-card-text>
                Details
            </b-card-text>
            <template v-slot:footer>
                <vs-row vs-justify="flex-end">
                    <!--                    <vs-button type="gradient" color="danger" icon="favorite"></vs-button>-->
                    <vs-button
                            color="rgb(59,222,200)"
                            gradient
                    >
                        RGB
                    </vs-button>
                </vs-row>
            </template>
        </b-card>
    </div>
</template>

<script>
    export default {
        name: 'RestaurantDetails',
        data: () => ({}),
        created() {
            console.log(this.$router.params);
        }
    }
</script>

<style>
</style>
