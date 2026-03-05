"use client";
import Layout from "../component/layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function saveCategory(e) {
    e.preventDefault();
    if (!categoryName.trim()) {
      await swal.fire({
        title: "Missing name",
        text: "Please enter a category name.",
        icon: "info",
      });
      return;
    }

    const data = {
      categoryName: categoryName.trim(),
      parentCategory: parentCategory || null,
      properties: properties.map((property) => ({
        name: (property.name || "").trim(),
        values: (property.values || "")
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
      })),
    };

    // Remove empty property rows
    data.properties = data.properties.filter((p) => p.name);

    if (editingCategory) {
      await axios.put("/api/categories", { ...data, _id: editingCategory._id });
      setEditingCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }

    setCategoryName("");
    setParentCategory(null);
    setProperties([]);
    await fetchCategories();
    await swal.fire({
      title: "Saved",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });
  }

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data.categories || []);
    } finally {
      setIsLoading(false);
    }
  }

  function editCategory(category) {
    setEditingCategory(category);
    setCategoryName(category.name);
    setParentCategory(category.parentCategory?._id || null);
    setProperties(
      (category.properties || []).map((property) => ({
        name: property.name,
        values: (property.values || []).join(","),
      })),
    );
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: "You want to delete this category?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d33",
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete("/api/categories", { data: { _id: category._id } })
            .then(async () => {
              await fetchCategories();
              await swal.fire({
                title: "Deleted",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
              });
            })
            .catch(async (error) => {
              await swal.fire({
                title: "Delete failed",
                text: error?.response?.data?.message || "Unknown error",
                icon: "error",
              });
            });
        }
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function updatePropertyName(index, e) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = e.target.value;
      return properties;
    });
  }

  function updatePropertyValues(index, e) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = e.target.value;
      return properties;
    });
  }

  function deleteProperty(index) {
    setProperties((prev) => {
      const properties = [...prev];
      properties.splice(index, 1);
      return properties;
    });
  }

  function cancelEditing() {
    setEditingCategory(null);
    setCategoryName("");
    setParentCategory(null);
    setProperties([]);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoriesForParentSelect = editingCategory
    ? categories.filter((c) => c._id !== editingCategory._id)
    : categories;

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editingCategory
          ? `Editing Category ${editingCategory.name}`
          : "New Category"}
      </label>

      <form onSubmit={saveCategory} className="">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <select
            value={parentCategory || ""}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">No Parent Category</option>
            {categoriesForParentSelect.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Add Property
          </button>
        </div>

        {/* {editingCategory && ( */}
        <div>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  onChange={(e) => updatePropertyName(index, e)}
                  placeholder="Property Name (example color)"
                  value={property.name}
                />

                <input
                  type="text"
                  onChange={(e) => updatePropertyValues(index, e)}
                  placeholder="Property Values (example red, blue, green)"
                  value={property.values}
                />

                <button
                  onClick={() => deleteProperty(index)}
                  type="button"
                  className="btn-default text-sm mb-2"
                >
                  Delete Property
                </button>
              </div>
            ))}
          {editingCategory && (
            <button
              onClick={cancelEditing}
              type="button"
              className="btn-default text-sm mb-2"
            >
              Cancel
            </button>
          )}
        </div>
        {/* )} */}

        <button className="btn-primary mb-2.5">Save</button>
      </form>
      {!editingCategory && (
        <table className="basic">
          <thead>
            <tr>
              <td className="p-2">Category Name</td>
              <td className="p-2">Parent Category</td>
              <td className="p-2">Properties</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="p-4 text-gray-600">
                  Loading...
                </td>
              </tr>
            )}
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parentCategory?.name}</td>
                <td className="text-gray-700">
                  {(category.properties || []).length > 0
                    ? (category.properties || [])
                        .map((p) => p?.name)
                        .filter(Boolean)
                        .join(", ")
                    : "-"}
                </td>
                <td className="w-42">
                  <div className="flex gap-2">
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-default mr-2 flex"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red flex"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
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
  return <Categories swal={swal} />;
});
