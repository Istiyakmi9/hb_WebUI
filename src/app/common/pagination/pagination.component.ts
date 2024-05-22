import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Filter } from 'src/providers/ajax.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    standalone: true,
    imports: [NgClass]
})
export class PaginationComponent implements OnInit {
  pageCount: number = 0;
  lastPage: number = 0;
  startPage: number = 0;
  isPaginationUpdated: boolean = false;
  _pagination: Filter = new Filter();
  public pages: number [] = [];
  activePage: number;

  @Input()
  set pagination(value: Filter) {
    this._pagination = value;
    this.updatePagination();
  }

  @Output() onPageChange: EventEmitter<Filter> = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
  }

  private updatePagination() {
    this.pageCount = 0;
    if(this._pagination != null) {
      this.getPageCount();
      this.pages = this.getArrayOfPage(this.pageCount, this._pagination.pageIndex);
      this.activePage = this._pagination.activePageNumber;
    } else {
      this.pages = this.getArrayOfPage(1, 1);
      this.activePage = 1;
    }
    this.isPaginationUpdated = true;
  }

  private  getPageCount() {
    this.pageCount = 0;

    if (this._pagination.totalRecords > 0 && this._pagination.pageSize > 0) {
      this.activePage = this._pagination.pageIndex;
      const pageCount = this._pagination.totalRecords / this._pagination.pageSize;
      const roundedPageCount = Math.floor(pageCount);
      this.pageCount = roundedPageCount < pageCount ? roundedPageCount + 1 : roundedPageCount;
      this.calculatePagination(this.activePage);
    }
  }

  private calculatePagination(currentPageIndex: number) {
    this._pagination.startIndex = (currentPageIndex - 1) * 10 + 1;
    this._pagination.endIndex = this._pagination.pageSize * currentPageIndex;
    if(this._pagination.endIndex > this._pagination.totalRecords) {
      this._pagination.endIndex = this._pagination.totalRecords;
    }
  }

  private getArrayOfPage(pageCount: number, pageIndex: number): number [] {
    const pageArray = [];
    if (pageCount > 0) {
      for(let i = 1 ; i <= pageCount; i++) {
        pageArray.push(i);
        this.lastPage = i;
      }
      this.startPage = pageIndex;
    }

    return pageArray;
  }

  onNextPage(pageNumber: number): void {
    this.isPaginationUpdated = false;
    this._pagination.activePageNumber = pageNumber;
    if (pageNumber >= 1 && pageNumber <= this.lastPage) {
        this.activePage = pageNumber;
        this._pagination.pageIndex = this.activePage;
        this.calculatePagination(this.activePage);
        this.onPageChange.emit(this._pagination);
    } else if(pageNumber > this.pages.length && pageNumber <= this.pageCount) {
      this.pages = this.getArrayOfPage(this.pageCount, pageNumber);
      if(this.pages.length > 0) {
        this.activePage = pageNumber;
        this.pagination.pageIndex = this.activePage;
        this.calculatePagination(this.activePage);
        this.onPageChange.emit(this.pagination);
      }
    }

    this.pages = this.getArrayOfPage(this.pageCount, pageNumber);
    this.isPaginationUpdated = true;
  }

  onPreviousPage(pageNumber: number): void {
    this.isPaginationUpdated = false;
    this._pagination.activePageNumber = pageNumber;
    if (pageNumber >= this.startPage) {
        this.activePage = pageNumber;
        this._pagination.pageIndex = this.activePage;
        this.calculatePagination(this.activePage);
        this.onPageChange.emit(this._pagination);
    } else if(pageNumber > 0) {
      this.activePage = pageNumber;
      if(pageNumber - this._pagination.activePageNumber > 0) {
        pageNumber = pageNumber - this._pagination.activePageNumber;
      } else {
        pageNumber = 1;
      }
      this.pages = this.getArrayOfPage(this.pageCount, pageNumber);
      if(this.pages.length > 0) {
        this._pagination.pageIndex = this.activePage;
        this.calculatePagination(this.activePage);
        this.onPageChange.emit(this._pagination);
      }
    }

    this.isPaginationUpdated = true;
  }


  // New Pagination
  get totalPages(): number {
    return Math.ceil(this._pagination.totalRecords / this._pagination.pageSize);
  }

  get newpages(): number[] {
    const pageCount = Math.min(7, this.totalPages); // Adjust as needed
    const pages: number[] = [];
    let start = Math.max(1, this.activePage - Math.floor(pageCount / 2));
    let end = Math.min(this.totalPages, start + pageCount - 1);

    if (end - start + 1 < pageCount) {
      start = Math.max(1, end - pageCount + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  onPageChanges(page: number): void {
    this._pagination.activePageNumber = page;
    if (page >= 1 && page <= this.lastPage) {
        this.activePage = page;
        this._pagination.pageIndex = this.activePage;
        this.calculatePagination(this.activePage);
        this.onPageChange.emit(this._pagination);
    }
  }
}
