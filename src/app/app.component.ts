import { Component} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  //TODO: LLAMAR AL SERVICIO PARA VER EL ROL ACTUAL
 roleActual : string = 'USER'
 

}
