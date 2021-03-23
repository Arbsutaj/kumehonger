export class CreateRestaurantRequest {
    name = '';
    location = {
        coordinates: []
    };
    description = '';
    menus = [];
    logo = '';
    opensAt = '';
    closesAt = '';

    constructor() {
    }
}
