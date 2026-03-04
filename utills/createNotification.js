const Notification = require('../src/models/Notification');

const createNotification = async ({
  user,
  title,
  message,
  type = 'system',
  meta = {},
}) => {
  try {
    await Notification.create({
      user,
      title,
      message,
      type,
      meta,
    });
  } catch (error) {
    console.error('Notification Error:', error);
  }
};

module.exports = createNotification;