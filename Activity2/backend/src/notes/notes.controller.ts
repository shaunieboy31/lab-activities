import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNoteDto, NoteResponseDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@ApiBearerAuth()
@ApiTags('notes')
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes for current user (requires auth)' })
  @ApiResponse({ status: 200, description: 'List of notes', type: [NoteResponseDto] })
  findAll(@Req() req) {
    return this.notesService.findAll(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note (requires auth)' })
  @ApiResponse({ status: 201, description: 'Note created successfully', type: NoteResponseDto })
  create(@Req() req, @Body() dto: CreateNoteDto) {
    return this.notesService.create(req.user.userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a note (requires auth)' })
  @ApiResponse({ status: 200, description: 'Note updated successfully', type: NoteResponseDto })
  update(@Req() req, @Param('id') id: number, @Body() dto: UpdateNoteDto) {
    return this.notesService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note (requires auth)' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  remove(@Req() req, @Param('id') id: number) {
    return this.notesService.remove(req.user.userId, id);
  }
}
