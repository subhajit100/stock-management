import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    quantity: Number,
    price: Number,
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", productSchema);
export default Product;
