import { Component, OnInit } from '@angular/core';
import { Tarea } from '../tarea';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  id: string = "";
  tareaEditando: Tarea = {} as Tarea;
  mostrarFormulario = false;

  document: any = {
    id: "",
    data: {} as Tarea
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService) {
  }

  ngOnInit() {
    // Se almacena en una variable el id que se ha recibido desde la página anterior
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
      // Se hace la consulta a la base de datos para obtener los datos asociados a esa id
      this.firestoreService.consultarPorId("tareas", this.id).subscribe((resultado: any) => {
        // Preguntar si se hay encontrado un document con ese ID
        if (resultado.payload.data() != null) {
          this.document.id = resultado.payload.id
          this.document.data = resultado.payload.data();
          // Copiamos los datos al objeto tareaEditando para permitir la modificación
          this.tareaEditando = { ...this.document.data };
        } else {
          // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
          this.document.data = {} as Tarea;
          this.tareaEditando = {} as Tarea;
        }
      });
    } else {
      this.id = "";
    }
  }

  clickBotonBorrar() {
    this.firestoreService.borrar("tareas", this.id).then(() => {
      console.log('Tarea borrada correctamente!');
      this.tareaEditando = {} as Tarea;
      this.id = "";
    }, (error) => {
      console.error(error);
    });
  }

  guardarCambios() {
    // Implementa la lógica para guardar los cambios en la base de datos
    console.log('Cambios guardados:', this.tareaEditando);

    // Puedes agregar aquí la lógica para actualizar la tarea en la base de datos
    this.firestoreService.modificar("tareas", this.id, this.tareaEditando).then(() => {
      console.log('Tarea modificada correctamente!');
    }, (error) => {
      console.error(error);
    });

    // Después de guardar, oculta el formulario
    this.mostrarFormulario = false;
  }
}
