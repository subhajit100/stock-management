import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    name: String,
    quantity: Number,
    price: Number,
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", productSchema);
export default Product;
