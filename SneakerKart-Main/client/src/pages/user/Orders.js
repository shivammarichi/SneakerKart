import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const { data } = await axios.get("/api/v1/auth/orders");
        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title={"Your Orders"}>
      <div className="container-flui p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders?.map((order, index) => (
              <div key={index} className="border shadow mb-3">
                <div className="p-3">
                  <p>
                    <strong>Quantity:</strong> {order.products?.length}
                  </p>
                  <p>
                    <strong>Total Cost:</strong> {order.totalcost}
                  </p>
                  <p>
                    <strong>Payment:</strong> {order.paymentstatus}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Maintenance Plan:</strong>{" "}
                    {order.mplan ? "Yes, included" : "Not included"}
                  </p>
                </div>
                <div className="container">
                  <h4>Products</h4>
                  {order.products?.map((product, i) => (
                    <div className="row mb-2 p-3 card flex-row" key={i}>
                      <div className="col-md-4">
                        <img
                          src={`/api/v1/product/product-photo/${product._id}`}
                          className="card-img-top"
                          alt={product.name}
                          width="100px"
                          height="100px"
                        />
                      </div>
                      <div className="col-md-8">
                        <p>{product.name}</p>
                        <p>{product.description.substring(0, 30)}</p>
                        <p>Price: {product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
