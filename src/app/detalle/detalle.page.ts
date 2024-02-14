import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Vehiculo } from '../vehiculo';
import { AlertController } from '@ionic/angular';

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
    vehiculo: {} as Vehiculo
  };

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private firestoreService: FirestoreService, private alertController: AlertController) {}

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
      this.editar = this.activatedRoute.snapshot.paramMap.get('editar') === 'true';

      if (this.id === 'nuevo') {
        // Mostrar el formulario si se está creando un vehículo nuevo
        this.mostrarFormulario = true;
      } else {
        // Consultar la base de datos para obtener los detalles del vehículo existente
        this.firestoreService.consultarPorId("vehiculos", this.id).subscribe((resultado: any) => {
          if (resultado.payload.data() != null) {
            this.document.vehiculo = resultado.payload.data();
          } else {
            this.document.vehiculo = {} as Vehiculo;
          }
        });
      }

      if (this.editar) {
        this.mostrarFormulario = true;
      }
    } else {
      this.id = "";
    }
  }

  async confirmarBorrado() {
    const alert = await this.alertController.create({
      header: 'Confirmar borrado',
      message: '¿Estás seguro de que quieres borrar este vehículo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Borrar',
          handler: () => {
            this.borrarVehiculo(); // Llama a la función de borrado si el usuario confirma
          }
        }
      ]
    });

    await alert.present();
  }

  borrarVehiculo() {
    this.firestoreService.borrar("vehiculos", this.id).then(() => {
      console.log('Vehiculo borrado correctamente!');
      this.document.vehiculo = {} as Vehiculo;
      this.id = "";
      // Redirigir a la página de inicio después de borrar
      this.router.navigate(['/home']);
    }, (error) => {
      console.error(error);
    });
  }

  clickBotonInsertar() {
    this.firestoreService.insertar("vehiculos", this.document.vehiculo).then(() => {
      console.log('Vehículo añadido!');
      this.document.vehiculo = {} as Vehiculo;
      this.mostrarFormulario = false;
      // Redirigir a la página de inicio después de guardar
      this.router.navigate(['/home']);
    }, (error) => {
      console.error(error);
    });
  }

  guardarCambios() {
    console.log('Cambios guardados:', this.document.vehiculo);

    if (this.id === 'nuevo') {
      // Insertar un nuevo vehículo si el ID es 'nuevo'
      this.firestoreService.insertar("vehiculos", this.document.vehiculo).then(() => {
        console.log('Vehículo añadido correctamente!');
        this.mostrarFormulario = false; // Ocultar el formulario después de guardar
        // Navegar a la página de inicio después de guardar los cambios
        this.router.navigate(['/']);
      }, (error) => {
        console.error(error);
      });
    } else {
      // Actualizar el vehículo existente si el ID no es 'nuevo'
      this.firestoreService.modificar("vehiculos", this.id, this.document.vehiculo).then(() => {
        console.log('Vehiculo modificado correctamente!');
        this.mostrarFormulario = false; // Ocultar el formulario después de guardar
      }, (error) => {
        console.error(error);
      });
    }
  }
}
