<template>
    <div>
        <div id="map">
            <!--In the following div the HERE Map will render-->
            <div id="mapContainer" style="height:200px;width:100%" ref="hereMap"></div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "HereMap",
        props: {
            center: {},
            throwEvent: {},
            markerList: {
                type: Array,
                default: () => []
            },
            mapReference: {},
        },
        data: () => ({
            H: {},
            ui: {},
            map: {},
            platform: {},
            apiKey: 'Octo7c-6Tt2vu2bsRNu7pn7lRWs1cusDx97_HojgdY4',
        }),
        async mounted() {
            this.platform = new window.H.service.Platform({
                apiKey: this.apiKey,
            });
            this.H = window.H;
            this.initializeHereMap();
        },
        methods: {
            initializeHereMap: function () { // rendering map
                const hereMap = this.$refs.hereMap;
                // Obtain the default map types from the platform object
                var maptypes = this.platform.createDefaultLayers();
                console.log('test', this.center);
                this.map = new this.H.Map(hereMap, maptypes.vector.normal.map, {
                    zoom: 10,
                    center: this.center
                });
                // Instantiate (and display) a map object:

                window.addEventListener("resize", () => this.map.getViewPort().resize());
                new this.H.mapevents.Behavior(new this.H.mapevents.MapEvents(this.map));
                this.ui = this.H.ui.UI.createDefault(this.map, maptypes);
                const _this = this;

                this.markerList.forEach(marker => this.addMarker(marker));
                this.map.addEventListener('tap', function (event) {
                    const coordinatesInMap = _this.map.screenToGeo(event.currentPointer.viewportX, event.currentPointer.viewportY);
                    const latitude = Math.abs(coordinatesInMap.lat);
                    const longitude = Math.abs(coordinatesInMap.lng);
                    if (_this.throwEvent) {
                        _this.$emit('addRestaurantLocation', {latitude: latitude, longitude: longitude});
                    }
                });
            },
            addMarker: function (marker) {
                const mapMarker = new this.H.map.Marker({lat: marker.latitude, lng: marker.longitude});
                this.map.addObject(mapMarker);
            }
        },
        watch: {
            markerList: function () {
                this.map.removeObjects(this.map.getObjects());
                console.log(this.markerList);
                this.markerList.forEach(marker => this.addMarker(marker));
            }
        }
    };
</script>

<style scoped>
    #map {
        max-width: 360px;
        min-width: 300px;
        min-height: 200px;
        text-align: center;
        margin: 5% auto;
        background-color: #ccc;
    }
</style>
