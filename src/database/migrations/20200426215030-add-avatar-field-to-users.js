'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.addColumn('users', 'avatar_id',
      {
        type: DataTypes.INTEGER,
        references: { model: 'files', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
      });

  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  }
};
