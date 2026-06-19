import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITrackingEntry {
  status: string;
  statusDetail: string;
  date: Date;
  location?: string;
}

export interface IShipment extends Document {
  order: mongoose.Types.ObjectId;
  shiprocketOrderId: number;
  shipmentId: number;
  awbCode?: string;
  courierCompanyId?: number;
  courierName?: string;
  trackingUrl?: string;
  status:
    | 'created'
    | 'assigned'
    | 'picked_up'
    | 'in_transit'
    | 'out_for_delivery'
    | 'delivered'
    | 'returned'
    | 'cancelled';
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  pickupLocation: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  deliveryLocation: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  dimensions: {
    length: number;
    breadth: number;
    height: number;
    weight: number;
  };
  shippingCharges: number;
  codCharges: number;
  trackingHistory: ITrackingEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const shipmentSchema = new Schema<IShipment>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    shiprocketOrderId: { type: Number, required: true },
    shipmentId: { type: Number, required: true },
    awbCode: { type: String },
    courierCompanyId: { type: Number },
    courierName: { type: String },
    trackingUrl: { type: String },
    status: {
      type: String,
      enum: [
        'created',
        'assigned',
        'picked_up',
        'in_transit',
        'out_for_delivery',
        'delivered',
        'returned',
        'cancelled',
      ],
      default: 'created',
    },
    estimatedDelivery: { type: Date },
    actualDelivery: { type: Date },
    pickupLocation: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    deliveryLocation: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    dimensions: {
      length: { type: Number, required: true },
      breadth: { type: Number, required: true },
      height: { type: Number, required: true },
      weight: { type: Number, required: true },
    },
    shippingCharges: { type: Number, required: true },
    codCharges: { type: Number, default: 0 },
    trackingHistory: {
      type: [
        {
          status: { type: String },
          statusDetail: { type: String },
          date: { type: Date },
          location: { type: String },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

shipmentSchema.index({ order: 1 });
shipmentSchema.index({ awbCode: 1 });
shipmentSchema.index({ status: 1 });

const ShipmentModel: Model<IShipment> = mongoose.model<IShipment>('Shipment', shipmentSchema);
export default ShipmentModel;
