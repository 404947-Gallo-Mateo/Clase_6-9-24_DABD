import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Programador } from '../programador';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ProgService } from '../prog.service';
import { NavegationService } from '../navegation.service';
import { ComunicacionEntreHnoService } from '../comunicacion-entre-hno.service';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorFecha } from '../validatorFecha';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  //providers:[ProgService]
})
export class FormComponent implements OnInit, OnChanges, OnDestroy {
  
  habilidadSeleccionada = new FormControl();

  id: string = ''
  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(3)]),
    dni: new FormControl('',[Validators.required],this.dniUnicoValidador()),
    habilidades : new FormArray([]),
    contacto: new FormGroup({
      email: new FormControl('', Validators.email),
      redesSociales: new FormArray([]),
    }),
    proyectos: new FormArray([]),
  })


  dniUnicoValidador() : AsyncValidatorFn {
   return (control : AbstractControl) : Observable<ValidationErrors | null> => {
    return this.progService.getBydni(control.value).pipe(
      map(data => {
        return data.length > 0 ? {dniUnico : true} : null
      }),
      catchError(() => {
        alert("error en la api")
        return of({apiCaida : true})
      })
    )
   }
  }
  
  get redesSociales() {
    return this.form.controls['contacto'].get('redesSociales') as FormArray
  }
  agregarRedSocial() {
    const controlRedSocial = new FormControl('',Validators.required)
    this.redesSociales.push(controlRedSocial)
  }
  eliminarRedSocial(index: number) {
    this.redesSociales.removeAt(index)
  }
  get habilidades() {
    
    return this.form.controls['habilidades'] as FormArray
  }
  agregarHabilidades() {
    const controlhabilidad = new FormControl(this.habilidadSeleccionada.value)
    this.habilidades.push(controlhabilidad)
  }
  eliminarHabilidades(index: number) {
    this.habilidades.removeAt(index)  
  }
  get proyectos() {
    return this.form.controls['proyectos'] as FormArray
  }
  agregarProyectos() {
    const proyecto = new FormGroup({
      nombre: new FormControl('', Validators.required),
      fechaInicio: new FormControl(new Date(), [Validators.required, ValidatorFecha.validarFecha]),
      fechaFin: new FormControl(new Date())
    })
    this.proyectos.push(proyecto)
  }
  quitarProyecto(index: number) {
    this.proyectos.removeAt(index)
  }
  prog: Programador = new Programador();
  isEdit: boolean = false;
  private subscription = new Subscription()

  //constructor(private progService : ProgService) {}
  private readonly progService = inject(ProgService);
  // private readonly navegationService = inject(NavegationService)
  //private readonly cecService = inject(ComunicacionEntreHnoService)
  private readonly router = inject(Router)
  private readonly activatedRouter = inject(ActivatedRoute)
  listHabilidades: string[] = ['.Net', 'Java', 'Javascript', 'AWS'];

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((data) => {
      this.getById(data['id'])
      this.id = data['id']
    })

  }
  getById(id: string) {
    this.progService.getById(id).subscribe((data) => {
      this.form.patchValue({
        nombre: data.nombre,
        apellido: data.apellido,
        contacto: {
          email: data.contacto.email,
        }
      })
      this.isEdit = true
    });
  }
  sendForm() {
  console.log(this.form)
    if (this.form.valid) {
      // this.enviadoEmit.emit(this.prog);
      // this.progService.addPush(this.prog);
      this.prog = this.form.value as Programador
      if (this.isEdit) {
        this.prog.id = this.id;
        this.subscription.add(
          this.progService.put(this.prog).subscribe({
            next: (data) => alert("programador creado" + data.id),
            error: (errr) => alert("Error al crear el programdor."),
            complete: () => this.router.navigate(['list'])
          }))
      } else {
        this.subscription.add(
          this.progService.post(this.prog).subscribe({
            next: (data) => alert("programador creado" + data.id),
            error: (errr) => alert("Error al crear el programdor."),
            complete: () => this.router.navigate(['list'])
          }))
      }

    }
  }
  
  ngOnChanges(): void {
    //TODO: completar con lo visto en clase
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log("destruido")

  }

}
