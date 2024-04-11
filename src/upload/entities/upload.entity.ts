
import { Column, Entity, PrimaryGeneratedColumn  } from "typeorm";

@Entity()
export class NV_Upload {

  @PrimaryGeneratedColumn()
  id:number

  @Column()
  username:string

  @Column()
  fieldname:string

  @Column({ default: null })
  originalname:string

  @Column({ default: null })
  encoding:string

  @Column({ default: null })
  mimetype:string

  @Column({ default: null })
  filename:string

  @Column()
  path:string

  @Column({ default: null })
  size:number

  @Column()
  belong:string

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

}
