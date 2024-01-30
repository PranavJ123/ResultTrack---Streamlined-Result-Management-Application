module.exports = (sequelize, DataTypes) => {

    const Student = sequelize.define("student", {
        username: {
            type: DataTypes.STRING
        },
        roll_no: {
            type: DataTypes.INTEGER,
            primaryKey:true
        },
        dob:{
            type: DataTypes.STRING
        },
        score:{
            type: DataTypes.INTEGER
        }
    })

    return Student

}

