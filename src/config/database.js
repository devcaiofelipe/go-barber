require('dotenv').config();

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    // configura o sequelize para criar o nome das tabelas e colunas no formato
    // caixa baixa separado por underline user_groups
    underscored: true,
    underscoredAll: true
  },
};