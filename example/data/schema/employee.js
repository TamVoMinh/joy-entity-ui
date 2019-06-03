// http://docs.sequelizejs.com/en/latest/docs/models-definition/
const Sequelize = require('sequelize');
const generate = require('nanoid/generate');

module.exports = orm => {
  return orm.define(
    'Employee',
    {
      id: {
        type: Sequelize.CHAR(7),
        defaultValue: () => generate('1234567890abcdef', 9),
        primaryKey: true
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      salary: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      joinDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      leaveDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      payroll: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    }
  );
};
