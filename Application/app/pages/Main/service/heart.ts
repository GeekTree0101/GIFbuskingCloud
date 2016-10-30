import {ViewController, NavController, Alert, Events, Toast} from 'ionic-angular';
import {Input, Output, Component, HostListener} from '@angular/core'; 

//HTTP protocol
import {HttpProtocalService} from '../../../service/HttpProtocol';

@Component({
    templateUrl : 'build/pages/Main/directive/heart.html',
    providers : [HttpProtocalService]
})
export class heart_page{

    private NFC_ID : any;

    private GET_DATA = {
        flag : false,                    //Bit coin I/O controll
        data : null                      //Server Infomation
    }

    private custom_coin = 888;           //User Want to send money
    private user_coin = 13701;           //user money

    private donation_method = [
        {
            image : "image/ionic.png",
            name : "Like"
        },
        {
            image : "image/ionic.png",
            name : "100 coin"
        },
        {
            image : "image/ionic.png",
            name : "1000 coin"
        },
        {
            image : "image/ionic.png",
            name : "10000 coin"
        },
        {
            image : "image/ionic.png",
            name : " coin"
        },                        
    ]

    constructor(private ctrl :ViewController, 
                private nav : NavController,
                private http : HttpProtocalService,
                public event : Events)
    {
         this.NFC_ID = "Please pus [PUSH] button!";       

    }


    @Input() close(){
        navigator.vibrate(200);
        this.ctrl.dismiss();
    }

    @Input() coin_size_up(touch : boolean, index :number){

        navigator.vibrate(200);
        if(touch){
            this.custom_coin++;
        }
        else{
            this.custom_coin = index;
        }
    }

    @HostListener('press',['$event']) press_coin_size_up(event){
        navigator.vibrate(50);
        if(event.target.className == "resize_coin"){

            this.coin_size_up(true,0);
        }
    }

    @Output() NFCrun(){
         
        //TODO : start NFC activity
        navigator.vibrate(200);
        (<any>window).nfc.addTagDiscoveredListener(
            (data) =>{
              //callback data -> nfc infomation
              
              let ID_array = data.tag.id;
              let ID_value = "";
              
              for(var i = 0; i < ID_array.length; i++){
                    //Integer to Hex code
                    if(ID_array[i] < 0){
                        ID_array[i] = ID_array[i] + 256;   
                    }
                    ID_array[i] = ID_array[i].toString(16);
                    ID_value += ID_array[i].toUpperCase();   
              }
              
              //return nfc id to VIEW component
              this.NFC_ID = ID_value;
              this.Get();
              
            },
            (sucess) => {
                // nfc listenner commit!
                console.log(sucess);
                this.informationAlert("closeYourCard");
            },
            (err) => {
                // Must Check NFC activatied!
                console.log(err);
                this.informationAlert("failed");
                
            }
        )
    }
    
    @Output() Get(){
        
        if(this.NFC_ID != null){
            
            let token = this.NFC_ID;
            this.http.GET("JSON","http://192.168.1.13:3000/nfc", token);   
            
            this.event.subscribe("GET",
            
            (data) => { //Async Event
                console.log("[+] Succes GET data");
                this.GET_DATA.data = data;
                this.GET_DATA.flag = true; //Show UI
                this.Bit_coin_toast(true);
            },
            (err) => {
                console.log(err);
                this.Bit_coin_toast(false);
            }
            )
            
        }
        else{
            this.informationAlert("closeYourCard");
        }
    }
    
    informationAlert(target){
        
        //TODO : Popup aler
     
        let failed = Alert.create({
           title : 'Confirm NFC module state',
           message : 'you must check NFC module P2P receive state!',
           buttons :[
               {
                   text: "Open",
                   handler: () => {
                       console.log("[+] open NFC module setting!");
                       (<any>window).nfc.showSettings(
                           () => {console.log("success"); },
                           () => {this.informationAlert("noNFC");}
                       );                 
                   }
               },
               {
                  text: "Cancel",
                  handler : () => {
                      console.log("[+] user don't want nfc activaty!");  
                  }
               }
           ] 
        });
        
        let closeYourCard = Alert.create({
            title : "태그해주세요~",
            message :"휴대폰으로 버스킹클라우드에 살짝 터치해주세요",
            buttons :["OK"]
        })
        
        
        let noNFC = Alert.create({
            title : "No NFC module!",
            message : "This device dose not support NFC",
            buttons : ["OK"]
        });
        
        
        navigator.vibrate(200);
        if(target == "failed"){        
            this.nav.present(failed);
        }
        else if(target == "noNFC"){           
            this.nav.present(noNFC);
        }
        else if(target == "closeYourCard"){
            this.nav.present(closeYourCard);
        }
        
    }

    Bit_coin_toast(flag : boolean){
      
      let message_value = "비트코인을 " + this.custom_coin + " 만큼 기부하였습니다." 

      if(flag){
   
        if(this.custom_coin == 0){
            message_value = "좋아요를 기부하셨습니다.";
        }

      }
      else{
          message_value = "서버상태가 원활하지 않습니다.";
      }
      let make = Toast.create({

          message : message_value,
          duration : 3000,
          position : 'top',
          showCloseButton : true,
          closeButtonText : "OK"
      });
      navigator.vibrate(200);
      this.nav.present(make);
    }    
}