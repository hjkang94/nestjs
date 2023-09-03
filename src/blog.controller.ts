import { Controller, Param, Body, Delete, Get, Post, Put } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) { }

  @Get()
  getAll() {
    console.log('모든 게시글 조회');
    return this.blogService.getAll();
  }

  @Get('/:id')
  get(@Param('id') id: string) {
    console.log(`${id} 게시글 조회`);
    return this.blogService.get(id);
  }

  @Post()
  create(@Body() postDto) {
    console.log('게시글 생성');
    this.blogService.create(postDto);
    return 'success'
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    console.log(`${id} 게시글 삭제`);
    this.blogService.delete(id);
    return 'success'
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() postDto: any) {
    console.log(`${id} 게시글 수정`);
    return this.blogService.update(id, postDto);
  }
}