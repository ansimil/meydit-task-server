import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'proposals'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid("proposal_id")
      table.string("owner")
      table.string('title')
      table.text('description')
      table.string('category')
      table.string('status')
      table.string('primary_img_url')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
