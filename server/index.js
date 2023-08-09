const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes); //...

//database connect using promises
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connected successfully!!');
  })
  .catch((err) => {
    console.log(err.message);
  });

//db connect using async await

// mongoose.set('strictQuery', false);

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewURLParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connected `);
//   } catch (error) {
//     console.log(`Error : ${error.message}`);
//     process.exit();
//   }
// };

// connectDB();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
