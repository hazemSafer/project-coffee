import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let mockDataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    // Create a mock DataService
    mockDataService = jasmine.createSpyObj('DataService', ['getCategories']);
    mockDataService.getCategories.and.returnValue(of([
      { category: 'Food', products: [{ name: 'Burger', price: 5.5 }] }
    ]));

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [{ provide: DataService, useValue: mockDataService }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Cafe Ordering App' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Cafe Ordering App');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, cafe-ordering-app');
  });
});



