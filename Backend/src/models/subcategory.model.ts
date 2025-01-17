import mongoose, { Schema, Document } from 'mongoose';

interface ISubCategory extends Document {
  name: string;
  categoryID: string;
  image: string;
  tableImage: string; // New field for the table image path or URL

}

const SubCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    categoryID: { type: String, required: true },
    image: { type: String, required: true },
    tableImage: { type: String, required: false }, // Optional field for table image

  },
  { collection: 'SubCategory' }
);

const SubCategory = mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);
export default SubCategory;
