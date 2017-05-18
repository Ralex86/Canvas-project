window.CS = {}; // namespace avoid conflicting with other functions

CS.init = function() {
  var self = this;

  this.canvas = document.getElementById("canvas");
  this.ctx = canvas.getContext('2d');
  this.width = canvas.width;
  this.height = canvas.height;

  this.shapeList = [];

  //handler for the drag and drop function
  this.moveHandler = null;
  this.upHandler = null;

  // this.drawRectangle(this.ctx);
  // this.drawCircle(this.ctx);

  // this.canvas.onclick = function(){
  //   self.clearCanvas();
  // }

  // this.drawCurves(this.ctx);
  // this.drawText(this.ctx);

  // canvas.onclick = function(e){ // e = event passed in
  //   console.log(e.offsetX, e.offsetY);
  //   var square = new CS.Square(
  //     e.offsetX,e.offsetY, 40, self.ctx // remember we loose the scope of what this refers to so we use self
  //   );
  //   square.render();
  //   self.shapeList.push(square);
  // };

  //this.generateRandomSquares();

  this.generateCv();
  this.setupEvents();
  this.render();

}

CS.startDrag = function (e){
  var self = this;

  var shapes = this.getShapesAtXY(e.offsetX, e.offsetY);
  if(shapes.length){ // only if we have a none empty array of rectangles
    var selectedShape = shapes[shapes.length - 1]; // last element of the array of rectangles clicked
    selectedShape.selected = true;

    this.moveHandler = function(e){
      self.dragShape(selectedShape, e.offsetX, e.offsetY)
    };

    this.upHandler = function(e){
      self.stopDrag(selectedShape);
    };

    this.canvas.addEventListener('mousemove', this.moveHandler, false); // better than onemousemove because can remove a listener with addEvent...
    this.canvas.addEventListener('mouseup', this.upHandler, false);
  }
  this.render();
}

CS.dragShape = function(shape, x, y){
  shape.move(x - shape.size/2, y - shape.size/2);
  this.render();
}

CS.stopDrag = function(shape){
  shape.selected = false;
  this.canvas.removeEventListener('mousemove', this.moveHandler, false);
  this.canvas.removeEventListener('mouseup', this.upHandler, false);
  this.render();
}

CS.setupEvents = function(){
  var self = this;
  this.canvas.addEventListener('mousedown', function (e){
    self.startDrag(e);
  })
}

CS.getShapesAtXY = function(x, y){
  var validShapes = [];
  for(index in this.shapeList){
    var shape = this.shapeList[index];
    var startX = shape.x;
    var endX = shape.x + shape.size;
    var startY = shape.y;
    var endY = shape.y + shape.size;

    if (x >= startX && x <= endX && y >= startY && y <= endY){
      validShapes.push(shape);
    }
  }
  return validShapes;
}

CS.generateRandomSquares = function(){
   for (var i = 0; i < 4; i++) {
     var randX = Math.floor(Math.random()*this.width);
     var randY = Math.floor(Math.random()*this.height);
     var randSize = 20;//Math.floor(Math.random()*60) + 20;

     var square = new CS.Square(randX, randY, randSize, this.ctx);
     this.shapeList.push(square);
   }
}

CS.generateCv = function(){
  for (var i = 0; i < 4; i++) {
    var randX = Math.floor(Math.random()*this.width);
    var randY = Math.floor(Math.random()*this.height);
    var randSize = 20;//Math.floor(Math.random()*60) + 20;

    var cv = new CS.Cv(randX, randY, randSize, this.ctx);
    this.shapeList.push(cv);
  }
}

CS.connectCvTogether = function(ctx){
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.shapeList[0].x + this.shapeList[0].size/2, this.shapeList[0].y  + this.shapeList[0].size/2);
    console.log(this.shapeList[0].x, this.shapeList[0].y)
    ctx.lineTo(this.shapeList[1].x  + this.shapeList[1].size/2, this.shapeList[1].y  + this.shapeList[1].size/2);
    ctx.lineTo(this.shapeList[2].x + this.shapeList[2].size/2, this.shapeList[2].y + this.shapeList[2].size/2);
    ctx.lineTo(this.shapeList[3].x + this.shapeList[3].size/2, this.shapeList[3].y + this.shapeList[3].size/2);
    ctx.stroke();
}

CS.render = function(){
  this.ctx.clearRect(0,0,this.width, this.height);
  for (index in this.shapeList){
    this.shapeList[index].render();
  }

  var x1 = this.shapeList[0].x + this.shapeList[0].size/2;
  var x2 = this.shapeList[1].x + this.shapeList[1].size/2;
  var x3 = this.shapeList[2].x + this.shapeList[2].size/2;
  var x4 = this.shapeList[3].x + this.shapeList[3].size/2;

  var y1 = this.shapeList[0].y + this.shapeList[0].size/2;
  var y2 = this.shapeList[1].y + this.shapeList[1].size/2;
  var y3 = this.shapeList[2].y + this.shapeList[2].size/2;
  var y4 = this.shapeList[3].y + this.shapeList[3].size/2;

  this.drawBezierCurve(x1, y1, x2, y2, x3, y3, x4, y4, this.ctx);
  this.connectCvTogether(this.ctx);
}


CS.Square = function (x, y, size, ctx){
  this.x = x;
  this.y = y;
  this.size = size;
  this.ctx = ctx;
  this.color = '#' + Math.floor(
    Math.random()*16777215 // max color avaible
  ).toString(16); // convert in hexa
  this.selected = false;
}

CS.Square.prototype.render = function(){
  this.ctx.beginPath();
  this.ctx.rect(
    this.x, this.y, this.size, this.size
  );
  this.ctx.closePath();
  if (this.selected){
    this.ctx.strokeStyle = "#FF0000";
    this.ctx.lineWidth = 8;
    this.ctx.stroke();
  }
  this.ctx.fillStyle = this.color;
  this.ctx.fill();
}

// to avoid recreating the move method every time
// method is shared (heritage)
// more efficient
CS.Square.prototype.move = function (newX, newY){
  this.x = newX;
  this.y = newY;
}



CS.Cv = function (x, y, size, ctx){
  this.x = x;
  this.y = y;
  this.size = size;
  this.ctx = ctx;
  //this.color = 'red';
  this.selected = false;
}

CS.Cv.prototype.render = function(){
  this.ctx.beginPath();
  this.ctx.moveTo(this.x, this.y);
  this.ctx.lineTo(this.x + this.size, this.y + this.size);
  this.ctx.moveTo(this.x + this.size, this.y);
  this.ctx.lineTo(this.x, this.y + this.size);

  if (this.selected){
    this.ctx.lineWidth = 6;
    this.ctx.strokeStyle = 'blue';
    this.ctx.stroke();
  }
  else {
  this.ctx.lineWidth = 6;
  this.ctx.strokeStyle = 'red';//this.color;
  this.ctx.stroke();
  }
}

// to avoid recreating the move method every time
// method is shared (heritage)
// more efficient
CS.Cv.prototype.move = function (newX, newY){
  this.x = newX;
  this.y = newY;
}








CS.drawText = function(ctx){
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = 'italic 40px Arial';
  ctx.fillText('Hello Word' , 220, 200);
}

CS.drawCurves = function(ctx){
  ctx.beginPath();
  ctx.moveTo(90,116);
  ctx.quadraticCurveTo(190, 0, 300, 130);
  ctx.lineWidth = 15,
  ctx.strokeStyle = 'red';
  ctx.stroke();

  //bezier curve
  ctx.beginPath();
  ctx.moveTo(60,250);
  ctx.bezierCurveTo(90, 155, 305, 160, 330, 260);
  ctx.lineWidth = 15;
  ctx.strokeStyle = '#009900';
  ctx.stroke();

}

CS.drawBezierCurve = function (x1, y1, x2, y2, x3, y3, x4, y4, ctx) {
  ctx.beginPath();
  ctx.moveTo(x1,y1),
  ctx.bezierCurveTo(x2,y2, x3, y3, x4, y4);
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

// CS.clearCanvas = function() {
//   this.ctx.clearRect(0,0,this.width, this.height);
// }

// CS.drawLines = function(ctx){
//   ctx.strokeStyle = '#990000';
//   ctx.beginPath();
//   ctx.moveTo(0, this.height/2);
//   ctx.lineTo(this.width, this.height/2);
//   ctx.stroke();
// }

CS.drawRectangle = function(ctx){ // passing ctx is usefull
  ctx.beginPath();
  ctx.rect(70,320,200,160) // x, y, width, height
  ctx.fillStyle = '#000099';
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#000066';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

CS.drawCircle = function(ctx){
  //ctx.arc(centerX, centerY, radius, startingDegrees, endDegrees, anti)
  ctx.beginPath();
  ctx.arc(this.width/2, this.height/2, 70, 0, 0.5*Math.PI, false);
  ctx.lineTo(this.width/2, this.height/2);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0,128,0,0.5)';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#006600';
  ctx.stroke();

}
