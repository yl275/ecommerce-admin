'use client';
import axios from "axios";
import Layout from "../../../component/layout";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DeleteProduct() {
    const {id} = useParams();
    const router = useRouter();
    const [productInfo, setProductInfo] = useState(null);
    function goBack() {
        router.push('/products');
    }

    function deleteProduct() {
        axios.delete('/api/products/' + id).then(res => {
            goBack();
        });
    }

    useEffect(() => {
        if (id) {
            axios.get('/api/products/' + id).then(res => {
                setProductInfo(res.data.product);
            });
        }
    }, [id]);

    return (
        <Layout>
            <h1 className="text-center">Do you really want to delete <b>{productInfo?.title} ?</b></h1>
            
            <div className="flex justify-center">
                <button onClick={deleteProduct} className="btn-warning">Yes</button>
                <button onClick={goBack} className="btn-primary">No</button>
            </div>

        </Layout>
    );
}