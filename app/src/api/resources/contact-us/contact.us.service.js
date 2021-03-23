import Joi from "joi";

function getSchemaValidationEntity() {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        message: Joi.string().required(),
        email: Joi.string().required(),
        subject: Joi.string().required()
    });

    return {schema};
}
export default {
    async validate(contactUsRequest) {
        const {schema} = getSchemaValidationEntity();
        const {value, error} = Joi.validate(contactUsRequest, schema);
        if (error && error.details)
            return {error};

        return {value};
    }
}
