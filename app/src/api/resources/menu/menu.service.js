function toBase64(image) {
    return {
        data: new Buffer(image.data).toString('base64'),
        contentType: image.contentType
    };
}

async function toDto(menuEntity) {
    return {
        restaurant: menuEntity.restaurant,
        description: menuEntity.description,
        servingTime: menuEntity.servingTime,
        image: toBase64(menuEntity.image)
    }
}
export default {
    async toDto(menu) {
        const menuDto = await toDto(menu);

        return menuDto;
    }
}
