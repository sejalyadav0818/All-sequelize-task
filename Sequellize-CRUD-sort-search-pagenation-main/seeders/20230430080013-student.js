'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
     await queryInterface.bulkInsert('students', [{
        name: 'riya twjwani',
       email : "riyatwjwani122@gmail.com",
       createdAt: new Date(),
       updatedAt : new Date()
      }], {});
   
  },

  async down (queryInterface, Sequelize) {
  
      await queryInterface.bulkDelete('students', null, {});
     
  }
};
