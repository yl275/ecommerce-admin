'use client';
import Layout from "../component/layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';



function Categories( {swal} ) {

    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [properties, setProperties] = useState([]);

    async function saveCategory(e) {
        e.preventDefault();
        const data = { 
            categoryName, 
            parentCategory: parentCategory || null,
            properties: properties.map(property => ({
                name: property.name,
                values: property.values.split(','),
            }))
        };
        if(editingCategory) {
            await axios.put('/api/categories', {...data, _id: editingCategory._id});
            setEditingCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }
        setCategoryName('');
        setProperties([]);
        fetchCategories();
    }

    function fetchCategories() {
        axios.get('/api/categories').then(res => {
            setCategories(res.data.categories);
        });
    }

    function editCategory(category) {
        setEditingCategory(category);
        setCategoryName(category.name);
        setParentCategory(category.parentCategory?._id || null);
        setProperties(
            category.properties.map(property => ({
                name: property.name,
                values: property.values.join(','),
            }))
        );
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this category?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete('/api/categories/', { data: { _id: category._id } }).then(res => {
                    fetchCategories();
                });
            }
        });
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, {name: '', values: ''}];
        });
    }

    function updatePropertyName(index, e) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = e.target.value;
            return properties;
        });
    }

    function updatePropertyValues(index, e) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = e.target.value;
            return properties;
        });
    }
    
    function deleteProperty(index) {
        setProperties(prev => {
            const properties = [...prev];
            properties.splice(index, 1);
            return properties;
        });
    }

    function cancelEditing() {
        setEditingCategory(null);
        setCategoryName('');
        setProperties([]);
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <Layout>
            <h1>Categories</h1>
            <label>
            {editingCategory 
                ? `Editing Category ${editingCategory.name}`
                : 'New Category'}
            </label>

            <form onSubmit={saveCategory} className="">
                <div className="flex gap-2">
                    <input type="text" placeholder="Category Name" value={categoryName} onChange={e => setCategoryName(e.target.value)}/>
                    <select value={parentCategory || ''} onChange={e => setParentCategory(e.target.value)}>
                        <option value="">No Parent Category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button 
                        onClick={addProperty}
                        type="button" 
                        className="btn-default text-sm mb-2">Add Property
                    </button>
                    {/* {properties.length > 0 && properties.map((property, index) => (
                        <div key={index} className="flex gap-2">

                            <input type="text" 
                            onChange={e => updatePropertyName(index, e)}
                            placeholder="Property Name (example color)" 
                            value={property.name}/>

                            <input type="text" 
                            onChange={e => updatePropertyValues(index, e)}
                            placeholder="Property Values (example red, blue, green)" 
                            value={property.values}/>

                            <button 
                                onClick={() => deleteProperty(index)}
                                type="button" 
                                className="btn-default text-sm mb-2">Delete Property
                            </button>

                        </div>
                    ))} */}
                </div>

                {editingCategory && (
                    <div>
                        {properties.length > 0 && properties.map((property, index) => (
                        <div key={index} className="flex gap-2">

                            <input type="text" 
                            onChange={e => updatePropertyName(index, e)}
                            placeholder="Property Name (example color)" 
                            value={property.name}/>

                            <input type="text" 
                            onChange={e => updatePropertyValues(index, e)}
                            placeholder="Property Values (example red, blue, green)" 
                            value={property.values}/>

                            <button 
                                onClick={() => deleteProperty(index)}
                                type="button" 
                                className="btn-default text-sm mb-2">Delete Property
                            </button>
                        </div>
                    ))}
                        <button 
                        onClick={cancelEditing} 
                        type="button" 
                        className="btn-default text-sm mb-2">Cancel</button>
                    </div>
                )}



                <button className="btn-primary mb-2.5">Save</button>
            </form>
            {!editingCategory && (
            <table className="basic">
                <thead>
                    <tr>
                        <td className="p-2">Category Name</td>
                        <td className="p-2">Parent Category</td>
                        <td ></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category._id}>
                            <td >{category.name}</td>
                            <td >{category?.parentCategory?.name}</td>
                            <td className="w-42">

                                <button onClick={() => editCategory(category)} className="btn-primary mr-2">Edit</button>
                                <button onClick={() => deleteCategory(category)} className="btn-primary">Delete</button>
                                
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}


            

        </Layout>

    );
}

export default withSwal((props, ref) => {
    const { swal, ...rest } = props;
    return <Categories swal={swal} />
});