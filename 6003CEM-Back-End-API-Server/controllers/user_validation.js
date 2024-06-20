const {Validator, ValidationError} = require("jsonschema");
const schema = require("../schemas/user.json");
const v = new Validator();

exports.validateUser = async(ctx, next) => {
    const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
    };

    const body = ctx.request.body;

    try {
        v.validate(body, schema, validationOptions);
        await next();
    } catch(error) {
        if(error instanceof ValidationError) {
            ctx.status = 400;
            ctx.body = error;
            return error;
        } else {
            throw error;
        }
    }
}