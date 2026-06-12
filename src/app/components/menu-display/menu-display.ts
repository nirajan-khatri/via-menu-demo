import { Component, computed, input, signal } from '@angular/core';
import { MenuData, SeparatorConfig } from '../../models/menu.models';

@Component({
  selector: 'app-menu-display',
  templateUrl: './menu-display.html',
  styleUrl: './menu-display.scss',
})
export class MenuDisplay {
  menuData = input<MenuData | null>(null);

  activePageId = signal<string>('');

  imageErrors: Record<string, boolean> = {};

  private isScrollingProgrammatically = false;
  private scrollDebounce: any;

  sortedPages = computed(() => {
    const data = this.menuData();
    if (!data) return [];
    return [...data.dynamicPages]
      .filter(p => p.dynamicPage.status === 'active')
      .map(p => ({
        ...p,
        dynamicBlocks: [...p.dynamicBlocks].sort((a, b) => {
          const aIdx = a.dynamicBlock.sortingIndex ?? 0;
          const bIdx = b.dynamicBlock.sortingIndex ?? 0;
          return aIdx - bIdx;
        })
      }))
      .sort((a, b) => a.dynamicPage.sortingIndex - b.dynamicPage.sortingIndex);
  });

  menuName = computed(() => this.menuData()?.dynamicMenu.name || '');

  menuDescription = computed(() => this.menuData()?.dynamicMenu.description || '');

  formatPrice(price: number, currency: string): string {
    if (price <= 0) return '';
    const symbols: Record<string, string> = {
      EUR: '€',
      USD: '$',
    };
    const symbol = symbols[currency] || currency;
    return `${symbol}${price.toFixed(2)}`;
  }

  parseSeparatorConfig(description: string): SeparatorConfig | null {
    try {
      return JSON.parse(description) as SeparatorConfig;
    } catch {
      return null;
    }
  }

  isValidImageUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    const trimmed = url.trim();
    return trimmed.length > 0 && (trimmed.startsWith('http://') || trimmed.startsWith('https://'));
  }

  onImageError(blockId: string): void {
    this.imageErrors = { ...this.imageErrors, [blockId]: true };
  }

  scrollToPage(pageId: string): void {
    this.isScrollingProgrammatically = true;
    this.activePageId.set(pageId);
    
    const element = document.getElementById(`page-${pageId}`);
    if (element) {
      const scrollContainer = element.closest('.scroll-area');
      if (scrollContainer instanceof HTMLElement) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scale = containerRect.height / scrollContainer.offsetHeight;
        const unscaledOffset = (elementRect.top - containerRect.top) / scale;
        
        const targetScroll = scrollContainer.scrollTop + unscaledOffset - 56;
        scrollContainer.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }

    if (this.scrollDebounce) clearTimeout(this.scrollDebounce);
    this.scrollDebounce = setTimeout(() => {
      this.isScrollingProgrammatically = false;
    }, 800);
  }

  onScroll(event: Event): void {
    if (this.scrollDebounce) {
      clearTimeout(this.scrollDebounce);
      this.scrollDebounce = setTimeout(() => {
        this.isScrollingProgrammatically = false;
        this.updateActivePageOnScroll(event.target as HTMLElement);
      }, 100);
    }
    
    if (this.isScrollingProgrammatically) return;

    this.updateActivePageOnScroll(event.target as HTMLElement);
  }

  private updateActivePageOnScroll(container: HTMLElement): void {
    const pages = this.sortedPages();
    const containerRect = container.getBoundingClientRect();
    const scale = containerRect.height / container.offsetHeight;
    
    let currentActive = pages.length > 0 ? pages[0].dynamicPage.pageId : '';
    
    for (const page of pages) {
      const el = document.getElementById(`page-${page.dynamicPage.pageId}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > containerRect.top + (90 * scale)) {
          currentActive = page.dynamicPage.pageId;
          break;
        }
      }
    }

    const isAtBottom = container.scrollHeight - Math.ceil(container.scrollTop) <= container.clientHeight + 1;
    if (isAtBottom && pages.length > 0) {
      currentActive = pages[pages.length - 1].dynamicPage.pageId;
    }
    
    if (this.activePageId() !== currentActive) {
      this.activePageId.set(currentActive);
      const tabEl = document.getElementById(`tab-${currentActive}`);
      if (tabEl && tabEl.parentElement) {
        const parent = tabEl.parentElement;
        const tabRect = tabEl.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        if (tabRect.left < parentRect.left || tabRect.right > parentRect.right) {
          const targetScroll = parent.scrollLeft + (tabRect.left - parentRect.left) - (parentRect.width / 2) + (tabRect.width / 2);
          parent.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
      }
    }
  }

  isActivePage(pageId: string): boolean {
    const activeId = this.activePageId();
    if (!activeId) {
      const pages = this.sortedPages();
      return pages.length > 0 && pages[0].dynamicPage.pageId === pageId;
    }
    return activeId === pageId;
  }

}
