'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Todos', [
      { id: 1, description: 'root' },
      { id: 2, description: 'root.1', parentId: 1 },
      { id: 3, description: 'root.2', parentId: 1 },
      { id: 4, description: 'root.3', parentId: 1 },
      { id: 5, description: 'root.3.1', parentId: 4 },
      { id: 6, description: 'root.3.1.1', parentId: 5 },
      { id: 7, description: 'root.3.1.1.1', parentId: 6 },
      { id: 8, description: 'root.3.2.1', parentId: 3 },
      { id: 9, description: 'root.3.2.2', parentId: 3 },
      { id: 10, description: 'root.3.2.2.1', parentId: 9 }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Todos', null, {})
  }
}