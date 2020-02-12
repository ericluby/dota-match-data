const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const gameData = require('./generatedPlayerInfo.json');
const heroes = require('./dotaHeroIDs.json');
gameToImage(gameData);

async function gameToImage(gameData){
  const canvas = createCanvas(450, 300);
  const context = canvas.getContext('2d');

//gradient background
  context.rect(0, 0, canvas.width, canvas.height);
  // add linear gradient
  var grd = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  // light blue
  grd.addColorStop(0, '#8ED6FF');
  // dark blue
  grd.addColorStop(1, '#004CB3');
  context.fillStyle = grd;
  context.fill();
  //call text creator function
  text(context, 50, 100, "the awesome!");
  //call image creator function
  await image(context, {x: 50, y: 50, w: 40, h: 40}, heroes[112].icon);

  const out = fs.createWriteStream(__dirname + '/test.png');
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () =>  console.log('The PNG file was created.'));
};

//function to create an image and place it somewhere
async function image(context, {x, y, w, h}, imagePath){
  const image = await loadImage(imagePath);
  context.drawImage(image, x, y, w, h);
}

//function to create text and place it somewhere
function text(context, x, y, string, font='30px Impact', color='black'){
  context.font = font;
  context.fillStyle = color;
  context.fillText(string, x, y);
}

//banned heroes greyed out
//https://www.html5canvastutorials.com/advanced/html5-canvas-grayscale-image-colors-tutorial/
