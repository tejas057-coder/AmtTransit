import mongoose, { Schema, Document } from "mongoose";

export interface IRoute extends Document {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: string;
  frequency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const routeSchema = new Schema<IRoute>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    distance: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create text index for search
routeSchema.index({ name: "text", from: "text", to: "text" });

export const Route = mongoose.model<IRoute>("Route", routeSchema);
