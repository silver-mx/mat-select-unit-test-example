import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { AppComponent } from './app.component';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

let loader: HarnessLoader;

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        NoopAnimationsModule
      ],
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

  it('mat-form-field should detect errors after validations are triggered', async () => {
    const select2Loader = await loader.getChildLoader('.select2');
    const matFormField = await select2Loader.getHarness(MatFormFieldHarness);
    const matSelect2 = await matFormField.getControl() as MatSelectHarness;

    await matSelect2.open();

    const options = await matSelect2.getOptions();
    await options[0].click();

    const submitButton = (await loader.getAllHarnesses(MatButtonHarness))[0];

    expect((await matSelect2.getValueText())).toEqual('Hej då');

    // Check both the form field and the control are invalid
    expect((await matSelect2.isValid())).toBeFalse();
    expect((await matFormField.isControlValid())).toBeFalse();

    // Check the errors
    expect((await matFormField.hasErrors())).toBeTrue();
    expect((await matFormField.getTextErrors())).toEqual(['There is a validation error in select 2']);

    // Check the submit button is disabled
    expect((await submitButton.isDisabled())).toBeTrue();
  })

});

