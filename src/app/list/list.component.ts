import { Component, inject, OnInit } from '@angular/core';
import { ProgService } from '../prog.service';
import { Programador } from '../programador';
import { ComunicacionEntreHnoService } from '../comunicacion-entre-hno.service';
import { NavegationService } from '../navegation.service';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, of, tap } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  filtro = new FormControl('')
  lstProgramadores: Programador[] = [];
  progEdit: Programador = new Programador();
  formFiltro = new FormGroup({
   nombre : new FormControl('',Validators.required),
   apellido : new FormControl()
  })
  private readonly progService = inject(ProgService);
  private readonly cecService = inject(ComunicacionEntreHnoService)
  private readonly navegationService = inject(NavegationService)
  private readonly router = inject(Router)
  ngOnInit(): void {
    const numerosObservable = of(1, 2, 3, 4, 5);
    const cuadradosObservable = numerosObservable.pipe(
     map(numero => numero * numero)
    );
    cuadradosObservable.subscribe(valor => {
     console.log(valor); // Esto imprimirá 1, 4, 9, 16, 25
    });
    
    this.getProgramadores();
  }
  filtrar(){
   console.log(this.formFiltro.value) 
   //TODO : llmar al servicio a un metodo que reciba parametros getProgPorNombreYApellido(this.form.value)
  }
  getProgramadores() {
    // this.progService.get().subscribe({
    //   next: (data : Programador[]) => this.lstProgramadores = data,
    //   error : (err) => console.log(err),
    //   complete : () => console.log("complete")
    // })
    this.filtro.valueChanges.subscribe(data => {
      if(data === null || data === ''){
        return this.getProgramadores();
      }
      this.lstProgramadores = this.lstProgramadores.filter(
        p => p.nombre.toUpperCase().includes(data.toUpperCase()) || p.apellido.toUpperCase().includes(data.toUpperCase()))
    })
    this.progService.get().subscribe( (data : Programador [] ) => {
    this.lstProgramadores = data
    });

  }

 
  eliminarProgramador(id?: string) {
    if(id == null) return;
    this.progService.delete(id).subscribe((data)=> {
      alert("Programador eliminado: " + data.nombre)
      this.getProgramadores();
    })
   
  }
  editar(p: Programador) {
    // this.cecService.setProgramador(p);
    // this.navegationService.setComponente('form')
   this.router.navigate(['form', p.id])
  }
  detalles(id?: string) {
    if(id === null) return;
    this.router.navigate(['detail', id])
    }
}
