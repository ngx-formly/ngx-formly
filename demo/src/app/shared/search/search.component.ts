import { Component, ElementRef, computed, inject, signal, viewChild, viewChildren } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SearchDocument, searchDocuments } from './search';

@Component({
  selector: 'formly-search',
  imports: [MatButton, MatIconButton, MatIcon, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  readonly dialog = inject(MatDialogRef<SearchComponent>);
  readonly query = signal('');
  readonly loading = signal(true);
  readonly loadFailed = signal(false);
  readonly documents = signal<SearchDocument[]>([]);
  readonly results = computed(() => searchDocuments(this.documents(), this.query()));
  readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  readonly resultLinks = viewChildren<ElementRef<HTMLAnchorElement>>('resultLink');

  constructor() {
    this.loadIndex();
  }

  async loadIndex(): Promise<void> {
    this.loading.set(true);
    this.loadFailed.set(false);
    try {
      const { SEARCH_INDEX } = await import('./search-index');
      this.documents.set(SEARCH_INDEX);
    } catch {
      this.loadFailed.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  focusResult(event: Event, index: number): void {
    event.preventDefault();
    const link = this.resultLinks()[index]?.nativeElement;
    (link || this.searchInput().nativeElement).focus();
    link?.scrollIntoView({ block: 'nearest' });
  }
}
