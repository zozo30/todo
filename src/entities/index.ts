import { DataTypes, Sequelize } from "sequelize";

export default (sequilize: Sequelize): void => {
    const Todo = sequilize.define('Todo', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE
        },
        parentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false,
        }
    })
    Todo.hasMany(Todo, { as: 'Childrens', foreignKey: 'parentId' })
}