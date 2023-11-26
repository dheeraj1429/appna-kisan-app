const { startSession } = require('mongoose');

/**
 * @desc     Execute a function within a database transaction using the default Mongoose connection.
 * @param    callback The function to execute within the transaction.
 * @returns  The result of the executed function.
 */
const withTransaction = async (callback) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const result = await callback(session);
    await session.commitTransaction();

    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = withTransaction;
