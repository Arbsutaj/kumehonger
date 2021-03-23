import contactUsService from "./contact.us.service";
import {exceptionResponse, internalExceptionResponse, okResponse} from "../../helpers/utils";
import ContactUs from "./contact.us.model";

export default {
    async create(req, res) {
        try {
            const contactUsRequest = req.body;

            const {error, value} = await contactUsService.validate(contactUsRequest);
            if (error)
                return exceptionResponse(res, error);

            const contactUsCreated = await ContactUs.create(value);

            return okResponse(res, contactUsCreated);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    }
}
