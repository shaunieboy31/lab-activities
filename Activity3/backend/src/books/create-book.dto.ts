export class CreateBookDto {
  title!: string;
  authorId!: number;
  categoryId!: number;
  description?: string;
}

export class UpdateBookDto {
  title?: string;
  authorId?: number;
  categoryId?: number;
  description?: string;
}
