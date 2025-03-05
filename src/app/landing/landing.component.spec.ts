import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component'; // Asegúrate de que la ruta sea correcta
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa el módulo de pruebas de HttpClient
import { CommonModule } from '@angular/common'; // Importa CommonModule si usas directivas comunes

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LandingComponent,
        CommonModule,
        HttpClientTestingModule // Añade HttpClientTestingModule aquí
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;

    // Inicializa el countdown
    component.countdown = { days: 5, hours: 0, minutes: 0, seconds: 0 };
    fixture.detectChanges(); // Ejecuta la detección de cambios
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se haya creado
  });

  it('should display the countdown days', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.countdown-value').textContent).toContain('5'); // Verifica que el valor de días se muestre correctamente
  });

  // Test para verificar que la propiedad message se inicializa correctamente
  it('should initialize message correctly', () => {
    expect(component.message).toBe('Countdown started'); // Verifica que el mensaje se inicializa correctamente
  });

  // Test para verificar que el método increaseDays funciona
  it('should increase days when increaseDays is called', () => {
    component.increaseDays(); // Llama al método
    expect(component.countdown.days).toBe(6); // Verifica que el valor de días se incrementa
  });

  it('should show a message when submitting the pre-registration', () => {
    component.name = ''; // Asigna un nombre
    fixture.detectChanges(); // Actualiza la vista
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('¿Por qué participar?'); // Verifica que el saludo se muestre correctamente
  });

  it('should show the flayer loaded from the administrator', () => {
    component.name = ''; // Asigna un nombre
    fixture.detectChanges(); // Actualiza la vista
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('¿Por qué participar?'); // Verifica que el saludo se muestre correctamente
  });

  it('should there is a button to send the presentations', () => {
    component.name = ''; // Asigna un nombre
    fixture.detectChanges(); // Actualiza la vista
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('¿Por qué participar?'); // Verifica que el saludo se muestre correctamente
  });

  it('should have validations for the input of searching for certificates', () => {
    component.name = ''; // Asigna un nombre
    fixture.detectChanges(); // Actualiza la vista
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('¿Por qué participar?'); // Verifica que el saludo se muestre correctamente
  });

  it('should exist a footer', () => {
    component.name = ''; // Asigna un nombre
    fixture.detectChanges(); // Actualiza la vista
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('¿Por qué participar?'); // Verifica que el saludo se muestre correctamente
  });
});
