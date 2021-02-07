import {toBase64} from "../../helpers/utils";

async function toDto(menuEntity) {
    return {
        restaurant: menuEntity.restaurant,
        description: menuEntity.description,
        servingTime: menuEntity.servingTime,
        image: {data: toBase64(menuEntity.image.data), contentType: menuEntity.image.contentType}
    }
}
export default {
    async toDto(menu) {
        const menuDto = await toDto(menu);

        return menuDto;
    }
}
