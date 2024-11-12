import mongoose from 'mongoose';

const HangHoaSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const HangHoaModel = mongoose.model('HangHoa', HangHoaSchema);

export { HangHoaModel as hanghoa };   