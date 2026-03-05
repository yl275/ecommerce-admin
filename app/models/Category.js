import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    properties: {
      type: [
        {
          name: { type: String, required: true, trim: true },
          values: [{ type: String, trim: true }],
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

const Category = models?.Category || model("Category", CategorySchema);

export default Category;
