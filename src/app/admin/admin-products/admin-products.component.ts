import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from 'src/app/product.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Product } from 'src/app/models/product';
import { Subject } from 'rxjs';
import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';


@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy,  AfterViewInit {
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  products: Product[];
  headElements = ['', 'Title', 'Price', ''];
  filteredProducts: any[];
  subscription: Subscription;
  items: Product[] = [];
  itemCount: number;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;


  searchText: string = '';
  previous: string;

  constructor(private productService: ProductService, private cdRef: ChangeDetectorRef) {

  }

  @HostListener('input') oninput() {
    this.searchItems();
  }

  ngOnInit() {
    this.subscription = this.productService.getAll()
      .subscribe((products: Product[]) => {
        this.filteredProducts = this.products = products;
        this.mdbTable.setDataSource(this.products);
        this.products = this.mdbTable.getDataSource();
        this.previous = this.mdbTable.getDataSource();
      });
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(10);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  searchItems() {
    const prev = this.mdbTable.getDataSource();

    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.products = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.products = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dtTrigger.unsubscribe();
  }

}
