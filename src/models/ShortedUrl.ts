import { customAlphabet } from "nanoid";
import z from "zod";
import client from "@/lib/mongodb";
import { DateTime } from "luxon";


// This id garante:
// 9B years or 8B IDs needed, in order to have a 1% probability of at least one collision.
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 12)

export const ShortedUrlSchema = z.object({
  id: z.string().optional(),
  originalUrl: z.url(),
  createdAt: z.date().optional(),
  expiredAt: z.date().optional(),
});

export type ShortedUrl = z.infer<typeof ShortedUrlSchema>;

export class ShortedUrlEntity {

  private static collectionName = "shorted_urls";

  id?: string;
  originalUrl?: string;
  createdAt?: Date;
  expiredAt?: Date;
  
  constructor(data?: ShortedUrl) {
    if(data) {
      const _data = ShortedUrlSchema.parse(data); 
      this.id = _data.id || nanoid();
      this.originalUrl = _data.originalUrl; 
      this.createdAt = DateTime.now().toJSDate();
      this.expiredAt = DateTime.now().plus({day: 7}).toJSDate();
    }
  }

  static async getCollection() {
    const db = (await client).db();
    return db.collection(ShortedUrlEntity.collectionName);
  }

  async save() {
    const collection = await ShortedUrlEntity.getCollection();
    const result = await collection.insertOne(this);
    return result;
  }

  static async findById(id: string) {
    const collection = await ShortedUrlEntity.getCollection();
    const doc = await collection.findOne<ShortedUrl>({ id });

    if (!doc) {
      return null;
    }

    if (doc.expiredAt && DateTime.fromJSDate(doc.expiredAt) < DateTime.now()) {
      return null;
    }

    return new ShortedUrlEntity(doc);
  }
}


