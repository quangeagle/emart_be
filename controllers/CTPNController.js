import { User } from '../models/User.js';

// Hàm xử lý webhook sự kiện thành công
const handleWebhookEvent = async (req, res) => {
  try {
    const { userID, signature } = req.body;
    if (!userID || !signature) {
      return res.status(400).json({ message: 'Missing required fields: userID or signature' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { signature },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ 
      message: 'Signature saved successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export { handleWebhookEvent };
