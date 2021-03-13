import {toBase64} from "../../helpers/utils";

async function toDto(menuEntity) {
    return {
        restaurant: menuEntity.restaurant,
        description: menuEntity.description,
        servingTime: menuEntity.servingTime,
        category: menuEntity.category,
        ingredients: menuEntity.ingredients,
        image: {data: toBase64(menuEntity.image.data), contentType: menuEntity.image.contentType}
    }
}
export default {
    async toDto(menu) {
        return await toDto(menu);
    }
}
