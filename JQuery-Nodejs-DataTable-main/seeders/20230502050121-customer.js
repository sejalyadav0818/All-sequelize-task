"use strict";

const { faker } = require("@faker-js/faker");
const user = [...Array(1000)].map((use) => ({
  customer_firstname: faker.name.firstName(),
  customer_lastName: faker.name.firstName(),
  customer_email: faker.internet.email(),
  createdAt: new Date(),
  updatedAt: new Date(),
}));
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("customer_tables", user, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("customer_tables", null, {});
  },
};

