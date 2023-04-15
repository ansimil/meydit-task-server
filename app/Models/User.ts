import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  public userId: string

  @column()
  public id: number

  @column()
  public firstName: string

  @column()
  public surname: string

  @column()
  public emailAddress: string

  @column()
  public password: string

  @column()
  public proposals: JSON | null

  @column()
  public jobs: JSON | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
