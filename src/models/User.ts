import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class User extends Model {
  declare public id: number;
  declare public name: string | null;
  declare public email: string;
  declare public password: string;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  },
);

export default User;
