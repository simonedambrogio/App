function drawRect(canvas){
        
    // ---- Define Parameters ---- //
    const backgroundColor = 'white'
    const nDotsArray = [100, 100]
    const coherentDirectionArray = [0, 0] // The direction of coherent motion in degrees
    const coherenceArray = [0, 0] // The percentage of dots moving in the coherent direction
    const oppositeCoherenceArray = [0, 0] // The percentage of dots moving in the direction opposite of the coherent direction
    const dotRadiusArray = [5, 5] // The radius of the dots in pixels
    const dotLifeArray = [-1, -1] // The number of frames that pass before each dot disappears and reappears somewhere else
    const moveDistanceArray = [1.5, 1.5] // The distance in pixels each dot moves per frame
    const apertureWidthArray = [300, 300]
    const apertureHeightArray = apertureWidthArray
    const dotColorArray = ['black', 'black']
    var   apertureCenterXArray = [canvas.width*0.2, canvas.width*(1-0.2)]
    var   apertureCenterYArray = [canvas.height*0.5, canvas.height*0.5]
    const borderArray = [true, true]
    const borderThicknessArray = [2, 2];
    var   borderColorArray = ['black', 'black']
    const nApertures = apertureCenterXArray.length
    var   dotArray = [];
    //Loop through the number of apertures to make the dots
    for(currentApertureNumber = 0; currentApertureNumber < nApertures; currentApertureNumber++){
        
        //Initialize the parameters to make the 2d dot array (one for each aperture);
        initializeCurrentApertureParameters();

        //Make each 2d array and push it into the 3d array
        dotArray.push(makeDotArray());
    }
    // --------------------------- //

    // -- Define Glibal Variables -- //
    var nDots;
    var coherentDirection;
    var coherence;
    var oppositeCoherence;
    var dotRadius;
    var dotLife;
    var moveDistance;
    var apertureWidth;
    var dotColor;
    var apertureCenterX;
    var apertureCenterY;

    var currentApertureNumber;
    var horizontalAxis;
    var verticalAxis;
    //Calculate the x and y jump sizes for coherent dots
    var coherentJumpSizeX;
    var coherentJumpSizeY;
    //Calculate the number of coherent, opposite coherent, and incoherent dots
    var nCoherentDots;
    var nOppositeCoherentDots;
    var stopDotMotion = false;

    var ctx = canvas.getContext('2d');

    animateDraw();

    //Function to update all the dots all the apertures and then draw them
    function updateAndDraw(){
    
        //Three for loops that do things in sequence: clear, update, and draw dots.
        
        // Clear all the current dots
        for(currentApertureNumber = 0; currentApertureNumber < nApertures; currentApertureNumber++){
    
            // Initialize the variables for each parameter
            initializeCurrentApertureParameters(currentApertureNumber);
            
            // Clear the canvas by drawing over the current dots
            clearDots();
        }
        
        // Update all the relevant dots
        for(currentApertureNumber = 0; currentApertureNumber < nApertures; currentApertureNumber++){
    
            // Initialize the variables for each parameter
            initializeCurrentApertureParameters(currentApertureNumber);
            
            // Update the dots
            updateDots();
        }
        
        // Draw all the relevant dots on the canvas
        for(currentApertureNumber = 0; currentApertureNumber < nApertures; currentApertureNumber++){
    
            //Initialize the variables for each parameter
            initializeCurrentApertureParameters(currentApertureNumber);
            //Draw on the canvas
            draw();
        }
    } 

    function draw() {
			
        // console.log(dotArray[currentApertureNumber])
        // console.log(apertureCenterY)
        //Loop through the dots one by one and draw them
        for (var i = 0; i < nDots; i++) {
            dot = dotArray[currentApertureNumber][i];
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.fill();
        }
        
        //Draw the border if we want it
        if(border === true){
            drawBorderAperture()                                  
        }//End of if border === true
        
    }//End of draw


    //Function that clears the dots on the canvas by drawing over it with the color of the background
    function clearDots(){
      
        //Loop through the dots one by one and draw them
        for (var i = 0; i < nDots; i++) {
            dot = dotArray[currentApertureNumber][i];
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dotRadius[i]+1, 0, Math.PI * 2);
            ctx.fillStyle = backgroundColor;
            ctx.fill();
        }
    }

    //Function to set the global variables to the current aperture so that the correct dots are updated and drawn
    function initializeCurrentApertureParameters(){
        //Set the global variables to that relevant to the current aperture
        nDots = nDotsArray[currentApertureNumber];
        coherentDirection = coherentDirectionArray[currentApertureNumber]; 
        coherence = coherenceArray[currentApertureNumber]; 
        oppositeCoherence = oppositeCoherenceArray[currentApertureNumber]; 
        dotRadius = dotRadiusArray[currentApertureNumber]; 
        dotLife = dotLifeArray[currentApertureNumber]; 
        moveDistance = moveDistanceArray[currentApertureNumber]; 
        apertureWidth = apertureWidthArray[currentApertureNumber]; 
        apertureHeight = apertureHeightArray[currentApertureNumber]; 
        dotColor = dotColorArray[currentApertureNumber]; 
        apertureCenterX = apertureCenterXArray[currentApertureNumber]; 
        apertureCenterY = apertureCenterYArray[currentApertureNumber]; 
        border = borderArray[currentApertureNumber];
        borderThickness = borderThicknessArray[currentApertureNumber];
        borderColor = borderColorArray[currentApertureNumber];

        //Calculate the x and y jump sizes for coherent dots
        coherentJumpSizeX = calculateCoherentJumpSizeX(coherentDirection);
        coherentJumpSizeY = calculateCoherentJumpSizeY(coherentDirection);

        //Initialize the aperture parameters
        initializeApertureDimensions();

        //Calculate the number of coherent, opposite coherent, and incoherent dots
        nCoherentDots = nDots * coherence;
        nOppositeCoherentDots = nDots * oppositeCoherence;
        nIncoherentDots = nDots - (nCoherentDots + nOppositeCoherentDots);
        
    }// End of initializeCurrentApertureParameters

    //Calculate coherent jump size in the x direction
    function calculateCoherentJumpSizeX(coherentDirection) {
        var angleInRadians = coherentDirection * Math.PI / 180;
        return moveDistance * Math.cos(angleInRadians);
    }

    //Calculate coherent jump size in the y direction
    function calculateCoherentJumpSizeY(coherentDirection) {
        var angleInRadians = -coherentDirection * Math.PI / 180; //Negative sign because the y-axis is flipped on screen
        return moveDistance * Math.sin(angleInRadians);
    }

    //Initialize the parameters for the aperture for further calculation
    function initializeApertureDimensions() {
        //For circle and square
        horizontalAxis = verticalAxis = apertureWidth/2;
    }

    //Update the dots with their new location
    function updateDots() {
     
        //Loop through the dots one by one and update them accordingly
        for (var i = 0; i < nDots; i++) {
            var dot = dotArray[currentApertureNumber][i]; //Load the current dot into the variable for easy handling
    
            //Generate a random value
            var randomValue = Math.random();

            //Update based on the dot's update type
            if (dot.updateType == "constant direction") { ////
                dot = constantDirectionUpdate(dot); 
            } else if (dot.updateType == "opposite direction") { ////
                dot = oppositeDirectionUpdate(dot);
            } else if (dot.updateType == "random direction") { ////
                dot = randomDirectionUpdate(dot);
            } 

            //Increment the life count
            dot.lifeCount++;

            //Check if out of bounds or if life ended
            if (lifeEnded(dot)) {
                dot = resetLocation(dot);
            }

            //If it goes out of bounds, do what is necessary (reinsert randomly or reinsert on the opposite edge) based on the parameter chosen
            if (outOfBounds(dot)) {
                switch (2) {
                    case 1:
                        dot = resetLocation(dot);
                        break;
                    case 2:
                        dot = reinsertOnOppositeEdge(dot);
                        break;
                } //End of switch statement
            } //End of if

        } //End of for loop
    } //End of updateDots function

    //Function to check if dot life has ended
    function lifeEnded(dot) {
        //If we want infinite dot life
        if (dotLife < 0) {
            dot.lifeCount = 0; //resetting to zero to save memory. Otherwise it might increment to huge numbers.
            return false;
        }
        //Else if the dot's life has reached its end
        else if (dot.lifeCount >= dotLife) {
            dot.lifeCount = 0;
            return true;
        }
        //Else the dot's life has not reached its end
        else {
            return false;
        }
    }
    
    //Function to check if dot is out of bounds
    function outOfBounds(dot) {
        if (dot.x < xValueNegative(dot.y) || dot.x > xValuePositive(dot.y) || dot.y < yValueNegative(dot.x) || dot.y > yValuePositive(dot.x)) {
            return true;
        } else {
            return false;
        }
    }

    //Calculate the POSITIVE x value of a point on the edge of the ellipse given a y-value
    function xValuePositive(y) {
        var y = y - (apertureCenterY); //Bring it back to the (0,0) center to calculate accurately (ignore the x-coordinate because it is not necessary for calculation)
        return horizontalAxis * Math.sqrt(1 - (Math.pow(y, 2) / Math.pow(verticalAxis, 2))) + apertureCenterX; //Calculated the positive x value and added apertureCenterX to recenter it on the screen
    }

    //Calculate the NEGATIVE x value of a point on the edge of the ellipse given a y-value
    function xValueNegative(y) {
        var y = y - (apertureCenterY); //Bring it back to the (0,0) center to calculate accurately (ignore the x-coordinate because it is not necessary for calculation)
        return -horizontalAxis * Math.sqrt(1 - (Math.pow(y, 2) / Math.pow(verticalAxis, 2))) + apertureCenterX; //Calculated the negative x value and added apertureCenterX to recenter it on the screen
    }

    //Calculate the POSITIVE y value of a point on the edge of the ellipse given an x-value
    function yValuePositive(x) {
        var x = x - (apertureCenterX); //Bring it back to the (0,0) center to calculate accurately (ignore the y-coordinate because it is not necessary for calculation)
        return verticalAxis * Math.sqrt(1 - (Math.pow(x, 2) / Math.pow(horizontalAxis, 2))) + apertureCenterY; //Calculated the positive y value and added apertureCenterY to recenter it on the screen 
    }

    //Calculate the NEGATIVE y value of a point on the edge of the ellipse given an x-value
    function yValueNegative(x) {
        var x = x - (apertureCenterX); //Bring it back to the (0,0) center to calculate accurately (ignore the y-coordinate because it is not necessary for calculation)
        return -verticalAxis * Math.sqrt(1 - (Math.pow(x, 2) / Math.pow(horizontalAxis, 2))) + apertureCenterY; //Calculated the negative y value and added apertureCenterY to recenter it on the screen
    }

    //Calculates a random position on the opposite edge to reinsert the dot
    function reinsertOnOppositeEdge(dot) {
        //Bring the dot back into the aperture by moving back one step
        dot.x -= dot.latestXMove;
        dot.y -= dot.latestYMove;

        //Move the dot to the position relative to the origin to be reflected about the origin
        dot.x -= apertureCenterX;
        dot.y -= apertureCenterY;

        //Reflect the dot about the origin
        dot.x = -dot.x;
        dot.y = -dot.y;

        //Move the dot back to the center of the screen
        dot.x += apertureCenterX;
        dot.y += apertureCenterY;

        return dot;
    } //End of reinsertOnOppositeEdge

    //Updates the x and y coordinates by moving it in the x and y coherent directions
    function constantDirectionUpdate(dot) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        dot.latestXMove = dot.vx;
        dot.latestYMove = dot.vy;
        return dot;
    }

    //Updates the x and y coordinates by moving it in the opposite x and y coherent directions
    function oppositeDirectionUpdate(dot) {
        dot.x -= dot.vx;
        dot.y -= dot.vy;
        dot.latestXMove = -dot.vx;
        dot.latestYMove = -dot.vy;
        return dot;
    }

    //Updates the x and y coordinates with the alternative move direction
    function randomDirectionUpdate(dot) {
        dot.x += dot.vx2;
        dot.y += dot.vy2;
        dot.latestXMove = dot.vx2;
        dot.latestYMove = dot.vy2;
        return dot;
    }

    function drawBorderAperture() {
        ctx.lineWidth = borderThickness;
        ctx.strokeStyle = borderColor;
        ctx.beginPath();
        ctx.ellipse(apertureCenterX, apertureCenterY, horizontalAxis+(borderThickness/2)+dotRadius, verticalAxis+(borderThickness/2)+dotRadius, 0, 0, Math.PI*2);
        ctx.stroke();
        // ctx.fillStyle = 'white';
        // ctx.fill(); 
    }

    //Make the dot array
    function makeDotArray() {
        var tempArray = []
        for (var i = 0; i < nDots; i++) {
            //Initialize a dot to be modified and inserted into the array
            var dot = {
                x: 0, //x coordinate
                y: 0, //y coordinate
                vx: 0, //coherent x jumpsize (if any)
                vy: 0, //coherent y jumpsize (if any)
                vx2: 0, //incoherent (random) x jumpsize (if any)
                vy2: 0, //incoherent (random) y jumpsize (if any)
                latestXMove: 0, //Stores the latest x move direction for the dot (to be used in reinsertOnOppositeEdge function below)
                latestYMove: 0, //Stores the latest y move direction for the dot (to be used in reinsertOnOppositeEdge function below)
                lifeCount: Math.floor(randomNumberBetween(0, dotLife)), //Counter for the dot's life. Updates every time it is shown in a frame
                updateType: "" //String to determine how this dot is updated
            };
            
            //randomly set the x and y coordinates
            dot = resetLocation(dot);

            //For the same && random direction RDK type
            //For coherent dots
            if (i < nCoherentDots) {
                dot = setvxvy(dot); // Set dot.vx and dot.vy
                dot.updateType = "constant direction";
            }
            //For opposite coherent dots
            else if(i >= nCoherentDots && i < (nCoherentDots + nOppositeCoherentDots)){
                        dot = setvxvy(dot); // Set dot.vx and dot.vy
                dot.updateType = "opposite direction";
            }
            //For incoherent dots
            else {
                setvx2vy2(dot); // Set dot.vx2 and dot.vy2
                dot.updateType = "random direction";
            }
            tempArray.push(dot);
        } //End of for loop
        return tempArray;
    }

    //Set the vx and vy for the dot to the coherent jump sizes of the X and Y directions
    function setvxvy(dot) {
        dot.vx = coherentJumpSizeX;
        dot.vy = coherentJumpSizeY;
        return dot;
    }

    //Set the vx2 and vy2 based on a random angle
    function setvx2vy2(dot) {
        //Generate a random angle of movement
        var theta = randomNumberBetween(-Math.PI, Math.PI);
        //Update properties vx2 and vy2 with the alternate directions
        dot.vx2 = Math.cos(theta) * moveDistance;
        dot.vy2 = -Math.sin(theta) * moveDistance;
        return dot;
    }

    //Calculate a random x and y coordinate in the ellipse
    function resetLocation(dot) {

        //For circle and ellipse
        var phi = randomNumberBetween(-Math.PI, Math.PI);
        var rho = Math.random();

        x = Math.sqrt(rho) * Math.cos(phi);
        y = Math.sqrt(rho) * Math.sin(phi);

        x = x * horizontalAxis + apertureCenterX;
        y = y * verticalAxis + apertureCenterY;

        dot.x = x;
        dot.y = y;

        return dot;
    }
    //Generates a random number (with decimals) between 2 values
    function randomNumberBetween(lowerBound, upperBound) {
        return lowerBound + Math.random() * (upperBound - lowerBound);
    }

    function animateDraw() {
        //frameRequestID saves a long integer that is the ID of this frame request. The ID is then used to terminate the request below.
        var frameRequestID = window.requestAnimationFrame(animate);

        var is_click=false;
        canvas.addEventListener('click', () => { is_click=true; });

        function animate() {

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            //If stopping condition has been reached, then stop the animation
            if (stopDotMotion) {
                window.cancelAnimationFrame(frameRequestID); //Cancels the frame request
            }
            //Else continue with another frame request
            else {
                                
                frameRequestID = window.requestAnimationFrame(animate);
                updateAndDraw(); //Update and draw each of the dots in their respective apertures
            
                if( is_click ) is_click=false
            }

        }
    }
}

function send_reward(){
    let data = { isReward: true }
    let options = {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(data)
    }
    fetch('/data', options);
}

function controlLed(){
    let url = 'http://localhost:3000/';
    axios.get(url)
        .then((response) => {
            console.log(response)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

function run_experiment () {
    const jsPsych = initJsPsych({
        on_finish: () => {
            $.ajax({
                type: "POST",
                url: "/experiment-data",
                data: JSON.stringify(jsPsych.data.get().values()),
                contentType: "application/json"
            })
            .done(function() {
                window.location.href = "finish";
            })
            .fail(function() {
                alert("A problem occurred while writing to the database. Please contact the researcher for more information.")
                window.location.href = "/";
            })
        }
    });

    const reward = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: 'Reward', 
        response_ends_trial: false,
        trial_duration: 1000,
        on_start: () => {
            controlLed()
        },
        on_finish: () => {
        }
    }
    
    const rdk = {
        on_start: () => send_reward(),
        type: jsPsychCanvasKeyboardResponse,
        canvas_size: () => { return [window.innerHeight, window.innerWidth] },
        stimulus: drawRect,
        choices: ['e','i']
    }
    
    jsPsych.run([rdk, reward, rdk, reward, rdk, reward]);    
}