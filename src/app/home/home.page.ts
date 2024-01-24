import { Component } from '@angular/core';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tareaEditando = {} as Tarea;
  arrayColeccionTareas: any = [{
    id: "",
    tarea: {} as Tarea
  }];
  idTareaSelec: string = "";
  mostrarFormulario = false; // Variable para controlar la visibilidad del formulario

  constructor(private firestoreService: FirestoreService, private router: Router) {
    this.obtenerListaTareas();
  }

  clickBotonInsertar() {
    this.firestoreService.insertar("tareas", this.tareaEditando).then(() => {
      console.log('Tarea creada correctamente!');
      this.tareaEditando = {} as Tarea;
      this.mostrarFormulario = false; // Oculta el formulario después de añadir la tarea
    }, (error) => {
      console.error(error);
    });
  }

  obtenerListaTareas() {
    this.firestoreService.consultar("tareas").subscribe((datosRecibidos) => {
      this.arrayColeccionTareas = [];
      datosRecibidos.forEach((datosTarea) => {
        this.arrayColeccionTareas.push({
          id: datosTarea.payload.doc.id,
          tarea: datosTarea.payload.doc.data()
        });
      });
    });
  }

  selecTarea(idTarea: string, tareaSelec: Tarea) {
    this.tareaEditando = tareaSelec;
    this.idTareaSelec = idTarea;
    this.router.navigate(['detalle', this.idTareaSelec]);
  }

  clickBotonBorrar() {
    this.firestoreService.borrar("tareas", this.idTareaSelec).then(() => {
      console.log('Tarea borrada correctamente!');
      this.tareaEditando = {} as Tarea;
      this.idTareaSelec = "";
      this.mostrarFormulario = false; // Oculta el formulario después de borrar la tarea
    }, (error) => {
      console.error(error);
    });
  }

  clickBotonModificar() {
    this.firestoreService.modificar("tareas", this.idTareaSelec, this.tareaEditando).then(() => {
      console.log('Tarea modificada correctamente!');
      this.mostrarFormulario = false; // Oculta el formulario después de modificar la tarea
    }, (error) => {
      console.error(error);
    });
  }

}
