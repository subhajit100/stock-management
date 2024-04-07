import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username already present"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already present"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      validate: {
        validator: function (password) {
          // Password must be at least 8 characters long
          // Must contain at least one uppercase letter, one lowercase letter, and one special character
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
          return regex.test(password);
        },
        message: (props) => `${props.value} is not a valid password!`,
      },
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
