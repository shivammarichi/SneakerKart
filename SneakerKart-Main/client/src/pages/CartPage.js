import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox } from "antd";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [maintenancePlan, setMaintenancePlan] = useState({});
  const navigate = useNavigate();

  // Load cart from localStorage on login
  useEffect(() => {
    if (auth?.token) {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(savedCart);
    }
  }, [auth?.token]);

  // Clear cart on logout
  useEffect(() => {
    if (!auth?.token) {
      setCart([]);
      localStorage.removeItem("cart");
    }
  }, [auth?.token]);

  // Total price calculation
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price;
        // Check if maintenance plan is included for the current product
        if (maintenancePlan[item._id]) {
          total += 10; // Add $10 for each product with the maintenance plan
        }
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Remove item from cart
  const removeCartItem = (productId) => {
    try {
      const updatedCart = cart.filter((item) => item._id !== productId);
      const updatedMaintenancePlan = { ...maintenancePlan };
      delete updatedMaintenancePlan[productId];
      setCart(updatedCart);
      setMaintenancePlan(updatedMaintenancePlan);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Handle place order function for logged-in users
  const handlePlaceOrder = async () => {
    try {
      const totalcost = totalPrice();
      const products = cart; // Pass the cart as products
      const buyer = auth?.user?._id;
      let mplan = false; // Define mplan variable

      // Construct mplan object
      products.forEach((item) => {
        if (maintenancePlan[item._id]) {
          mplan = true;
        }
      });

      // Send a POST request to create the order
      const response = await axios.post("/api/v1/order/create-order", {
        products,
        buyer,
        totalcost,
        mplan,
      });

      // Handle success response
      console.log("Order created successfully:", response.data);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Order Placed Successfully");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order");
    }
  };

  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              {cart?.map((product) => (
                <div className="row card flex-row" key={product._id}>
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${product._id}`}
                      className="card-img-top"
                      alt={product.name}
                      width="100%"
                      height={"130px"}
                    />
                  </div>
                  <div className="col-md-4">
                    <p>{product.name}</p>
                    <p>{product.description.substring(0, 30)}</p>
                    <p>Price : {product.price}</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(product._id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="col-md-12">
                    {/* Maintenance plan checkbox */}
                    <Checkbox
                      onChange={(e) => {
                        setMaintenancePlan({
                          ...maintenancePlan,
                          [product._id]: e.target.checked,
                        });
                      }}
                    >
                      Maintenance Plan 10$- 2 years
                    </Checkbox>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {auth?.token ? (
                <button className="btn btn-primary" onClick={handlePlaceOrder}>
                  Place Order
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate("/register", {
                        state: "/cart",
                      })
                    }
                  >
                    Register and Place Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
