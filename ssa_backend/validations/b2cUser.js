const yup = require('yup');

const b2cUserCreateSchema = yup.object({
  name: yup.string().min(3).max(164).required().label('Name'),
  email: yup
    .string()
    .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Please enter valid email')
    .required()
    .label('E-mail'),
  mobile: yup
    .string()
    .required()
    .matches(/^[6-9]\d{9}$/, 'Please enter valid mobile number!')
    .label('Mobile'),
  address: yup.string().max(512).optional().label('Address'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/\d/, 'Password must contain a number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
    )
    .required()
    .label('Password'),
});

const verifyB2CAccountData = async (payload) => {
  try {
    const validationResult = await b2cUserCreateSchema.validate(payload, {
      stripUnknown: true,
    });

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

const b2cUserUpdateSchema = yup.object({
  name: yup.string().min(3).max(164).optional().label('Name'),
  profile: yup
    .object({
      image_name: yup.string().required(),
      image_url: yup.string().required(),
      path: yup.string().required(),
    })
    .default(undefined)
    .optional()
    .label('Profile Avatar'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/\d/, 'Password must contain a number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
    )
    .notRequired()
    .label('Password'),
});

const verifyB2CAUpdateData = async (payload) => {
  try {
    const validationResult = await b2cUserUpdateSchema.validate(payload, {
      stripUnknown: true,
    });

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

module.exports = { verifyB2CAccountData, verifyB2CAUpdateData };
