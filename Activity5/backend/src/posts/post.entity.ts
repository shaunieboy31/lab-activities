import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // service expects "content"
  @Column('text')
  content: string;

  // relation back to user — name must match User.posts relation
  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  user: User;

  // relation to comments — name must match Comment.post relation
  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];

  // replace any CreateDateColumn() / Column({ type: 'timestamp' }) with:
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt?: Date;
}
