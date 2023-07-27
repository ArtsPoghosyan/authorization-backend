const db = require("../services/mysql");
const {Model, DataTypes} = require("sequelize");

class TokenModel extends Model {
    static getInfoByUserId = async (userId) => await TokenModel.findOne({where: {userId}})
    static getInfoByToken = async (userToken) => await TokenModel.findOne({where: {userToken}});
    static addToken = async (data) => await TokenModel.create(data);
    static removeToken = async (userId) => await TokenModel.destroy({where:{userId}});
}

TokenModel.init({
    userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true
    }, 
    userToken: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userIp: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "tokens",
    modelName: "tokensModel",
    sequelize: db,
    timestamps: false
});

// TokenModel.sync();

module.exports = TokenModel;