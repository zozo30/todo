import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"


@Entity('todos')
export class Todos {
    @PrimaryGeneratedColumn('increment') id: number
    @Column('text') description: string
    @Column('boolean') completed: boolean
    @CreateDateColumn({ name: 'created_at' }) createdAt: Date
    @CreateDateColumn({ name: 'updated_at' }) updatedAt: Date
}