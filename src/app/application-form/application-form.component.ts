import { Component, OnInit } from '@angular/core';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { VideoUploadService } from '../video-upload.service';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements OnInit {
  closeResult: string;
  model: NgbDateStruct;
  date: {year: number, month: number};

  constructor(private videoUploadService: VideoUploadService, 
    private calendar: NgbCalendar,
     private modalService: NgbModal) { }

  ngOnInit() {
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
    alert('file selected');
    var file = event.target.files[0]; 
    this.videoUploadService.checkVideoSizeAndDuration(file);
  }

}
