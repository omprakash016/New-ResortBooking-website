const app = require("./src/app");
const connectDB = require("./src/DBConnect/config");

const PORT = process.env.PORT || 8000;

connectDB();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;