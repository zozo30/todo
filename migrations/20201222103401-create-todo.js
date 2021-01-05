'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Todos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      parentId: {
        type: Sequelize.INTEGER,
        autoIncrement: false,
        references: {
          model: 'Todos',
          key: 'id'
        }
      }
    }) 
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Todos')
  }
}