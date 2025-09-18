'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "./Spinner";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
    _id,
    title:currentTitle, 
    description:currentDescription, 
    price:currentPrice,
    images:currentImages,
    category:currentCategory,
    productProperties:currentProductProperties
  }) {

    const router = useRouter();

    const [title, setTitle] = useState(currentTitle);
    const [description, setDescription] = useState(currentDescription);
    const [price, setPrice] = useState(currentPrice);
    const [images, setImages] = useState(currentImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(currentCategory);
    const [productProperties, setProductProperties] = useState(currentProductProperties || {});

    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = { title, description, price, images, category, productProperties };
      if(_id) {
        // update
        await axios.put('/api/products/' + _id, {...data, _id});
      } else {
        await axios.post('/api/products', data);
      }
      setGoToProducts(true);
    }
  
    const uploadImages = async (e) => {
      setIsUploading(true);
      const images = e.target.files;
      if (images.length > 0) {
        const data = new FormData();
        for(const image of images) {
          data.append('image', image);
        }
        const response = await axios.post('/api/upload', data);
        // response.data --> links : link[]
        setImages((prevImages) => [...prevImages, ...response.data]);
      }
      setIsUploading(false);
    }
    

    useEffect(() => {
      if(goToProducts) {
        router.push('/products');
      }
    }, [goToProducts]);
    

    useEffect( () => {
      axios.get('/api/categories').then(res => {
        setCategories(res.data.categories || []);
      });
      
    }, []);

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
      let catInfo = categories.find(({_id}) => _id === category);
      propertiesToFill.push(...catInfo.properties);
      while (catInfo.parentCategory?._id) {
        const parentCat = categories.find(({_id}) => _id === catInfo.parentCategory?._id);
        propertiesToFill.push(...parentCat.properties);
        catInfo = parentCat;
      }
    }
    console.log(propertiesToFill);

    return (
        <form onSubmit={handleSubmit}>
            <h1>New Product</h1>
            <br/>
            <label>Product Name</label>
            <input type="text" placeholder="Product Name" 
            value={title} onChange={e => setTitle(e.target.value)}/>

            <label>Product Category</label>
            <select value={category || ""} onChange={e => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>

            {propertiesToFill.length > 0 && (
              <div>
                {propertiesToFill.map(property => (
                  <div key={property.name} className="flex gap-2">
                      <div>{property.name}</div>
                      <select value={productProperties[property.name] || ''} onChange={e => setProductProperties(prev => ({...prev, [property.name]: e.target.value}))}>
                            <option value="">Select {property.name}</option>
                          {property.values.map(value => (
                            <option key={value} value={value}>{value}</option>
                          ))}
                      </select>
                  </div>))}
              </div>
            )}

            <label>Product Image</label>
            <div className="mb-2 flex flex-wrap gap-2">
              <ReactSortable 
              list={images} 
              setList={setImages}
              className="flex flex-wrap gap-2"
              >
              {images?.length && images.map(link => (
                <div key={link} className="overflow-hidden rounded-lg w-24 h-24">
                  <img src={link} alt="" className="rounded-lg"/>
                </div>
              ))}
              </ReactSortable>
              {isUploading && (<Spinner />)}
              <label className="w-24 h-24 cursor-pointer text-center items-center 
              justify-center rounded-lg border-2 flex flex-col bg-blue-300 hover:bg-blue-400
              ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                </svg>
                Upload Image
                <input type="file" multiple onChange={uploadImages} className="hidden"/>
              </label>
            </div>


            <label>Product Description</label>
            <textarea placeholder="Product Description" 
            value={description} onChange={e => setDescription(e.target.value)}/>

            <label>Product Price (in USD)</label>
            <input type="number" placeholder="Product Price" 
            value={price} onChange={e => setPrice(e.target.value)}/>

            <button type="submit" className="btn-primary">Save</button>
        </form>
    );
}