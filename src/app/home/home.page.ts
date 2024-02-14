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

  clickBotonInsertar(){
    this.firestoreService.insertar("vehiculos", this.vehiculoEditando).then(() => {
    console.log('Vehículo añadido!');
    this.vehiculoEditando= {} as Vehiculo;
    this.mostrarFormulario = false;
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


  selecNuevo() {
    // Redirigir a la página de detalles con la indicación de que estamos agregando un nuevo vehículo
    this.router.navigate(['detalle', 'nuevo']);
  }
  }