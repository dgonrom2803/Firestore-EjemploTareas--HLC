import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Vehiculo } from '../vehiculo';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  id: string = "";
  mostrarFormulario = false;
  editar: boolean = false;
  imagenSelec: string = "";

  document: any = {
    id: "",
    vehiculo: {} as Vehiculo
  };

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private firestoreService: FirestoreService, private alertController: AlertController, private loadingController: LoadingController, private toastController: ToastController, private imagePicker: ImagePicker) {}

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
        this.router.navigate(['/home']);
      }, (error) => {
        console.error(error);
      });
    } else {
      // Actualizar el vehículo existente si el ID no es 'nuevo'
      this.firestoreService.modificar("vehiculos", this.id, this.document.vehiculo).then(() => {
        console.log('Vehiculo modificado correctamente!');
        this.mostrarFormulario = false; // Ocultar el formulario después de guardar
        // Si estás en modo de edición, redirigir a la página de inicio después de guardar los cambios
        if (this.editar) {
          this.router.navigate(['/home']);
        }
      }, (error) => {
        console.error(error);
      });
    }
  }
  
  async seleccionarImagen(){
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result)=>{
        //  Si no tiene permiso de lectura se soilicta al usuario
        if(result == false){
          this.imagePicker.requestReadPermission();
        }else{
          // Abrir el selector de imagenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount : 1, // Permitir sólo 1 imagen
            outputType: 1          // 1 = Base64
          }).then(
            (results) => {  // En la variable results se tienen las imágenes seleccionadas
              if(results.length > 0) {  // Si el usuario ha elegido alguna imagen
                // EN LA VARIABLE imagenSelec QUEDA ALMACENADA LA IMAGEN SELECCIONADA
                this.imagenSelec="data:image/jpeg;base64,"+results[0];
                console.log("Imagen que se ha seleccionado (en Base64): "+ this.imagenSelec);
                this.subirImagen(); // Llama a subirImagen después de seleccionar la imagen
              }
            }, 
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
}


  async subirImagen(){
    // Mensaje de espera  mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait...'
  });
  // Mensaje de finalización de subida de la imagen
  const toast = await this.toastController.create({
    message: 'Image uploaded successfully',
    duration: 3000
  });

  // Carpeta del Storage donde se almacenará la imagen
  let nombreCarpeta = "imagenes";

  // Mostrar el mensaje de espera
  loading.present();

  // Asignar el nombre de la imagen en función de la hora actual para 
  // evitar duplicidades de nombres
  let nombreImagen = `${new Date().getTime()}`;
  // Llamar al método que sube la imagen al Storage
  this.firestoreService.subirImagenBase64(nombreCarpeta,nombreImagen, this.imagenSelec)
  .then(snapshot => {
    snapshot.ref.getDownloadURL()
    .then( downloadURL => {
      // EN LA VARIABLE downloadURL SE OBTIENE LA DIRECCIÓN URL DE LA IMAGEN
      console.log("downloadURL:" + downloadURL);
      this.document.vehiculo.imagenURL = downloadURL;
      // Mostrar el mensaje de finalización de la subida
      toast.present();
      // Ocultar el mensaje de espera
      loading.dismiss();
    })
  })
}

async eliminarArchivo (fileURL:string) {
  const toast = await this.toastController.create({
    message: 'File was deleted succesfully',
    duration: 3000
  });
  this.firestoreService.eliminarArchivoPorURL(fileURL)
  .then(()=>{
    toast.present();
    }, (err) => {
      console.log(err);
    });
}
async share(){
await Share.share({
  text: "Vehiculo: " + this.document.vehiculo.modelo + " Avería: " + this.document.vehiculo.averia,
  
});
}
eliminarImagen() {
  // Obtener la URL de la imagen
  const imagenURL = this.document.vehiculo.imagenURL;

  // Mostrar un mensaje de confirmación antes de eliminar la imagen
  this.presentConfirm('Confirmar eliminación', '¿Estás seguro de que quieres borrar esta imagen?', () => {
    // Llamar al método para eliminar la imagen del Firestore y del almacenamiento
    this.firestoreService.eliminarArchivoPorURL(imagenURL).then(() => {
      // Eliminar la URL de la imagen del vehículo
      this.document.vehiculo.imagenURL = "";
      console.log('Imagen borrada correctamente!');
    }).catch((error) => {
      console.error('Error al borrar la imagen:', error);
    });
  });
}

async presentConfirm(header: string, message: string, callback: () => void) {
  const alert = await this.alertController.create({
    header: header,
    message: message,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Confirmar',
        handler: callback
      }
    ]
  });

  await alert.present();
}

}
