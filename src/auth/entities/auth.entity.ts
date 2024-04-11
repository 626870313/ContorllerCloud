import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NV_Users {

  @PrimaryGeneratedColumn()
  id:number

  @Column()
  username:string

  @Column()
  password:string

  @Column({default:'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'})
  avatar:string

  @Column({default:20})
  space:number
}
