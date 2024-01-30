module.exports = (sequelize, DataTypes) => {

    const AuthToken = sequelize.define("authToken", {
        
        id: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        teacherId: {
            type: DataTypes.INTEGER
        },
        token: {
            type: DataTypes.STRING
        }
    })

    return AuthToken

}