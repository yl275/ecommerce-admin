'use client';
import { useEffect, useState } from "react";
import Layout from "../component/layout"
import Link from "next/link";
import axios from "axios";

export default function Products() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products').then(res => {
      setProducts(res.data.products);
    });
  }, []);

  return (
    <Layout>
        <Link href="/products/add" className="bg-green-700 py-1 px-2 rounded-lg text-white">Add New Product</Link>
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Title</td>
              <td>Price</td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>
                  <Link href={'/products/edit/' + product._id} className="btn-primary">Edit</Link>
                </td>
                <td>
                  <Link href={'/products/delete/' + product._id} className="btn-primary flex w-30">          
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </Layout>);
}


