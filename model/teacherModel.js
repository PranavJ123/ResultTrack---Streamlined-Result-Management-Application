module.exports = (sequelize, DataTypes) => {

    const Teacher = sequelize.define("teacher", {
        
        id: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    })

    return Teacher

}