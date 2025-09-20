import { api } from './http';
import { Note, NotesListResponse } from '../shared/schemas';

export const notesApi = {
  async list(page = 1, pageSize = 9, query = '', tags: string[] = []): Promise<NotesListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
      ...(query && { query }),
      ...(tags.length > 0 && { tags: tags.join(',') }),
    });
    
    const response: NotesListResponse = await api.get(`/notes?${params}`);
    return response;
  },

  async getById(id: string): Promise<Note> {
    const response = await api.get(`/notes/${id}`);
    return response;
  },

  async create(data: { title: string; body: string; tags: string[] }): Promise<Note> {
    const response = await api.post('/notes', data);
    return response;
  },

  async update(id: string, data: Partial<{ title: string; body: string; tags: string[] }>): Promise<Note> {
    const response = await api.patch(`/notes/${id}`, data);
    return response;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },

  async getAllTags(): Promise<string[]> {
    const response = await api.get('/notes/tags');
    return response.tags;
  },
};