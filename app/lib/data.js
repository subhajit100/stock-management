
import connectToDB from "../api/database/connectToDB";
import Product from "../api/models/Product";

export const fetchProducts = async () => {
  try {
    await connectToDB();
    // finding all products with certain search string in name
    const products = await Product.find();
    if (products) {
    //   return products.map((product) => ({
    //     ...product,
    //     _id: product._id.toString(),
    //   }));
    return products;
    }
  } catch (err) {
    console.log("err occurred while fetching products", err);
    return [];
  }
};
