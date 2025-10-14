import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepo: Repository<Note>,
  ) {}

  findAll(userId: number) {
    return this.notesRepo.find({ where: { user: { id: userId } } });
  }

  create(userId: number, dto: CreateNoteDto) {
    const note = this.notesRepo.create({ ...dto, user: { id: userId } });
    return this.notesRepo.save(note);
  }

  async update(userId: number, id: number, dto: UpdateNoteDto) {
    const note = await this.notesRepo.findOne({ where: { id, user: { id: userId } } });
    if (!note) return null;
    Object.assign(note, dto);
    return this.notesRepo.save(note);
  }

  async remove(userId: number, id: number) {
    const note = await this.notesRepo.findOne({ where: { id, user: { id: userId } } });
    if (!note) return null;
    return this.notesRepo.remove(note);
  }
}
