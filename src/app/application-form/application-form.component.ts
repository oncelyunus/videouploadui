import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { VideoUploadService } from '../video-upload.service';
import { SubscriptionLike as ISubscription } from "rxjs";
import { MustMatch } from '../shared/must-match';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css'],
  providers: [VideoUploadService]
})
export class ApplicationFormComponent implements OnInit, OnDestroy {

  applicationForm: FormGroup;
  videoFile: File;
  closeResult: string;
  model: NgbDateStruct;
  sub: ISubscription;
  uploading: Boolean = false;
  videoSelected: Boolean = false;
  progressCount: Number = 0;
  date: { year: number, month: number };

  constructor(
    private videoUploadService: VideoUploadService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.sub = this.videoUploadService.output.subscribe(v => {
      if (v) {
        if (v === 'ERROR') {
          //upload error

        } else if (v === 'Finished') {
          //upload finish

        } else {
          this.progressCount = v;
          if (this.progressCount > 100) {
            this.progressCount = 100;
          }
        }
      }
    });

    this.applicationForm = this.fb.group({
      studentNameSurname: ['', [Validators.required, Validators.minLength(3)]],
      phonenumber: ['',
        [Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10)]
      ],
      studentemail: ['', [Validators.required,
      Validators.pattern("^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$")]],
      studentemailreply: ['', [Validators.required,
      Validators.pattern("^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$")]],
      schoolname: ['', [Validators.required, Validators.minLength(5)]],
      shoolCity: ['', [Validators.required]],
      shooldistrict: ['', [Validators.required]],
      studentBirthday: ['', [Validators.required]],
      conditions: [false, [Validators.required, Validators.requiredTrue]],
      useragreement: [false, [Validators.required, Validators.requiredTrue]],
      video: ['', [Validators.required]]
    }, {
        validator: MustMatch('studentemail', 'studentemailreply')
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  open(content) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
      return `with: ${reason}`;
    }
  }

  checkVideoSizeAndDuration(event) {
    this.videoFile = event.target.files[0];
    this.videoUploadService.checkVideoSizeAndDuration(this.videoFile).then(res => {
      console.log('res', res);
      console.log(this.applicationForm.value);
      this.videoSelected = true;
    }, rej => {
      this.applicationForm.get('video').setErrors(rej);
    })
  }

  fileUpload() {
    this.uploading = true;
    this.videoUploadService.prepareUpload(this.videoFile);
  }

  onSubmit() {
    console.log(this.applicationForm.value);
    
  }


  get studentNameSurname() {
    return this.applicationForm.get('studentNameSurname');
  }

  get video() {
    return this.applicationForm.get('video');
  }

  get phonenumber() {
    return this.applicationForm.get('phonenumber');
  }

  get studentemail() {
    return this.applicationForm.get('studentemail');
  }

  get studentemailreply() {
    return this.applicationForm.get('studentemailreply');
  }

  get schoolname() {
    return this.applicationForm.get('schoolname');
  }

  get shoolCity() {
    return this.applicationForm.get('shoolCity');
  }

  get shooldistrict() {
    return this.applicationForm.get('shooldistrict');
  }

  get studentBirthday() {
    return this.applicationForm.get('studentBirthday');
  }

  get conditions() {
    return this.applicationForm.get('conditions');
  }

  get useragreement() {
    return this.applicationForm.get('useragreement');
  }

}
