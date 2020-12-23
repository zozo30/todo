'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Todos', [
      { id: 1, description: 'Implement Childrens in Todos collection' },
      { id: 2, description: 'create migration for addColumn parentId', parentId: 1 },
      { id: 3, description: 'test seeds in sql query', parentId: 1 },
      { id: 4, description: 'create query in typescript lookup for childrens', parentId: 1 },
      { id: 5, description: 'investigate N:N level query', parentId: 4 }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Todos', null, {})
  }
}