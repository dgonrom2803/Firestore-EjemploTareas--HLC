import { Component } from '@angular/core';
import { Vehiculo } from '../vehiculo';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  vehiculoEditando = {} as Vehiculo;
  arrayColeccionVehiculos: any = [{
    id: "",
    vehiculo: {} as Vehiculo
  }];

  mostrarFormulario = false;

  constructor(private firestoreService: FirestoreService, private router: Router) {
    this.obtenerListaVehiculos();
  }

  clickBotonInsertar() {
    // Insertar la tarea y obtener la respuesta
    this.firestoreService.insertar("vehiculos", this.vehiculoEditando).then((respuesta: any) => {
      console.log('Vehiculo añadido correctamente!');
      
      // Obtener el ID de la tarea recién creada
      const nuevoId = respuesta.id;

      // Limpiar tareaEditando
      this.vehiculoEditando = {} as Vehiculo;

      // Navegar a la página de detalle con el nuevo ID y el formulario para editar los detalles
      this.router.navigate(['detalle', nuevoId], { state: { editar: true } });
    }, (error) => {
      console.error(error);
    });
  }

  obtenerListaVehiculos() {
    this.firestoreService.consultar("vehiculos").subscribe((datosRecibidos) => {
      this.arrayColeccionVehiculos = [];
      datosRecibidos.forEach((datosVehiculo) => {
        this.arrayColeccionVehiculos.push({
          id: datosVehiculo.payload.doc.id,
          vehiculo: datosVehiculo.payload.doc.data()
        })
      });
    });
  }

  selecVehiculo(idVehiculo:string, vehiculoSelec: Vehiculo){
    this.vehiculoEditando = vehiculoSelec;
    // Aquí podrías redirigir a la página de detalle para esta tarea
    this.router.navigate(['detalle', idVehiculo]);
  }


selecNuevo(){

  this.router.navigate(['detalle', 'nuevo'])  ;
}}