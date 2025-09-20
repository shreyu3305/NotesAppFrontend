import { Note } from '../shared/schemas';

// Mock notes data
let mockNotes: Note[] = [
  {
    _id: 'note1',
    title: 'Welcome to Notes App',
    body: 'This is your first note! You can create, edit, and organize your thoughts here. Use tags to categorize your notes and make them easier to find.',
    tags: ['welcome', 'getting-started'],
    ownerId: 'user1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'note2',
    title: 'Project Ideas',
    body: 'Some ideas for future projects:\n- Mobile app for task management\n- Web scraper for news articles\n- AI-powered writing assistant\n- Personal finance tracker',
    tags: ['projects', 'brainstorming', 'development'],
    ownerId: 'user1',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'note3',
    title: 'Meeting Notes - Q1 Planning',
    body: 'Key points from today\'s planning meeting:\n\n- Focus on user experience improvements\n- Increase development velocity\n- Implement better testing practices\n- Plan for scalability',
    tags: ['meetings', 'planning', 'work'],
    ownerId: 'user1',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    _id: 'note4',
    title: 'Recipe: Chocolate Chip Cookies',
    body: 'Ingredients:\n- 2¼ cups all-purpose flour\n- 1 tsp baking soda\n- 1 tsp salt\n- 1 cup butter, softened\n- ¾ cup granulated sugar\n- ¾ cup brown sugar\n- 2 eggs\n- 2 tsp vanilla\n- 2 cups chocolate chips\n\nBake at 375°F for 9-11 minutes.',
    tags: ['recipes', 'baking', 'desserts'],
    ownerId: 'user1',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const notesApi = {
  async list(page = 1, pageSize = 9, query = '', tags: string[] = []): Promise<{
    notes: Note[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    await delay(250);
    
    let filteredNotes = [...mockNotes];
    
    // Filter by query
    if (query) {
      filteredNotes = filteredNotes.filter(note =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.body.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filter by tags
    if (tags.length > 0) {
      filteredNotes = filteredNotes.filter(note =>
        tags.some(tag => note.tags.includes(tag))
      );
    }
    
    // Sort by updatedAt desc
    filteredNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    const total = filteredNotes.length;
    const start = (page - 1) * pageSize;
    const notes = filteredNotes.slice(start, start + pageSize);
    
    return { notes, total, page, pageSize };
  },

  async getById(id: string): Promise<Note> {
    await delay(200);
    
    const note = mockNotes.find(n => n._id === id);
    if (!note) {
      throw {
        response: {
          data: {
            error: {
              code: 'NOTE_NOT_FOUND',
              message: 'Note not found',
            }
          }
        }
      };
    }
    
    return note;
  },

  async create(data: { title: string; body: string; tags: string[] }): Promise<Note> {
    await delay(300);
    
    const note: Note = {
      _id: 'note_' + Date.now(),
      ...data,
      ownerId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockNotes.unshift(note);
    return note;
  },

  async update(id: string, data: Partial<{ title: string; body: string; tags: string[] }>): Promise<Note> {
    await delay(300);
    
    const noteIndex = mockNotes.findIndex(n => n._id === id);
    if (noteIndex === -1) {
      throw {
        response: {
          data: {
            error: {
              code: 'NOTE_NOT_FOUND',
              message: 'Note not found',
            }
          }
        }
      };
    }
    
    mockNotes[noteIndex] = {
      ...mockNotes[noteIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    return mockNotes[noteIndex];
  },

  async remove(id: string): Promise<void> {
    await delay(200);
    
    const noteIndex = mockNotes.findIndex(n => n._id === id);
    if (noteIndex === -1) {
      throw {
        response: {
          data: {
            error: {
              code: 'NOTE_NOT_FOUND',
              message: 'Note not found',
            }
          }
        }
      };
    }
    
    mockNotes.splice(noteIndex, 1);
  },

  async getAllTags(): Promise<string[]> {
    await delay(150);
    
    const allTags = mockNotes.flatMap(note => note.tags);
    return [...new Set(allTags)].sort();
  },
};