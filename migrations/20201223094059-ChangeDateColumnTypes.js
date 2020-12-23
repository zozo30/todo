'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.changeColumn('Todos', 'createdAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    })
  },

  down: async (queryInterface, Sequelize) => {

  }
};
