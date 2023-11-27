const yup = require('yup');

const userUpdateSchema = yup.object({
  username: yup.string().min(3).max(164).optional().label('Name'),
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

const verifyUserUpdateData = async (payload) => {
  try {
    const validationResult = await userUpdateSchema.validate(payload, {
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

module.exports = { verifyUserUpdateData };
