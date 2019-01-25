import { Component, VERSION, Inject } from '@angular/core';
import { HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  url = 'http://localhost:8080/upload/'
  title = 'videoUpload';
  percentDone: number;
  uploadSuccess: boolean;
  version = VERSION;
  chunksQueue = new Array();
  chunkSize = 1024 * 1024 * 1;

  constructor(
    private http: HttpClient
  ) { }

  start(files: File[]) {
    console.log('burada');
    var file: any = files[0];
    /*try {
      this.checkVideoSizeAndDuration(file);
    } catch (err) {
      alert(err.message);
    }*/

    this.prepareUpload(file);
  }

  checkVideoSizeAndDuration(file: any) {
    var video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src); //garbageCollector
      var duration = video.duration;
      console.log('duration', duration);
      if (duration > 61) {
        throw 'Video süresi 4 dk dan fazla olamaz';
      }
      var size = file.size / 1024 / 1024; //in mb
      if (size > 500) {
        throw 'Yok artik zamk';
      }
    }

    video.src = URL.createObjectURL(file); // non appended video element
  }

  prepareUpload(file: any) {

    if (!file) {
      throw 'Cant start uploading. No file';
    }


    const chunksQuantity = Math.ceil(file.size / this.chunkSize);
    this.chunksQueue = new Array(chunksQuantity).fill(0).map((_, index) => index).reverse();

    console.log('chunkSize', this.chunkSize);
    console.log('chunksQuantity', chunksQuantity);
    console.log('chunksQueue', this.chunksQueue);

    this.upload(file);

  }

  upload(file: any) {
    var chunkNumber = this.chunksQueue.pop();
    var chunkLength = chunkNumber * this.chunkSize;
    var func = (file.slice ? 'slice' : (file.mozSlice ? 'mozSlice' : (file.webkitSlice ? 'webkitSlice' : 'slice')));
    var chunk = file[func](chunkLength, chunkLength + this.chunkSize);
    var fileSize = file.size;


    if (chunkNumber !== undefined) {
      console.log('chunkNumber ', chunkNumber);
      console.log('chunkLength ', chunkLength);
      console.log('chunkLength + this.chunkSize', chunkLength + this.chunkSize);
      console.log('func ', func);
      console.log('fileSize ', fileSize);
      console.log('chunk ', chunk);
      console.log('*********************************************');

      let formData: FormData = new FormData();
      formData.append("chunkNumber", chunkNumber);
      formData.append("chunkSize", '' + this.chunkSize);
      formData.append("totalSize", fileSize);
      formData.append("identifier", fileSize + '_' + file.name);
      formData.append("fileName", file.name);
      formData.append("file", chunk);

      this.http.post('http://localhost:8080/upload/video', formData).subscribe(
        data => {
          console.log('success', data['status']);
          console.log('success 2', data);
          if(data['status'] === 'Upload') {
            this.upload(file);
          }

        },
        error => {
          console.log('error', error);
        }
      );

    }
  }

}
