import { readFile, writeFile } from 'fs/promises';
import { PostDto } from './blog.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blog.schema';

export interface BlogRepository {
  getAll(): Promise<PostDto[]>;
  get(id: string): Promise<PostDto>;
  create(postDto: PostDto): Promise<void>;
  delete(id: string): Promise<void>;
  update(id: string, postDto: PostDto): Promise<void>;
}

@Injectable()
export class BlogFileRepository implements BlogRepository {
  FILE_NAME = './blog.json';

  async getAll(): Promise<PostDto[]> {
    const file = await readFile(this.FILE_NAME, 'utf8');
    return JSON.parse(file);
  }

  async get(id: string): Promise<PostDto> {
    const posts = await this.getAll();
    return posts.find(post => post.id === id);
  }

  async create(postDto: PostDto): Promise<void> {
    const posts = await this.getAll();
    const id = posts.length + 1;
    const createPost = { id: id.toString(), ...postDto, createdAt: new Date() };
    posts.push(createPost);
    await writeFile(this.FILE_NAME, JSON.stringify(posts));
  }

  async delete(id: string): Promise<void> {
    const posts = await this.getAll();
    const filteredPosts = posts.filter(post => post.id !== id);
    await writeFile(this.FILE_NAME, JSON.stringify(filteredPosts));
  }

  async update(id: string, postDto: PostDto): Promise<void> {
    const posts = await this.getAll();
    const updatedPosts = posts.map(post => post.id === id ? { ...post, ...postDto } : post);
    await writeFile(this.FILE_NAME, JSON.stringify(updatedPosts));
  }
}

@Injectable()
export class BlogMongoRepository implements BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) { }

  async getAll(): Promise<PostDto[]> {
    return await this.blogModel.find().exec();
  }

  async get(id: string): Promise<PostDto> {
    return await this.blogModel.findById(id);
  }

  async create(postDto: PostDto): Promise<void> {
    const post = {
      ...postDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await this.blogModel.create(post);
  }

  async delete(id: string): Promise<void> {
    await this.blogModel.findByIdAndDelete(id);
  }

  async update(id: string, postDto: PostDto) {
    const post = { id, ...postDto, updatedAt: new Date() };
    await this.blogModel.findByIdAndUpdate(id, post);
  }
}