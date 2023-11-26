const { isValidObjectId } = require('mongoose');
const yup = require('yup');

const reviewSchema = yup.object({
  product: yup
    .string()
    .test('is-valid-object-id', 'Invalid ObjectId', isValidObjectId)
    .required()
    .label('Product'),
  message: yup.string().min(10).max(100).required().label('Message'),
  rating: yup
    .string()
    .min(1, 'Rating can not be less than 1.')
    .max(5, 'Rating can not be greater than 5.')
    .label('rating'),
});

const verifyReviewData = async (payload) => {
  try {
    const validationResult = await reviewSchema.validate(payload, {
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

module.exports = { verifyReviewData };
