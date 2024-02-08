import { Component, OnInit } from '@angular/core';
import { Vehiculo } from '../vehiculo';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  id: string = "";
  mostrarFormulario = false;
  editar: boolean = false;

  document: any = {
    id: "",
    data: {} as Vehiculo
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService) {
  }

  ngOnInit() {
    // Se almacena en una variable el id que se ha recibido desde la página anterior
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;

      // Verificar si se debe abrir el formulario para editar directamente
      this.editar = this.activatedRoute.snapshot.paramMap.get('editar') === 'true';

      // Si el ID es 'nuevo', inicializamos una nueva tarea
      if (this.id === 'nuevo') {
        this.document.vehiculo = {} as Vehiculo;
      } else {
        // Consultar la base de datos para obtener los datos asociados a esa id
        this.firestoreService.consultarPorId("vehiculos", this.id).subscribe((resultado: any) => {
          // Preguntar si se hay encontrado un documento con ese ID
          if (resultado.payload.data() != null) {
            this.document.vehiculo = resultado.payload.data();
          } else {
            // No se ha encontrado un documento con ese ID.
            this.document.vehiculo = {} as Vehiculo;
          }
        });
      }

      // Si se debe abrir el formulario para editar, establecer la variable editar en true
      if (this.editar) {
        this.editar = true;
      }
    } else {
      this.id = "";
    }
  }

  clickBotonBorrar() {
    this.firestoreService.borrar("vehiculos", this.id).then(() => {
      console.log('Vehiculo borrado correctamente!');
      this.document.vehiculo = {} as Vehiculo;
      this.id = "";
    }, (error) => {
      console.error(error);
    });
  }

  guardarCambios() {
    // Implementa la lógica para guardar los cambios en la base de datos
    console.log('Cambios guardados:', this.document.vehiculo);

    // Puedes agregar aquí la lógica para actualizar la tarea en la base de datos
    this.firestoreService.modificar("vehiculos", this.id, this.document.vehiculo).then(() => {
      console.log('Vehiculo modificada correctamente!');
    }, (error) => {
      console.error(error);
    });

    // Después de guardar, oculta el formulario
    this.mostrarFormulario = false;
  }
}
