import { PostDto } from './blog.model';
import { BlogMongoRepository } from './blog.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogService {
  constructor(private blogRepository: BlogMongoRepository) { }

  async getAll() {
    return await this.blogRepository.getAll();
  }

  async get(id: string) {
    return await this.blogRepository.get(id);
  }

  create(postDto: PostDto) {
    this.blogRepository.create(postDto);
  }

  delete(id) {
    this.blogRepository.delete(id);
  }

  update(id, postDto: PostDto) {
    this.blogRepository.update(id, postDto);
  }

}