'use client';
import Layout from "../../../component/layout";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import ProductForm from "../../../component/productForm";
import axios from "axios";

export default function EditProduct() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    useEffect(() => {
        axios.get('/api/products/' + id).then(res => {
            const product = res.data.product;
            setProduct(product);
        });
    }, [id]);

    return (
        <Layout>

            {product && (
                <ProductForm {...product} />
            )}
        </Layout>
    );
}
