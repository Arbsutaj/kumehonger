import Menu from "../menu/menu.model";
import Restaurant from '../resturant/restaurant.model';
import restaurantService from '../resturant/restaurant.service';

export default {
    async create(req, res) {
        try {
            const { restaurantId } = req.body.restaurant;
            const menuCreated = await Menu.create(req.body);
            restaurantService.addMenuToRestaurant(restaurantId, menuCreated);

            return res.json(menuCreated);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err);
        }
    },
    async findOne(req, res) {
        try {
            return res.status(200).send("arbi");
        } catch (err) {
            return res.status(500).send(err);
        }
    }
}

function addMenuToRestaurant(menu, restaurantId) {

}
