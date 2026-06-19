import { FilterQuery, UpdateQuery } from 'mongoose';
import ShipmentModel, { IShipment } from '../models/Shipment.model';

export class ShipmentRepository {
  async findById(id: string) {
    return ShipmentModel.findById(id).populate('order');
  }

  async findOne(filter: FilterQuery<IShipment>) {
    return ShipmentModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<IShipment>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = ShipmentModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<IShipment>) {
    return ShipmentModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<IShipment>) {
    return ShipmentModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return ShipmentModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<IShipment>) {
    return ShipmentModel.countDocuments(filter);
  }
}

export const shipmentRepository = new ShipmentRepository();
