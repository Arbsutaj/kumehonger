import jwt from "../../helpers/jwt";

export default {
    async generateToken(id) {
        const token = jwt.issue({id: id}, '1d');
        const tokenPayload = {
            type: 'Bearer',
            token: token
        };
        return {tokenPayload};
    }
}
