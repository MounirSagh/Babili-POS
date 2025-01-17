import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  type: string;
  title: string;
  message: string;
  filePath?: string;
  date: Date;
  read: boolean;
}

const NotificationSchema: Schema = new Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  filePath: { type: String },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
