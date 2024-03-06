import { CallNumber } from '@ionic-native/call-number/ngx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  constructor(private callNumber: CallNumber) { }

  ngOnInit() {
    
  }

  realizarLlamada(numero: string) {
    this.callNumber.callNumber(numero, true)
      .then(res => console.log('Llamada iniciada con éxito', res))
      .catch(err => console.log('Error al iniciar la llamada', err));
  }

 
}
