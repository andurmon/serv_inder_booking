import Joi from "joi";

export abstract class JoiSchema {

    static schema = Joi.object({
        userList: Joi.array().min(1).items(
            Joi.object({
                user: Joi.string().required(),
                pass: Joi.string().required(),
                docType: Joi.string().valid("CC", "TI", "CE").required(),
                guests: Joi.array().items(
                    Joi.object({
                        document: Joi.string().required(),
                        docType: Joi.string().valid("CC", "TI", "CE").required(),
                    })
                ).required(),
            }).required()
        ),
        initTime: Joi.number().min(1600).max(2100).required(),
    }).unknown(true);

    static validateSchema(request: any) {
        let validation = JoiSchema.schema.validate(request);
        if (validation.error) {
            return { valid: false, message: validation.error.message };
        }
        return { valid: true }
    }

}