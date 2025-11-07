import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';
import { Post } from '../posts/post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  // 5️⃣ Each comment is written by one user
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  // 6️⃣ Each comment belongs to one post
  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;
}
