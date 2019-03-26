
exports.up = function(knex, Promise) {
  return knex.schema.createTable('bears', table => {
      table.increments();
      table.string('name', 128).notNullable();
      table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('bears');
};
