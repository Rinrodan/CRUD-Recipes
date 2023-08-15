const bcrypt = require('bcryptjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    { first_name: 'Jim',
      last_name: 'Johnson',
      email: 'jim.johnson@gmail.com',
      user_name: 'jj',
      password: bcrypt.hashSync('12345', 10)
    }, 
    { first_name: 'Jose',
      last_name: 'Vasquez',
      email: 'jvas@gmail.com',
      user_name: 'jv',
      password: bcrypt.hashSync('54321', 10)
  }
  ]);
};
