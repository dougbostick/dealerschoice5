const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres://localhost/dougs_tacos_db");

//model creation
const TacoMenu = sequelize.define("taco_menu", {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

// const DrinkMenu = sequelize.define("drink_menu", {
//   name: {
//     type: Sequelize.STRING,
//     unique: true,
//     allowNull: false,
//   },
//   price: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },
// });

const Customers = sequelize.define("customers", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  member: {
    type: Sequelize.BOOLEAN,
  },
});

const OrderHistory = sequelize.define("order_history", {});

Customers.belongsToMany(TacoMenu, { through: OrderHistory });
TacoMenu.belongsToMany(Customers, { through: OrderHistory });
// DrinkMenu.belongsToMany(Customers, { through: OrderHistory });
// Customers.belongsToMany(DrinkMenu, { through: OrderHistory });

// OrderHistory.belongsTo(Customers);
// OrderHistory.belongsTo(DrinkMenu);
// OrderHistory.belongsTo(TacoMenu);
// Customers.hasMany(OrderHistory);
// DrinkMenu.hasMany(OrderHistory);
// TacoMenu.hasMany(OrderHistory);

//express routes

const express = require("express");
const app = express();
const path = require("path");

app.use(express.static("src"));

app.get("/", async (req, res, next) => {
  try {
    //const tacos = await TacoMenu.findAll();
    res.sendFile(path.join(__dirname + "/index.html"));
  } catch (ex) {
    next(ex);
  }
});

app.get("/tacomenu", async (req, res, next) => {
  try {
    res.send(await TacoMenu.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.get("/customers", async (req, res, next) => {
  try {
    res.send(await Customers.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.delete("/tacomenu/:id", async (req, res, next) => {
  try {
    const target = await TacoMenu.findByPk(req.params.id);
    await target.destroy();
    res.send(204);
  } catch (ex) {
    next(ex);
  }
});

// app.get("/orderHistory/:id", async (req, res, next) => {
//   try {
//     res.send(
//       await OrderHistory.findAll({
//         where: (customerId = req.params.id),
//       })
//     );
//   } catch (ex) {
//     next(ex);
//   }
// });
//sync and seed
const start = async () => {
  await sequelize.sync({ force: true });
  //tacos
  const alPastor = await TacoMenu.create({ name: "Al Pastor", price: 5 });
  const chicken = await TacoMenu.create({ name: "Chicken", price: 4 });
  const steak = await TacoMenu.create({ name: "Steak", price: 6 });
  const shrimp = await TacoMenu.create({ name: "Shrimp", price: 5 });

  //drinks
  // const beer = await DrinkMenu.create({ name: "Beer", price: 6 });
  // const margarita = await DrinkMenu.create({ name: "Margarita", price: 9 });
  // const soda = await DrinkMenu.create({ name: "Soda", price: 3 });
  // const bottleWater = await DrinkMenu.create({
  //   name: "Bottled Water",
  //   price: 2,
  // });

  //customers
  const cristina = await Customers.create({ name: "Cristina", member: true });
  const jared = await Customers.create({ name: "Jared", member: true });
  const issac = await Customers.create({ name: "Issac", member: false });
  const phil = await Customers.create({ name: "Phil", member: false });
  console.log("syncd and seeded");

  //order history
  await OrderHistory.create({ customerId: 1, tacoMenuId: 1 });
  await OrderHistory.create({ customerId: 1, tacoMenuId: 3 });
  //await OrderHistory.create({ customerId: 1, tacoMenuId: 1 });

  //app.listen
  const port = 5678;
  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};

start();
