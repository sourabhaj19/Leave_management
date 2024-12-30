import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEmailShootComponent } from './bulk-email-shoot.component';

describe('BulkEmailShootComponent', () => {
  let component: BulkEmailShootComponent;
  let fixture: ComponentFixture<BulkEmailShootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkEmailShootComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkEmailShootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
