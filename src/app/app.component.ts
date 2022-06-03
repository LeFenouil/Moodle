import { Component } from '@angular/core';
import { AuthService } from './services/auths/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'UPJV';

  constructor(public authService : AuthService){}
}


