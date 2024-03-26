import { fetchProducts } from "./lib/data";
import HomePage from "./pages/HomePage";

export default async function Home() {
  const products = JSON.parse(JSON.stringify(await fetchProducts()));
  return <HomePage initialProducts={products} />;
}
