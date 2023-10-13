        const imageInput = document.getElementById("imageInput");

        const redrawButton = document.getElementById("redrawButton");

        const canvas1 = document.getElementById("canvas1");
        const context1 = canvas1.getContext("2d");
        canvas1.width = 640     // 640px
        canvas1.height = 480    // 480px
        var inMemoryCanvas = document.createElement('canvas');
        inMemoryCanvas.width = canvas1.width;
        inMemoryCanvas.height = canvas1.height;

        const inMemorycontext = inMemoryCanvas.getContext("2d");
        const canvas2 = document.getElementById("canvas2");
        const context2 = canvas2.getContext("2d");
        var initialImage = new Image();

        let isMouseDown = false;
        var startX, startY, endX, endY;

        const rotateButton = document.getElementById("rotateButton");
        let currentRotation = 0;
        var grey = [];
        var lamda = [];
        var lamda_cal = [];
var Phase_R_DVD = []
var Phase_G_DVD = []
var Phase_B_DVD = []
var Phase_R_CD = []
var Phase_G_CD = []
var Phase_B_CD = []

var Theta = []

const aperture_width = 2.25; 

const L_hor = parseFloat(document.getElementById("tube_length").value);

const Y_base = 2; // cm

const N = 10000;
const diammeter_CD = 12; //cm
const max_of_disk_height = 0.85; // % of diammeter
const slit_width = 0.75; // 75% of edge to edge distance at slit height
const disk_aperture = diammeter_CD/2;
const tube_diammeter = parseFloat(document.getElementById("tube_diammeter").value);

var Height_max_CD = max_of_disk_height*tube_diammeter;
const slit_align_edge_CD = diammeter_CD/4 // cm
canvas1.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    startX = e.clientX - canvas1.getBoundingClientRect().left;
    startY = e.clientY - canvas1.getBoundingClientRect().top;
    console.log("startX = "+startX+" startY = "+startY)
});

canvas1.addEventListener("mousemove", (e) => {
    if (!isMouseDown) return;
    endX = e.clientX - canvas1.getBoundingClientRect().left;
    endY = e.clientY - canvas1.getBoundingClientRect().top;
    //console.log("endX = "+endX+" endY = "+endY)
    drawSelectionBox();
});

canvas1.addEventListener("mouseup", () => {
    isMouseDown = false;
    //drawSelectionBox();
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    // Copy the selected region to the target canvas and resize it
    canvas2.width = width;
    canvas2.height = height;
    context2.drawImage(
        canvas1,
        Math.min(startX, endX),
        Math.min(startY, endY),
        width,
        height,
        0,
        0,
        canvas2.width,
        canvas2.height
    );
    const finalImage = context2.getImageData( 0, 0, canvas2.width, canvas2.height);
    console.log(finalImage.data.length);
    console.log(finalImage.data);
    console.log("endX = "+endX+" endY = "+endY+ " width = "+width+" height= "+height);
    
    let line =  parseInt(height/2); // profile the middle line
    console.log("line = "+line);
    grey = [];
    lamda = [];
    for (let i = line*width; i < line*width+width; i++) {
        const red = finalImage.data[4*i];
        const green = finalImage.data[4*i + 1];
        const blue = finalImage.data[4*i + 2];
        grey.push(rgbToGrayscale(red, green, blue));
    }
    console.log(grey);
          
          for (var n = 0; n < width; n += 1) {
              lamda.push(n);
          }
    var data1 = [{
              x: lamda,
              y: grey,
              mode: "lines+markers"
          }];
    var layout1 = {
              xaxis: {
                  //   range: [0, N],
                  title: "Index"
              },
              yaxis: {
                  //    range: [-1, 1],
                  title: "Intensity"
              },
              title: "Uncalibrated Image Profile",
              font: {
    family: 'Arial, sans-serif;',
    size: 18,
    color: '#000'
  },
          };
    Plotly.purge("plot1");

    Plotly.newPlot("plot1", data1, layout1);
        });
/*
const constraints = {
    video: {
        width: { ideal: 1920 }, // Establece la resolución deseada, por ejemplo, 1920x1080
        height: { ideal: 1080 },
    },
};

// Request access to webcam with restrictions
navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
        webcamElement.srcObject = stream;
    })
    .catch(function(error) {
        console.error('Error accessing webcam:', error);
    });
*/
   // Select DOM elements
        const webcamElement = document.getElementById('webcam');
        const captureButton = document.getElementById('captureButton');
        ////const canvas = document.getElementById('canvas');
        ////const photo = document.getElementById('photo');

        // Initialize webcam
        async function initWebcam() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });

                // Display the webcam feed in the video element
                webcamElement.srcObject = stream;
            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        }

//////////////////////////////////////////////////////////
function frame() {
            // Ensure the video stream has loaded
            if (webcamElement.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
                alert('Webcam data not ready yet. Please try again.');
                return;
            }

            // Set canvas dimensions to match video feed
            canvas1.width = webcamElement.videoWidth;
            canvas1.height = webcamElement.videoHeight;
            console.log("frame called"+ canvas1.width+ " "+ canvas1.height)

            // Draw video frame on canvas
            canvas1.getContext('2d').drawImage(webcamElement, 0, 0, canvas1.width, canvas1.height);

            // Get the photo data from the canvas
            ////const photoDataUrl = canvas1.toDataURL('image/jpeg'); // Change format as needed

            // Display the captured photo
            ////photo.src = photoDataUrl;
            ////photo.style.display = 'block';

            initialImage = context1.getImageData( 0, 0, canvas1.width, canvas1.height);
        inMemorycontext.putImageData(initialImage, 0, 0);

        ///context1.putImageData(initialImage, 0, 0);
        //context1.save();

        context1.drawImage(inMemoryCanvas, 0, 0,canvas1.width, canvas1.height);


        }

        // Initialize webcam and attach click event listener
        initWebcam().catch(console.error);
        //captureButton.addEventListener('click', capturePhoto);



        
//////////////////////////////////////////////////////////
function drawSelectionBox() {
        context1.clearRect(0, 0, canvas1.width, canvas1.height);
       if (document.getElementById("flip").checked) {
            mirrorImage(context1, inMemoryCanvas, 0, 0, true, false); // horizontal mirror
        } else if (document.getElementById("rotate").checked) {
            const angle = document.getElementById("angle").value;
            drawRotated(context1, inMemoryCanvas, canvas1.width/2, canvas1.height/2, angle)
        } else {
                    mirrorImage(context1, inMemoryCanvas, 0, 0, false, false); // horizontal mirror
        }

    
        context1.strokeStyle = "black";
        context1.lineWidth = 2;
        context1.strokeRect(Math.min(startX, endX),Math.min(startY, endY),
            Math.abs(endX - startX),Math.abs(endY - startY));
        ///context1.drawImage(inMemoryCanvas, 0, 0,canvas1.width, canvas1.height,0, 0,canvas1.width, canvas1.height);

}



//////////////////////////////////////////////////////////
function rgbToGrayscale(red, green, blue) {
    return red * .3 + green * .59 + blue * .11 
}

//////////////////////////////////////////////////////////
function rotate() {
        document.getElementById("flip").checked = false;
            context1.clearRect(0, 0, canvas1.width, canvas1.height);

    if (document.getElementById("rotate").checked) {
    const angle = document.getElementById("angle").value;
drawRotated(context1, inMemoryCanvas, canvas1.width/2, canvas1.height/2, angle)
        } else {
           drawRotated(context1, inMemoryCanvas, canvas1.width/2, canvas1.height/2, 0) 
        }
    }
//////////////////////////////////////////////////////////
function flip() {
    document.getElementById("rotate").checked = false;
            context1.clearRect(0, 0, canvas1.width, canvas1.height);
             if (document.getElementById("flip").checked) {
            mirrorImage(context1, inMemoryCanvas, 0, 0, true, false); // horizontal mirror
        } else {
                    mirrorImage(context1, inMemoryCanvas, 0, 0, false, false); // horizontal mirror
        }
        }
function mirrorImage(ctx, image, x = 0, y = 0, horizontal = false, vertical = false){
    ctx.save();  // save the current canvas state
    ctx.setTransform(
        horizontal ? -1 : 1, 0, // set the direction of x axis
        0, vertical ? -1 : 1,   // set the direction of y axis
        x + horizontal ? image.width : 0, // set the x origin
        y + vertical ? image.height : 0   // set the y origin
    );
    ctx.drawImage(image,0,0);
    ctx.restore(); // restore the state as it was when this function was called
}
//////////////////////////////////////////////////////////
function drawRotated(context, image, imageX, imageY, degrees) {
    context.save();
    context.translate(imageX, imageY);
    context.rotate(0.017453292519943295 * degrees);  // 0.017453292519943295 == Math.PI / 180
    context.drawImage(image, -0.5 * image.width, -0.5 * image.width);
    context.restore();
}

canvas1.addEventListener("mousemove", (e) => {
    if (!isMouseDown) return;
    endX = e.clientX - canvas1.getBoundingClientRect().left;
    endY = e.clientY - canvas1.getBoundingClientRect().top;
    //console.log("endX = "+endX+" endY = "+endY)
    drawSelectionBox();
});
//////////////////////////////////////////////////////////
function calibrate() {
    lamda_cal = [];
    const index1 = parseInt(document.getElementById("index1").value);
    const wavelength1 = parseFloat(document.getElementById("wavelength1").value);
    const index2 = parseInt(document.getElementById("index2").value);
    const wavelength2 = parseFloat(document.getElementById("wavelength2").value);

    
    console.log(index1 + " "+ index2 +" "+wavelength1+ " "+wavelength2);
          
          const m = (wavelength2-wavelength1)/(index2-index1);
          const b = parseFloat(wavelength1 -m*index1);
          for (var x = 0; x < lamda.length; x += 1) {
              lamda_cal.push(parseFloat(m*x + b));
          }
console.log(lamda_cal);
    var data1 = [{
              x: lamda_cal,
              y: grey,
              mode: "lines+markers"
          }];
    var layout1 = {
              xaxis: {
                  //   range: [0, N],
                  title: "Wavelength (nm)"
              },
              yaxis: {
                  //    range: [-1, 1],
                  title: "Intensity"
              },
              title: "Calibrated Image Profile",
              font: {
    family: 'Arial, sans-serif;',
    size: 18,
    color: '#000'
  },
          };
    Plotly.purge("plot1");
    Plotly.newPlot("plot1", data1, layout1);
        }

//////////////////////////////////////////////////////////

diffraction() ;
plot_tube();
plot_templete();
        
function diffraction() {
    const grating_angle = parseFloat(document.getElementById("grating_angle").value);
    
    console.log("grating_angle "+grating_angle);

const theta_i = 90 -grating_angle

const d_DVD = 740 // nm DVD

const  d_CD = 1600 // nm DVD
const lamda_R = parseFloat(document.getElementById("lamda_red").value);
const lamda_G = parseFloat(document.getElementById("lamda_green").value);
const lamda_B = parseFloat(document.getElementById("lamda_blue").value);

Phase_R_DVD = []
Phase_G_DVD = []
Phase_B_DVD = []
Phase_R_CD = []
Phase_G_CD = []
Phase_B_CD = []

Theta = []

var A = []
var phase_R_DVD_old = 10
var phase_G_DVD_old = 10
var phase_B_DVD_old = 10
var phase_R_CD_old = 10
var phase_G_CD_old = 10
var phase_B_CD_old = 10

let i = -9000;

while (i < 9000) {
  theta = i/100
  phase = Math.sin(theta_i* Math.PI /180)-Math.sin(theta* Math.PI /180)
  phase_R_DVD = phase*d_DVD/lamda_R
  phase_G_DVD = phase*d_DVD/lamda_G
  phase_B_DVD = phase*d_DVD/lamda_B
  phase_R_CD = phase*d_CD/lamda_R
  phase_G_CD = phase*d_CD/lamda_G
  phase_B_CD = phase*d_CD/lamda_B

  Phase_R_DVD.push(phase*d_DVD/lamda_R)
  Phase_G_DVD.push(phase*d_DVD/lamda_G)
  Phase_B_DVD.push(phase*d_DVD/lamda_B)
  Phase_R_CD.push(phase*d_CD/lamda_R)
  Phase_G_CD.push(phase*d_CD/lamda_G)
  Phase_B_CD.push(phase*d_CD/lamda_B)

  Theta.push(theta)
  
 

  i++;
}
var trace1 = {
x: Theta,
y: Phase_B_DVD,
  mode: 'lines',
  name: 'Blue DVD',
  line: {
    color: 'blue',
    width: 2,
    dash: 'solid'
  }
};


var trace2 = {
x: Theta,
y: Phase_G_DVD,
  mode: 'lines',
  name: 'Green DVD',
  line: {
    color: 'green',
    width: 2,
    dash: 'solid'
  }
};
var trace3 = {
x: Theta,
y: Phase_R_DVD,
  mode: 'lines',
  name: 'Red DVD',
  line: {
    color: 'red',
    width: 2,
    dash: 'solid'
  }
};

var trace4 = {
x: Theta,
y: Phase_B_CD,
  mode: 'lines',
  name: 'Blue CD',
    line: {
    color: 'blue',
    width: 2,
    dash: 'dot'
  }
};
var trace5 = {
x: Theta,
y: Phase_G_CD,
  mode: 'lines',
  name: 'Green CD',
    line: {
    color: 'green',
    width: 2,
    dash: 'dot'
  }
};
var trace6 = {
x: Theta,
y: Phase_R_CD,
  mode: 'lines',
  name: 'Red CD',
    line: {
    color: 'red',
    width: 2,
    dash: 'dot'
  }
};
var data =[trace1,trace2,trace3,trace4,trace5,trace6]
    var layout1 = {
              xaxis: {
                  //   range: [0, N],
                  title: "Angle wrt Normal (degrees)"
              },
              yaxis: {
                  //    range: [-1, 1],
                  title: "Order of Diffraction"
              },
              title: "Incident Angle wrt Normal = " + theta_i + " degrees",font: {
    family: 'Arial, sans-serif;',
    size: 18,
    color: '#000'
  },
          };
    Plotly.purge("plot_diffraction");
    Plotly.newPlot("plot_diffraction", data, layout1);
    draw_rays_CD();
    draw_rays_DVD();


plot_tube();
plot_templete();
        }
//////////////////////////////////////////////////////////
function MinAbsDifference (arr1, arr2) {
   const res = [];
   var min = 1000;
   var index_min = -1;
   for(let i = 0; i < arr1.length; i++){
      const el = Math.abs(arr1[i]  - arr2[i]);
        if (el < min){
            min = el;
            index_min = i;
    }
}
return index_min;
}

//////////////////////////////////////////////////////////
function draw_rays_CD (){
const grating_angle = parseFloat(document.getElementById("grating_angle").value);
const tube_diammeter = parseFloat(document.getElementById("tube_diammeter").value);
const L_hor = parseFloat(document.getElementById("tube_length").value);

let array_1 =  new Array(Phase_R_CD.length).fill(1);
let array_2 =  new Array(Phase_R_CD.length).fill(2);
let array_3 =  new Array(Phase_R_CD.length).fill(3);
let array_4 =  new Array(Phase_R_CD.length).fill(4);



let RedCD1_min = 90+grating_angle - Theta[MinAbsDifference(Phase_R_CD,array_1)];
let GreenCD1_min = 90+grating_angle - Theta[MinAbsDifference(Phase_G_CD,array_1)];
let BlueCD1_min = 90+grating_angle - Theta[MinAbsDifference(Phase_B_CD,array_1)];

let RedCD2_min = 90+grating_angle - Theta[MinAbsDifference(Phase_R_CD,array_2)];
let GreenCD2_min = 90+grating_angle - Theta[MinAbsDifference(Phase_G_CD,array_2)];
let BlueCD2_min =  90+grating_angle - Theta[MinAbsDifference(Phase_B_CD,array_2)];

let RedCD3_min = 90+grating_angle - Theta[MinAbsDifference(Phase_R_CD,array_3)];
let BlueCD3_min = 90+grating_angle - Theta[MinAbsDifference(Phase_B_CD,array_3)];
let RedCD4_min = 90+grating_angle - Theta[MinAbsDifference(Phase_R_CD,array_4)];
let BlueCD4_min = 90+grating_angle - Theta[MinAbsDifference(Phase_B_CD,array_4)];


console.log()



var R_CD_1 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,10],
    theta: [0,RedCD1_min],
    name: 'Red CD 1st Order',
    line: {
      color: 'red'
    }
  }

  var G_CD_1 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,10],
    theta: [0,GreenCD1_min],
    name: 'Green CD 1st Order',
    line: {
      color: 'red'
    }
  }

var B_CD_1 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,10],
    theta: [0,BlueCD1_min],
    name: 'Blue CD 1st Order',
    line: {
      color: 'blue'
    }
  }
var CD_1 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [10,10],
    theta: [RedCD1_min,BlueCD1_min],
    name: '1st Order',
    line: {
      color: 'green'
    }
  }

var R_CD_2 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,9],
    theta: [0,RedCD2_min],
    name: 'Red CD 2nd Order',
    line: {
      color: 'red'
    }
  }

var B_CD_2 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,9],
    theta: [0,BlueCD2_min],
    name: 'Blue CD 2nd Order',
    line: {
      color: 'blue'
    }
  }

  var CD_2 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [9,9],
    theta: [RedCD2_min,BlueCD2_min],
    name: '2nd Order',
    line: {
      color: 'green'
    }
  }

var R_CD_3 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,8],
    theta: [0,RedCD3_min],
    name: 'Red CD 3rd Order',
    line: {
      color: 'red'
    }
  }

var B_CD_3 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,8],
    theta: [0,BlueCD3_min],
    name: 'Blue CD 3rd Order',
    line: {
      color: 'blue'
    }
  }

var CD_3 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [8,8],
    theta: [RedCD3_min,BlueCD3_min],
    name: '3rd Order',
    line: {
      color: 'green'
    }
  }
var R_CD_4 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,7],
    theta: [0,RedCD4_min],
    name: 'Red CD 4th Order',
    line: {
      color: 'red'
    }
  }

var B_CD_4 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,7],
    theta: [0,BlueCD4_min],
    name: 'Blue CD 4th Order',
    line: {
      color: 'blue'
    }
  }
  var CD_4 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [7,7],
    theta: [RedCD4_min,BlueCD4_min],
    name: '4th Order',
    line: {
      color: 'green'
    }
  }


  var diffraction_grating =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [5,5],
    theta: [grating_angle,grating_angle+180],
    name: 'Grating',
    line: {
      color: 'gray',
      width:10
    }
}
var light =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [5,0,0,5],
    theta: [180,0,0,2*grating_angle],
    name: 'Light Beam',
    line: {
      color: 'blue',
      dash: 'dot'
    }
  }
var data =[diffraction_grating,light,R_CD_1,G_CD_1,B_CD_1,R_CD_2,B_CD_2,R_CD_3,B_CD_3,R_CD_4,B_CD_4,CD_1,CD_2,CD_3,CD_4]



var layout = {
    autosize: true,
  width: 500,
  height: 500,
  title:"Tube Length = "+L_hor+ "cm, Tube Diammeter = "+tube_diammeter+ " cm <br> Grating Angle = " + grating_angle + " degrees",
  font: {
    family: 'Arial, sans-serif;',
    size: 12,
    color: '#000'
  },
  showlegend: true,
  orientation: -90
};
Plotly.purge("draw_rays_CD");
Plotly.newPlot('draw_rays_CD', data, layout);

var update = {
  width: 800,  // or any new width
  height: 500  // " "
};

Plotly.relayout('draw_rays_CD', update);

    }
//////////////////////////////////////////////////////////
function draw_rays_DVD (){
const grating_angle = parseFloat(document.getElementById("grating_angle").value);
const tube_diammeter = parseFloat(document.getElementById("tube_diammeter").value);
const L_hor = parseFloat(document.getElementById("tube_length").value);

let array_1 =  new Array(Phase_R_DVD.length).fill(1);
let array_2 =  new Array(Phase_R_DVD.length).fill(2);
let array_3 =  new Array(Phase_R_DVD.length).fill(3);
let array_4 =  new Array(Phase_R_DVD.length).fill(4);



let RedDVD1_min = 90+grating_angle - Theta[MinAbsDifference(Phase_R_DVD,array_1)];
let GreenDVD1_min = 90+grating_angle - Theta[MinAbsDifference(Phase_G_DVD,array_1)];
let BlueDVD1_min = 90+grating_angle - Theta[MinAbsDifference(Phase_B_DVD,array_1)];
let RedDVD2_min = 90+grating_angle - Theta[MinAbsDifference(Phase_R_DVD,array_2)];
let BlueDVD2_min =  90+grating_angle - Theta[MinAbsDifference(Phase_B_DVD,array_2)];
let GreenDVD2_min =  90+grating_angle - Theta[MinAbsDifference(Phase_G_DVD,array_2)];

let RedDVD3_min = 90+grating_angle - Theta[MinAbsDifference(Phase_R_DVD,array_3)];
let BlueDVD3_min = 90+grating_angle - Theta[MinAbsDifference(Phase_B_DVD,array_3)];
let RedDVD4_min = 90+grating_angle - Theta[MinAbsDifference(Phase_R_DVD,array_4)];
let BlueDVD4_min = 90+grating_angle - Theta[MinAbsDifference(Phase_B_DVD,array_4)];



console.log("The index of minRedDVD1:", RedDVD1_min);



var R_DVD_1 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,10],
    theta: [0,RedDVD1_min],
    name: 'Red DVD 1st Order',
    line: {
      color: 'red'
    }
  }

var G_DVD_1 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,10],
    theta: [0,GreenDVD1_min],
    name: 'Green DVD 1st Order',
    line: {
      color: 'green'
    }
  }
console.log("RedDVD1_min ="+RedDVD1_min)
console.log("GreenDVD1_min ="+GreenDVD1_min)

console.log("BlueDVD1_min ="+BlueDVD1_min)
var B_DVD_1 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,10],
    theta: [0,BlueDVD1_min],
    name: 'Blue DVD 1st Order',
    line: {
      color: 'blue'
    }
  }
var DVD_1 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [10,10],
    theta: [RedDVD1_min,BlueDVD1_min],
    name: '1st Order',
    line: {
      color: 'black'
    }
  }

var R_DVD_2 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,9],
    theta: [0,RedDVD2_min],
    name: 'Red DVD 2nd Order',
    line: {
      color: 'red'
    }
  }


var B_DVD_2 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,9],
    theta: [0,BlueDVD2_min],
    name: 'Blue DVD 2nd Order',
    line: {
      color: 'blue'
    }
  }

  var DVD_2 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [9,9],
    theta: [RedDVD2_min,BlueDVD2_min],
    name: '2nd Order',
    line: {
      color: 'green'
    }
  }

var R_DVD_3 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,8],
    theta: [0,RedDVD3_min],
    name: 'Red DVD 3rd Order',
    line: {
      color: 'red'
    }
  }

var B_DVD_3 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [0,8],
    theta: [0,BlueDVD3_min],
    name: 'Blue DVD 3rd Order',
    line: {
      color: 'blue'
    }
  }

var DVD_3 =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [8,8],
    theta: [RedDVD3_min,BlueDVD3_min],
    name: '3rd Order',
    line: {
      color: 'green'
    }
  }


  var diffraction_grating =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [5,5],
    theta: [grating_angle,grating_angle+180],
    name: 'Grating',
    line: {
      color: 'gray',
      width:10
    }
}
var light =   
  {
    type: "scatterpolar",
    mode: "lines",
    r: [5,0,0,5],
    theta: [180,0,0,2*grating_angle],
    name: 'Light Beam',
    line: {
      color: 'blue',
      dash: 'dot'
    }
  }
var data =[diffraction_grating,light,R_DVD_1,G_DVD_1,B_DVD_1,R_DVD_2,B_DVD_2,R_DVD_3,B_DVD_3,DVD_1,DVD_2,DVD_3]



var layout = {
    autosize: true,
  width: 500,
  height: 500,
  title:"Tube Length = "+L_hor+ "cm, Tube Diammeter = "+tube_diammeter+ " cm <br> Grating Angle = " + grating_angle + " degrees",
  font: {
    family: 'Arial, sans-serif;',
    size: 12,
    color: '#000'
  },
  showlegend: true,
  orientation: -90
};
Plotly.purge("draw_rays_DVD");

Plotly.newPlot('draw_rays_DVD', data, layout);


var update = {
  width: 800,  // or any new width
  height: 500  // " "
};

Plotly.relayout('draw_rays_DVD', update);
    }
//////////////////////////////////////////////////////////
function plot_tube (){
//////////////////////////////////////////////////////////
const grating_angle = parseFloat(document.getElementById("grating_angle").value);
const tube_diammeter = parseFloat(document.getElementById("tube_diammeter").value);
const L_hor = parseFloat(document.getElementById("tube_length").value);

Height_max_CD = max_of_disk_height*tube_diammeter;
const slit_height = Height_max_CD -slit_align_edge_CD*Math.sin(grating_angle*Math.PI/180);

 
const theta = grating_angle *Math.PI/180;

const Phi = makeArr(0, 2*Math.PI,N);
const C =  makeArr(0, Math.PI*tube_diammeter,N);


var Y =  [];
var C1 = [];
for (var i = 0; i < N; i++) {
    let y = Y_base+tube_diammeter/2*(1-Math.cos(2*Math.PI*i/N))/Math.tan(theta);
    if ((y-Y_base)*Math.tan(theta) > (tube_diammeter-Height_max_CD)){
     Y.push(y);
     C1.push(Math.PI*tube_diammeter*i/N);
 }
}

console.log("tube_diammeter: ", tube_diammeter);

const aperture = Y_base+disk_aperture*Math.cos(grating_angle*Math.PI/180) ;



  var tube = {
    x: [0,0,L_hor,L_hor,0],
    y: [0,tube_diammeter,tube_diammeter,0,0],
    fill: "toself",
    fillcolor: 'green',
  mode: 'lines',
  name: 'Tube',
  line: {
    color: 'green',
    width: 2,
    dash: 'solid'
  },
  type: 'scatter'
};

var CD = {
    x: [Y_base,Y_base+diammeter_CD*Math.cos(grating_angle*Math.PI/180)],
    y: [Height_max_CD,Height_max_CD-diammeter_CD*Math.sin(grating_angle*Math.PI/180)],
  mode: 'lines',
  name: 'CD or DVD',
  line: {
    color: 'blue',
    width: 3,
    dash: 'solid'
  },
  type: 'scatter'
};

var CD_half_point = {
    x: [Y_base+diammeter_CD/2*Math.cos(grating_angle*Math.PI/180)],
    y: [Height_max_CD-diammeter_CD/2*Math.sin(grating_angle*Math.PI/180)],
  mode: 'marker',
  name: 'Half Point',
  marker: {
    color: 'blue',
    size: 10
  },
  type: 'scatter'
};

var CD_extreme = {
    x: [Y_base],
    y: [Height_max_CD],
  mode: 'marker',
  name: 'Extreme',
  marker: {
    color: 'red',
    size: 10
  },
  type: 'scatter'
};

var CD_incision = {
    x: [Y_base,Y_base+Height_max_CD/Math.tan(grating_angle*Math.PI/180)],
    y: [Height_max_CD,0],
  mode: 'lines',
  name: 'Tube Incision',
  line: {
    color: 'black',
    width: 2,
    dash: 'dot'
  },
  type: 'scatter'
};

var Aperture = {
    x: [Y_base,aperture],
    y: [tube_diammeter,tube_diammeter],
  mode: 'lines',
  name: 'Aperture',
  line: {
    color: 'black',
    width: aperture,
    dash: 'solid'
  },
  type: 'scatter'
};
var slit = {
    x: [L_hor,L_hor],
    y: [slit_height-.05,slit_height+.05],
  mode: 'lines',
  name: '1mm Slit',
  line: {
    color: 'red',
    width: 5,
    dash: 'solid'
  },
  type: 'scatter'
};


  



var layout = {title:"Side View of Spectroscope <br> Tube Length = "+L_hor+ " cm, Tube Diammeter = "+tube_diammeter+ " cm",
font: {
    family: 'Arial, sans-serif;',
    size: 16,
    color: '#000'
  },
              xaxis: {
                  //   range: [0, N],
                  title: "Distance along Length (cm)",
                  showgrid: true
              },
              yaxis: {
                  //range: [-1, tube_diammeter ],
                  title: "Distance along Height (cm)",
                  scaleanchor: 'x',
    scaleratio: 1
              }
              }





var data =[tube,CD,CD_half_point,Aperture,CD_incision,slit,CD_extreme]
Plotly.purge("plot_tube");

Plotly.newPlot('plot_tube', data,layout);

    }
//////////////////////////////////////////////////////////
function plot_templete (){
//////////////////////////////////////////////////////////
const grating_angle = parseFloat(document.getElementById("grating_angle").value);
const tube_diammeter = parseFloat(document.getElementById("tube_diammeter").value);
const L_hor = parseFloat(document.getElementById("tube_length").value);

Height_max_CD = max_of_disk_height*tube_diammeter;
const slit_height = Height_max_CD -slit_align_edge_CD*Math.sin(grating_angle*Math.PI/180);



const theta = grating_angle *Math.PI/180;
const Y1_half = Y_base+diammeter_CD/2*Math.cos(theta);




const Phi = makeArr(0, 2*Math.PI,N);
const C =  makeArr(0, Math.PI*tube_diammeter,N);
var Y =  [];
var C1 = [];
var C1_half_old = -1;
var C1_half = -1;
for (var i = 0; i < N; i++) {
    let y = Y_base+tube_diammeter/2*(1-Math.cos(2*Math.PI*i/N))/Math.tan(theta);
    if ((y-Y_base)*Math.tan(theta) > (tube_diammeter-Height_max_CD)){
     Y.push(y);
     C1.push(Math.PI*tube_diammeter*i/N);
 }
 

}


var Y1 =  [];
 for (var i = 0; i <Y.length; i++) {
     Y1.push(Y[i]-Y[0]+Y_base);
 }

 for (var i = 0; i <Y1.length; i++) {
 if (Y1[i]>Y1_half && C1_half_old < Y1_half){C1_half = C1[i]}
C1_half_old = Y1[i];
 }

const aperture = Y_base+disk_aperture*Math.cos(grating_angle*Math.PI/180) ;

var trace1 = {
x: C1,
y: Y1,
  mode: 'lines',
  name: 'Cut Here',
    line: {
    color: 'red',
    width: 2,
    dash: 'solid'
  }
};
const l = Y_base+diammeter_CD/2*Math.cos(grating_angle*Math.PI/180);
var half_point1 = {
x: [C1_half],
y: [l],
  mode: 'marker',
  name: 'Half_Point',
    marker: {
    color: 'blue',
    size: 10
  }
};

var half_point2 = {
x: [C[N-1]-C1_half],
y: [l],
  mode: 'marker',
  name: 'Half_Point',
    marker: {
    color: 'blue',
    size: 10
  }
};

var extreme_point1 = {
x: [C1[0]],
y: [Y1[0]],
  mode: 'marker',
  name: 'Extreme 1',
    marker: {
    color: 'red',
    size: 10
  }
};

var extreme_point2 = {
x: [C1[C1.length-1]],
y: [Y1[Y.length-1]],
  mode: 'marker',
  name: 'Extreme 2',
    marker: {
    color: 'red',
    size: 10
  }
};
var x_R = [];
var y_R_upper = [];
var y_R_lower = [];

const slit_x0 = C[N-1]/2;
const slit_y0 = L_hor+tube_diammeter/2+1;
for (var i = 0; i < N; i++) {
    var x = slit_x0-tube_diammeter/2 +i/N*tube_diammeter;
     x_R.push(x);
     y_R_upper.push(slit_y0+Math.sqrt(tube_diammeter*tube_diammeter/4-(x-slit_x0)*(x-slit_x0)));
    y_R_lower.push(slit_y0-Math.sqrt(tube_diammeter*tube_diammeter/4-(x-slit_x0)*(x-slit_x0)));

 }
var cover1 = {
x: x_R,
y: y_R_upper,
  mode: 'lines',
  name: 'Cover',
    line: {
    color: 'blue',
    width: 2,
    dash: 'dot'
  }
};

var cover2 = {
x: x_R,
y: y_R_lower,
  mode: 'lines',
  name: 'Cover',
    line: {
    color: 'blue',
    width: 2,
    dash: 'dot'
  }
};
const slit_x =Math.sqrt(tube_diammeter*tube_diammeter/4-(slit_height-tube_diammeter/2)*(slit_height-tube_diammeter/2));
var slit = {
x: [slit_x0-slit_x*slit_width,slit_x0+slit_x*slit_width],
y: [slit_y0+slit_height-tube_diammeter/2,slit_y0+slit_height-tube_diammeter/2],
  mode: 'lines',
  name: '1mm Slit',
    line: {
    color: 'red',
    width: 2,
    dash: 'solid'
  }
};


var data =[trace1,half_point1,half_point2,extreme_point1,extreme_point2,cover1,cover2,slit]
    var layout = {
              xaxis: {
                  //   range: [0, N],
                  title: "Distance along Circumference of Tube (cm)",
                  showgrid: true
              },
              yaxis: {
                  //    range: [-1, 1],
                  title: "Distance along Length of Tube (cm)",
                  scaleanchor: 'x',
    scaleratio: 1
              },
              shapes: [
    {
      type: 'line',
      x0: C[N-1]-aperture_width/2,
      y0: Y_base,
      x1: C[N-1]-aperture_width/2,
      y1: aperture,
      line: {
        color: 'red',
        width: 2
      }
    },
    {
      type: 'line',
        x0 : aperture_width/2,
      y0: Y_base,
      x1: aperture_width/2,
      y1: aperture,
      line: {
        color: 'red',
        width: 2
      }
    },
        {
      type: 'line',
      x0: 0,
      y0: aperture,
      x1: aperture_width/2,
      y1: aperture,
      line: {
        color: 'red',
        width: 2
      }
    },
        {
      type: 'line',
      x0: 0,
      y0: Y_base,
      x1: aperture_width/2,
      y1: Y_base,
      line: {
        color: 'red',
        width: 2
      }
    },
        {
      type: 'line',
      x0: C[N-1]-aperture_width/2,
      y0: Y_base,
      x1: C[N-1],
      y1: Y_base,
      line: {
        color: 'red',
        width: 2
      }
    },

    {
      type: 'line',
      x0: C[N-1]-aperture_width/2,
      y0: aperture,
      x1: C[N-1],
      y1: aperture,
      line: {
        color: 'red',
        width: 2
      }
    },
        {
      type: 'line',
      x0: C[N-1],
      y0: 0,
      x1: C[N-1],
      y1:  Math.max.apply(Math, Y),
      line: {
        color: 'black',
        width: 1
      }
    },

    {
      type: 'line',
      x0: C[0],
      y0: L_hor,
      x1: C[N-1],
      y1: L_hor,
      line: {
        color: 'red',
        width: 2
      }
    },
    {
      type: 'line',
      x0: C[N-1],
      y0: 0,
      x1: C[N-1],
      y1: L_hor,
      line: {
        color: 'blue',
        width: 2
      }
    },
    {
      type: 'line',
      x0: C[0],
      y0: 0,
      x1: C[0],
      y1: L_hor,
      line: {
        color: 'blue',
        width: 2
        }
      },
      {
      type: 'line',
      x0: C[0],
      y0: 0,
      x1: C[N-1],
      y1: 0,
      line: {
        color: 'blue',
        width: 2
      }
    }
    
    ],
              title:"Templete to Wrap around Tube <br>  Tube Length = "+L_hor+ " cm, Tube Diammeter = "+tube_diammeter+ " cm <br> Circumference = " + C[N-1].toFixed(2) + " cm",
              font: {
    family: 'Arial, sans-serif;',
    size: 16,
    color: '#000'
  },
          };
    Plotly.purge("plot_templete");

Plotly.newPlot('plot_templete', data, layout);
    }
//////////////////////////////////////////////////////////
function makeArr(startValue, stopValue, cardinality) {
//////////////////////////////////////////////////////////
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}
//////////////////////////////////////////////////////////
function geometry(){
//////////////////////////////////////////////////////////

    plot_tube();
    plot_templete();
}

const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', function() {
    const selectedFile = fileInput.files[0];

    // Verificar si se seleccionó un archivo y es una imagen
    if (selectedFile && selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();

        // Cargar la imagen en el lienzo cuando esté lista
        reader.onload = function(event) {
            const image = new Image();
            initialImage = new Image();
            context1.clearRect(0, 0, canvas1.width, canvas1.height);
            image.onload = function() {
                var hRatio = canvas1.width / image.width    ;
                var vRatio = canvas1.height / image.height  ;
                var ratio  = Math.min ( hRatio, vRatio );
                context1.drawImage(image, 0,0, image.width, image.height, 0,0,image.width*ratio, image.height*ratio);
            
            initialImage = context1.getImageData( 0, 0, canvas1.width, canvas1.height);
            inMemorycontext.putImageData(initialImage, 0, 0);
            context1.drawImage(inMemoryCanvas, 0, 0,canvas1.width, canvas1.height);


            };

            image.src = event.target.result;
        };

        reader.readAsDataURL(selectedFile);
    } else {
        alert('Please, select a valid image file.');
    }
});