import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VideoUploadService {

  chunksQueue = new Array();
  chunkSize = 1024 * 1024 * 1;
  current_progress = 0;

  private outputSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  output: Observable<any> = this.outputSubject.asObservable();

  send(data: any) {
    this.outputSubject.next(data);
  }

  constructor(private http: HttpClient) { }


  checkVideoSizeAndDuration(file: File) {

    return new Promise((resolve, reject) => {

      var video = document.createElement('video');
      video.preload = 'metadata';
      window.URL.revokeObjectURL(video.src); //garbageCollector
      video.onloadedmetadata = function () {
        var duration = video.duration;
        console.log('duration', duration);
        if (duration > 61) {
          reject({duration: 'Video süresi 1 dk dan fazla olamaz'});
        }
        var size = file.size / 1024 / 1024; //in mb
        if (size > 500) {
          reject({size: 'Video büyük'});
        }
        resolve({message : 'OK'});
      }

      video.src = URL.createObjectURL(file); // non appended video element

    });

    
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
      if(chunkNumber === 0) {
        this.send(1);
      } else {
        this.send( Math.ceil(100 *(chunkNumber / this.chunksQueue.length)));
      }

      this.http.post('http://157.230.187.83:8080/upload/video', formData).subscribe(
        data => {
          console.log('success', data['status']);
          console.log('success 2', data);
          if (data['status'] === 'Upload') {
            this.upload(file);
          } else if (data['status'] === 'Finished') {
            this.send('Finished');
          }
        },
        error => {
          console.log('error', error);
          this.send('ERROR');
        }
      );



    }
  }


}
