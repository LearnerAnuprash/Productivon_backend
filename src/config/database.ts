import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false,
  },
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Postgresql connected via Sequelize");
    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to Database.", error);
    process.exit(1);
  }
};

export default sequelize;
