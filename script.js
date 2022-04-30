
    let imgInput = document.getElementById('imageInput');
    var canvas = new fabric.Canvas('myCanvas');
  imgInput.addEventListener('change', function(e) {
    if(e.target.files) {
      let imageFile = e.target.files[0]; //here we get the image file
      var reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = function (e) {
        var myImage = new Image(); // Creates image object
        myImage.src = e.target.result; // Assigns converted image to image object
        myImage.onload = function(ev) {
          
          console.log(myImage.width,typeof(myImage.height));
          fabric.Image.fromURL(myImage.src, function (img){
            console.dir(img)
            img.scaleX=400/myImage.width;
            img.scaleY=400/myImage.height;
            // img.scaleToWidth(400);
            canvas.add(img);
        });
         
          
        }
      }
    }
  });


  canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 1) zoom = 1;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
    var vpt = this.viewportTransform;
    if (zoom < 4 / 10) {
      vpt[4] = 80 - 400 * zoom / 2;
      vpt[5] = 80 - 400 * zoom / 2;
    } else {
      if (vpt[4] >= 0) {
        vpt[4] = 0;
      } else if (vpt[4] < canvas.getWidth() - 400 * zoom) {
        vpt[4] = canvas.getWidth() - 400 * zoom;
      }
      if (vpt[5] >= 0) {
        vpt[5] = 0;
      } else if (vpt[5] < canvas.getHeight() - 400 * zoom) {
        vpt[5] = canvas.getHeight() - 400 * zoom;
      }
    }
})
canvas.on('mouse:down', function(opt) {
    var evt = opt.e;
    if (evt.altKey === true) {
      this.isDragging = true;
      this.selection = false;
      this.lastPosX = evt.clientX;
      this.lastPosY = evt.clientY;
    }
  });
  canvas.on('mouse:move', function(opt) {
    if (this.isDragging) {
      var e = opt.e;
      var zoom = canvas.getZoom();
      var vpt = this.viewportTransform;
      if (zoom < 0.4) {
        vpt[4] = 200 - 1000 * zoom / 2;
        vpt[5] = 200 - 1000 * zoom / 2;
      } else {
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        if (vpt[4] >= 0) {
          vpt[4] = 0;
        } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
          vpt[4] = canvas.getWidth() - 1000 * zoom;
        }
        if (vpt[5] >= 0) {
          vpt[5] = 0;
        } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
          vpt[5] = canvas.getHeight() - 1000 * zoom;
        }
      }
      this.requestRenderAll();
      this.lastPosX = e.clientX;
      this.lastPosY = e.clientY;
    }
  });
  canvas.on('mouse:up', function(opt) {
    this.setViewportTransform(this.viewportTransform);
    this.isDragging = false;
    this.selection = true;
  });
  