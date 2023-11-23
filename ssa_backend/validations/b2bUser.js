const yup = require('yup');

const b2bUserCreateSchema = yup.object({
    company_name: yup.string().min(3).max(164).required().label("Company Name"),
    owner_name: yup.string().max(64).optional().label("Owner Name"),
    mobile: yup.string().required().matches(/^[6-9]\d{9}$/, 'Please enter valid mobile number!').label("Mobile"),
    pan: yup.array().of(yup.object({
        image_name: yup.string().required(),
        image_url: yup.string().required(),
        path: yup.string().required()
    })).optional().label("PAN"),
    aadhaar: yup.array().of(yup.object({
        image_name: yup.string().required(),
        image_url: yup.string().required(),
        path: yup.string().required()
    })).optional().label("Aadhaar"),
    gstNo: yup.array().of(yup.object({
        image_name: yup.string().required(),
        image_url: yup.string().required(),
        path: yup.string().required()
    })).optional().label("GST Number"),
    address: yup.string().min(5).max(512).required().label("Address"),
    password: yup.string().min(6, 'Password must be at least 6 characters long')
        .matches(/[a-z]/, 'Password must contain a lowercase letter')
        .matches(/[A-Z]/, 'Password must contain an uppercase letter')
        .matches(/\d/, 'Password must contain a number')
        .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
        ).required().label("Password"),
});

const verifyB2BAccountData = async (payload) => {
    try {
        const validationResult = await b2bUserCreateSchema.validate(payload, { stripUnknown: true });

        return { data: validationResult, error: null };
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return {
                data: null,
                error: {
                    key: error.path,
                    value: error?.params?.originalValue,
                    message: error.message,
                },
            };
        } else {
            throw error;
        }
    }
};

module.exports = { verifyB2BAccountData }