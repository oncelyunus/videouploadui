import { Component, OnInit, OnDestroy} from '@angular/core';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { VideoUploadService } from '../video-upload.service';
import { SubscriptionLike as ISubscription } from "rxjs";

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css'],
  providers: [VideoUploadService]
})
export class ApplicationFormComponent implements OnInit, OnDestroy {
  closeResult: string;
  model: NgbDateStruct;
  sub: ISubscription;
  show : Boolean = false;
  progressCount: Number = 0;
  date: {year: number, month: number};

  constructor(private videoUploadService: VideoUploadService, 
    private calendar: NgbCalendar,
     private modalService: NgbModal) { }

  ngOnInit() {
    this.sub = this.videoUploadService.output.subscribe(v => {
      if(v) {
        if(v === 'ERROR') {

        } else if(v === 'Finished') {
          
        } else {
          this.progressCount = v;
          if(this.progressCount > 100) {
              this.progressCount = 100;
          }
        }
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  open(content) {
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  fileUpload(event) {
    var file = event.target.files[0]; 
    //this.videoUploadService.checkVideoSizeAndDuration(file);
    this.show = true;
    this.videoUploadService.prepareUpload(file);

  }

}
