"use client";
import Layout from "../component/layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/orders").then((res) => {
      setOrders(res.data.orders);
      console.log(res.data.orders);
    });
  }, []);

  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>ID</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>
                  {new Date(order.createdAt).toLocaleString("en-AU", 
                  { timeZone: "Australia/Adelaide" }
                  )}
                </td>
                <td>
                  {order.name} {order.email} {order.city} {order.postalCode}{" "}
                  {order.country} {order.address} {order.address2}
                </td>
                <td>
                  {order.line_items.map((item, index) => (
                    <div key={index}>
                        {item.price_data.product_data.name} x {item.quantity}
                        {/* {JSON.stringify(item)} */}
                    </div>
                  ))}
                </td>
                <td className={order.paid ? "text-green-500" : "text-red-500"}>
                  {order.paid ? "Paid" : "Not Paid"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
