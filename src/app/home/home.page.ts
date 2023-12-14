import { Component } from '@angular/core';
import {Tarea} from '../tarea';
import { FirestoreService } from '../firestore.service';

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

  constructor(private firestoreService: FirestoreService) {
    this.obtenerListaTareas();
  }

  clickBotonInsertar(){
    this.firestoreService.insertar("tareas", this.tareaEditando).then(() => {
    console.log('Tarea creada correctamente!');
    this.tareaEditando= {} as Tarea;
    }, (error) => {
      console.error(error);
    });
  }

  obtenerListaTareas(){
    this.firestoreService.consultar("tareas").subscribe((datosRecibidos) => {
      this.arrayColeccionTareas = [];
      datosRecibidos.forEach((datosTarea) => {
        this.arrayColeccionTareas.push({
          id: datosTarea.payload.doc.id,
          tarea: datosTarea.payload.doc.data()

        })
      });
    });
  }
  selecTarea(idTarea:string, tareaSelec: Tarea){
    this.tareaEditando = tareaSelec;
    this.idTareaSelec = idTarea;
  }


  clickBotonBorrar(){
    this.firestoreService.borrar("tareas", this.idTareaSelec).then(() => {
    console.log('Tarea borrada correctamente!');
    this.tareaEditando= {} as Tarea;
    this.idTareaSelec = "";
    }, (error) => {
      console.error(error);
    });
  }

  clickBotonModificar(){
    this.firestoreService.modificar("tareas",this.idTareaSelec, this.tareaEditando).then(() => {
      console.log('Tarea modificada correctamente!');
    }, (error) => {
      console.error(error);
    });
  }

}
