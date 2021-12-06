import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

let loader: HarnessLoader;

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [AppComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('harness should load specific mat-select or all of them', async () => {
    
    // Get all mat-selects in the components
    const matSelects = await loader.getAllHarnesses(MatSelectHarness);
    console.log("matSelects=", matSelects);
    expect(matSelects.length).toBe(2);

    // Get mat-select under the div with class select1
    const select1Loader = await loader.getChildLoader('.select1');
    const matSelect1 = await select1Loader.getHarness(MatSelectHarness);

    // Get mat-select under the div with class select2
    const select2Loader = await loader.getChildLoader('.select2');
    const matSelect2 = await select2Loader.getHarness(MatSelectHarness);
  });

  it('should initialize the mat-select component with a default value', async () => {
    const select1Loader = await loader.getChildLoader('.select1');
    const matSelect1 = await select1Loader.getHarness(MatSelectHarness);
    const value1 = await matSelect1.getValueText();

    expect(value1).toBe('Hej');

    await matSelect1.open();

    const options1 = await matSelect1.getOptions();
    const values1 = await Promise.all(options1.map(opt => opt.getText()));
    expect(values1).toEqual(['Hej', 'Hi', 'Hola']);
  });

  it('should set the value of the mat-select component', async () => {
    const select2Loader = await loader.getChildLoader('.select2');
    const matSelect2 = await select2Loader.getHarness(MatSelectHarness);
   
    await matSelect2.open();

    const options2 = await matSelect2.getOptions();
    await options2[2].click();

    const valueText = await matSelect2.getValueText();
    expect(valueText).toBe('Adios');
  });
});

