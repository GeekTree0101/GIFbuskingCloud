import {ViewController} from 'ionic-angular';
import {Input, Output, Component} from '@angular/core'; 

@Component({
    templateUrl : 'build/pages/Main/directive/user.html'
})
export class user_page{

    private user_name = JSON.parse(localStorage.getItem("userdata")).ID

    constructor(private view :ViewController){}

    @Input() close(){

        navigator.vibrate(200);   
        this.view.dismiss();
    }

    @Output() logout(){

        navigator.vibrate(200);
        console.log("[-] User Logout");
        localStorage.removeItem("userdata");

        setTimeout(()=>{
            window.location.reload();
        },2000);
    }
}