import {Schema, model, models} from "mongoose";

const CategorySchema = new Schema({
    name: {type: String, required: true},
    parentCategory: {type: Schema.Types.ObjectId, ref: "Category", default: null},
    properties: [{type: Object, default: []}],
});

const Category = models?.Category || model("Category", CategorySchema);

export default Category;