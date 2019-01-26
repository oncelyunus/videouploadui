import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoUploadService {

  constructor() { }

  
  checkVideoSizeAndDuration(file: File) {
    var video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src); //garbageCollector
      var duration = video.duration;
      console.log('duration', duration);
      if (duration > 61) {
        alert('Video süresi 4 dk dan fazla olamaz');
        return;
      }
      var size = file.size / 1024 / 1024; //in mb
      if (size > 500) {
        alert('Yok artik zamk');
        return;
      }
    }

    video.src = URL.createObjectURL(file); // non appended video element
  }

}
