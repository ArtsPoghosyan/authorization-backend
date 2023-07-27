const db = require("../services/mysql");
const {Model, DataTypes} = require("sequelize");

class UserModel extends Model {

    static getUserByEmail = async (email)=>{
        return await UserModel.findOne({where: {email}});   
    }

    static createUser = async (state)=>{
        return await UserModel.create({...state}, {isNewRecord: true});   
    }

    static removeUser = async (id)=>{
        return await UserModel.destroy({where: {id}});   
    }

    static confirmUser = async (id)=>{
        return await UserModel.update({isActive: true}, {where: {id}});   
    }

    static loginSucces = async (id, state)=>{
        return await UserModel.update({auth: state}, {where: {id}});   
    }
    
    static changePassword = async(id, password)=>{
        return await UserModel.update({password}, {where: {id}});
    }

}

UserModel.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    }, 
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: DataTypes.CHAR(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    activateKey: {
        type: DataTypes.CHAR(255),
        allowNull: false
    },
    auth: {
        type: DataTypes.JSON
    }
}, {
    tableName: "users",
    modelName: "usersModel",
    sequelize: db,
    timestamps: false
});

// UserModel.sync();

module.exports = UserModel;