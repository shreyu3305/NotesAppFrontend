import { AuthStore } from './AuthStore';
import { NotesStore } from './NotesStore';
import { UiStore } from './UiStore';

export class RootStore {
  auth: AuthStore;
  notes: NotesStore;
  ui: UiStore;

  constructor() {
    this.ui = new UiStore();
    this.auth = new AuthStore(this);
    this.notes = new NotesStore(this);
  }
}

export const rootStore = new RootStore();