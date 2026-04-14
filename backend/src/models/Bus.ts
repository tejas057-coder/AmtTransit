 import mongoose, { Schema, Document } from "mongoose";

export type BusStatus = "on-time" | "delayed" | "at-stop";

export interface IBus extends Document {
  id: string;
  number: number;
  routeId: string;
  status: BusStatus;
  nextStop: string;
  nextStopEta: number;
  latitude: number;
  longitude: number;
  speed: number;
  passengers: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const busSchema = new Schema<IBus>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    number: {
      type: Number,
      required: true,
    },
    routeId: {
      type: String,
      required: true,
      ref: "Route",
      index: true,
    },
    status: {
      type: String,
      enum: ["on-time", "delayed", "at-stop"],
      default: "on-time",
    },
    nextStop: {
      type: String,
      required: true,
    },
    nextStopEta: {
      type: Number,
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
    speed: {
      type: Number,
      required: true,
      default: 0,
    },
    passengers: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create indexes for common queries
busSchema.index({ routeId: 1, status: 1 });
busSchema.index({ latitude: "2dsphere", longitude: "2dsphere" });

export const Bus = mongoose.model<IBus>("Bus", busSchema);
