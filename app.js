const path = require('path');
const express = require('express');

const errorControllers = require('./controllers/error');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  const user = await User.findById('612b7c14f2c5cee3aa8793c1');
  req.user = new User(user.name, user.email, user._id, user.cart);
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorControllers.pageNotFound);

mongoConnect()
  .then(client => {
    app.listen(3000);
    console.log('Connected to MongoDB');
  })
  .catch(err => console.log(err));
