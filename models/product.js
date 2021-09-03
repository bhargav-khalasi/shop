const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  async save() {
    const db = getDB();
    const dbOp = db.collection('products');
    if (this._id) {
      await dbOp.updateOne({ _id: this._id }, { $set: this });
    } else {
      await dbOp.insertOne(this);
    }
  }

  static async fetchAll() {
    const db = getDB();
    return db.collection('products').find().toArray();
  }

  static async findById(prodId) {
    const db = getDB();

    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next();
  }

  static async deleteById(prodId) {
    const db = getDB();

    await db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) });
  }
}

module.exports = Product;
