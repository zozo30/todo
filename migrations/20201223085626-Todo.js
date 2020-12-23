'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Todos', 'parentId', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: 'Todos',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Todos', 'parentId', {})
  }
}