import { Schema, model, Document } from 'mongoose';

interface IEmployee extends Document {
  name: string;
  role: string;
  email: string;
  password: string;
}

const employeeSchema = new Schema<IEmployee>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Employee = model<IEmployee>('Employee', employeeSchema);

export default Employee; 