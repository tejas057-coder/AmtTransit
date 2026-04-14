import mongoose, { Schema, Document } from "mongoose";

export interface IStop extends Document {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const stopSchema = new Schema<IStop>(
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
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Create text index for search
stopSchema.index({ name: "text" });
stopSchema.index({ latitude: "2dsphere", longitude: "2dsphere" });

export const Stop = mongoose.model<IStop>("Stop", stopSchema);
