const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${
      process.env.MONGODB_PASSWORD
    }@slipitdb.jdws9gp.mongodb.net/${
      process.env.NODE_ENV === "development" ? "test" : "production"
    }?retryWrites=true&w=majority&appName=SlipITDB"`
  )
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.log("Database cannot be connected.", err));
