const { getDB } = require('../util/database');
const mongodb = require('mongodb');

class User {
  constructor(username, email, id, cart) {
    this.name = username;
    this.email = email;
    this._id = new mongodb.ObjectId(id);
    this.cart = cart ? cart : { items: [] };
  }

  async save() {
    const db = getDB();

    await db.collection('users').insertOne(this);
  }

  async addToCart(product) {
    const db = getDB();

    const productIndex = this.cart.items.findIndex(
      cp => cp.productId.toString() === product._id.toString()
    );

    const updatedCartItems = [...this.cart.items];

    if (productIndex >= 0) {
      ++updatedCartItems[productIndex].quantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: 1
      });
    }

    return await db
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  async getCart() {
    const db = getDB();
    const productIds = this.cart.items.map(i => i.productId);

    const products = await db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    const cartItems = this.cart.items.filter(item =>
      products.find(prod => prod._id.toString() === item.productId.toString())
    );

    await db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: { items: cartItems } } });

    return products.map(p => {
      return {
        ...p,
        quantity: cartItems.find(
          i => i.productId.toString() === p._id.toString()
        ).quantity
      };
    });
  }

  async deleteCartItem(productId) {
    const updatedCartItems = this.cart.items.filter(
      item => item.productId.toString() != productId.toString()
    );

    const db = getDB();

    return await db
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  async addOrder() {
    const db = getDB();
    const products = await this.getCart();

    const order = {
      items: products,
      user: {
        _id: this._id,
        name: this.name
      }
    };

    await db.collection('orders').insertOne(order);
    await db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
  }

  async getOrders() {
    const db = getDB();

    return await db
      .collection('orders')
      .find({ 'user._id': this._id })
      .toArray();
  }

  static async findById(userId) {
    const db = getDB();

    return await db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }
}
module.exports = User;
