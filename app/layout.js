import { Inter } from "next/font/google";
import "./globals.css";
// import SessionWrapper from "./components/SessionWrapper";
// import { getServerSession } from "next-auth";
import AlertWrapper from "./components/AlertWrapper";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Stock Manager",
  description:
    "This manages the stocks by you and also provides the functionality of adding new products, updating and deleting, as well as searching the products by their name",
};

export default function RootLayout({ children }) {
  //   const session = await getServerSession();

  return (
    <html lang="en">
      {/* <SessionWrapper> */}

      <body className={inter.className}>
        <AlertWrapper>
          {/* {session && session.user && <Navbar />} */}
          {children}
        </AlertWrapper>
      </body>

      {/* </SessionWrapper> */}
    </html>
  );
}
