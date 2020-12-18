import jwt from "../../helpers/jwt";

export default {
    generateToken(id) {
        const token = jwt.issue({id: id}, '1d');
        const tokenPayload = {
            type: 'Bearer',
            token: token
        };
        return {tokenPayload};
    }
}
