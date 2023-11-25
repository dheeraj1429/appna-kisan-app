const yup = require('yup');

const b2bUserCreateSchema = yup.object({
  company_name: yup.string().min(3).max(164).required().label('Company Name'),
  owner_name: yup.string().max(64).optional().label('Owner Name'),
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
  aadhaar: yup
    .object({
      number: yup
        .string()
        .matches(
          /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/,
          'Please enter valid Aadhaar number'
        )
        .optional(),
      images: yup
        .array()
        .of(
          yup.object({
            image_name: yup.string().required(),
            image_url: yup.string().required(),
            path: yup.string().required(),
          })
        )
        .optional()
        .label('Image'),
    })
    .optional()
    .label('Aadhaar'),
  pan: yup
    .object({
      number: yup
        .string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter valid PAN number')
        .optional(),
      images: yup
        .array()
        .of(
          yup.object({
            image_name: yup.string().required(),
            image_url: yup.string().required(),
            path: yup.string().required(),
          })
        )
        .optional()
        .label('Image'),
    })
    .optional()
    .label('PAN'),
  gstNo: yup
    .object({
      number: yup
        .string()
        .matches(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
          'Please enter valid GST number'
        )
        .optional(),
      images: yup
        .array()
        .of(
          yup.object({
            image_name: yup.string().required(),
            image_url: yup.string().required(),
            path: yup.string().required(),
          })
        )
        .optional()
        .label('Image'),
    })
    .optional()
    .label('PAN'),
  address: yup.string().min(5).max(512).required().label('Address'),
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

const verifyB2BAccountData = async (payload) => {
  try {
    const validationResult = await b2bUserCreateSchema.validate(payload, {
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

const b2bUserUpdateSchema = yup.object({
  owner_name: yup.string().min(3).max(164).optional().label('Name'),
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

const verifyB2BAUpdateData = async (payload) => {
  try {
    const validationResult = await b2bUserUpdateSchema.validate(payload, {
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

module.exports = { verifyB2BAccountData, verifyB2BAUpdateData };
