import Joi from "joi";

export abstract class JoiSchema {

    static schema = Joi.object({
        cuentas: Joi.array().min(1).items(
            Joi.object({
                user: Joi.string().required(),
                pass: Joi.string().required(),
                docType: Joi.string().valid("CC", "TI", "CE").required(),
            }).required()
        ),
        horaInicial: Joi.string().required(),
    }).unknown(true);

    static validateSchema(request: any) {
        let validation = JoiSchema.schema.validate(request);
        if (validation.error) {
            return { valid: false, message: validation.error.message };
        }
        return { valid: true }
    }

}