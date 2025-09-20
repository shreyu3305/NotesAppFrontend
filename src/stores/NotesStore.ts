import { makeAutoObservable, runInAction } from 'mobx';
import { Note } from '../shared/schemas';
import { notesApi } from '../api/notesApi';
import { RootStore } from './rootStore';

export class NotesStore {
  items: Note[] = [];
  selected: Note | null = null;
  status: 'idle' | 'loading' | 'error' = 'idle';
  error: string | null = null;
  
  // Pagination and filtering
  page = 1;
  pageSize = 9;
  total = 0;
  query = '';
  tagFilters: string[] = [];
  availableTags: string[] = [];

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  /**
   * Fetch notes list with current filters
   */
  async fetchList() {
    try {
      this.status = 'loading';
      this.error = null;
      
      const response = await notesApi.list(this.page, this.pageSize, this.query, this.tagFilters);
      
      runInAction(() => {
        this.items = response.notes;
        this.total = response.total;
        this.status = 'idle';
      });
    } catch (error: any) {
      runInAction(() => {
        this.status = 'error';
        this.error = error.response?.data?.error?.message || 'Failed to fetch notes';
      });
      this.rootStore.ui.showToast('error', 'Error', this.error!);
    }
  }

  /**
   * Fetch single note by ID
   */
  async fetchById(id: string) {
    try {
      this.status = 'loading';
      this.error = null;
      
      const note = await notesApi.getById(id);
      
      runInAction(() => {
        this.selected = note;
        this.status = 'idle';
      });
    } catch (error: any) {
      runInAction(() => {
        this.status = 'error';
        this.error = error.response?.data?.error?.message || 'Failed to fetch note';
      });
      this.rootStore.ui.showToast('error', 'Error', this.error!);
    }
  }

  /**
   * Create new note with optimistic updates
   */
  async create(data: { title: string; body: string; tags: string[] }) {
    const tempId = 'temp_' + Date.now();
    const tempNote: Note = {
      _id: tempId,
      ...data,
      ownerId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic update
    runInAction(() => {
      this.items.unshift(tempNote);
      this.total += 1;
    });

    try {
      const note = await notesApi.create(data);
      
      runInAction(() => {
        const index = this.items.findIndex(n => n._id === tempId);
        if (index !== -1) {
          this.items[index] = note;
        }
      });

      this.rootStore.ui.showToast('success', 'Note created', 'Your note has been saved');
      return note;
    } catch (error: any) {
      // Rollback optimistic update
      runInAction(() => {
        const index = this.items.findIndex(n => n._id === tempId);
        if (index !== -1) {
          this.items.splice(index, 1);
          this.total -= 1;
        }
      });

      const errorMessage = error.response?.data?.error?.message || 'Failed to create note';
      this.rootStore.ui.showToast('error', 'Error', errorMessage);
      throw error;
    }
  }

  /**
   * Update existing note with optimistic updates
   */
  async update(id: string, data: Partial<{ title: string; body: string; tags: string[] }>) {
    const originalNote = this.items.find(n => n._id === id);
    if (!originalNote) return;

    const updatedNote = {
      ...originalNote,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Optimistic update
    runInAction(() => {
      const index = this.items.findIndex(n => n._id === id);
      if (index !== -1) {
        this.items[index] = updatedNote;
      }
      if (this.selected?._id === id) {
        this.selected = updatedNote;
      }
    });

    try {
      const note = await notesApi.update(id, data);
      
      runInAction(() => {
        const index = this.items.findIndex(n => n._id === id);
        if (index !== -1) {
          this.items[index] = note;
        }
        if (this.selected?._id === id) {
          this.selected = note;
        }
      });

      this.rootStore.ui.showToast('success', 'Note updated', 'Your changes have been saved');
      return note;
    } catch (error: any) {
      // Rollback optimistic update
      runInAction(() => {
        const index = this.items.findIndex(n => n._id === id);
        if (index !== -1) {
          this.items[index] = originalNote;
        }
        if (this.selected?._id === id) {
          this.selected = originalNote;
        }
      });

      const errorMessage = error.response?.data?.error?.message || 'Failed to update note';
      this.rootStore.ui.showToast('error', 'Error', errorMessage);
      throw error;
    }
  }

  /**
   * Delete note with optimistic updates
   */
  async remove(id: string) {
    const originalNote = this.items.find(n => n._id === id);
    if (!originalNote) return;

    const originalIndex = this.items.findIndex(n => n._id === id);

    // Optimistic update
    runInAction(() => {
      this.items = this.items.filter(n => n._id !== id);
      this.total -= 1;
      if (this.selected?._id === id) {
        this.selected = null;
      }
    });

    try {
      await notesApi.remove(id);
      this.rootStore.ui.showToast('success', 'Note deleted', 'Note has been removed');
    } catch (error: any) {
      // Rollback optimistic update
      runInAction(() => {
        this.items.splice(originalIndex, 0, originalNote);
        this.total += 1;
      });

      const errorMessage = error.response?.data?.error?.message || 'Failed to delete note';
      this.rootStore.ui.showToast('error', 'Error', errorMessage);
      throw error;
    }
  }

  /**
   * Load available tags
   */
  async loadTags() {
    try {
      const tags = await notesApi.getAllTags();
      runInAction(() => {
        this.availableTags = tags;
      });
    } catch (error) {
      // Silent fail for tags
    }
  }

  // Filter and pagination methods
  setQuery(query: string) {
    this.query = query;
    this.page = 1; // Reset to first page
  }

  setTagFilters(tags: string[]) {
    this.tagFilters = tags;
    this.page = 1; // Reset to first page
  }

  setPage(page: number) {
    this.page = page;
  }

  get isLoading() {
    return this.status === 'loading';
  }

  get hasNextPage() {
    return this.page * this.pageSize < this.total;
  }

  get hasPreviousPage() {
    return this.page > 1;
  }

  get totalPages() {
    return Math.ceil(this.total / this.pageSize);
  }

  clearSelected() {
    this.selected = null;
  }
}