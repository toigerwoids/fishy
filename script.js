$(document).ready(function () {
  // Global variables
  let max_particles,
    particles,
    frequency,
    init_num,
    max_time,
    time_to_recreate,
    tela,
    canvas;
  let marketCap = 0; // Replace environmentHealth with marketCap
  const MAX_MARKETCAP = 1500000; // Replace MAX_HEALTH
  let mouseX = 0;
  let mouseY = 0;
  const REPULSION_RADIUS = 100;
  const REPULSION_STRENGTH = 5;
  let previousMarketCap = marketCap;
  let isSnapshotMode = false;
  let priceChange1hr = 0; // Initialize to 0 or some default value
  let isTourActive = false;
  let currentTourStep = 0;
  let isDay;
  let isFullscreen = false;
  let coralsInitialized = false;
  let waveActive = false;
let waveStartTime = 0;
let waveInterval = 10; // wave every 10s
let waveDuration = 3;  // wave sweeps across in 3s
  
  
  function maximizeFromLogo() {
    const infoDiv = $(".environment-info");
    const logoCircle = $("#logo-circle");

    infoDiv.show().css({
      transform: "scale(1)",
      opacity: "1",
      top: "100px",
      left: "20px",
      transition: "all 0.3s ease-in-out"
    });

    logoCircle.removeClass("glowing");
    window.isInfoVisible = true;
  }

  function calculateIsDay() {
    const now = new Date();
    const utcHour = now.getUTCHours();
    return utcHour >= 6 && utcHour < 18; // Daytime: 6 AM to 6 PM UTC
}

  function updateInfoDisplay() {}
  // Create a tooltip element
  const tooltip = $('<div class="tooltip"></div>');
  $("body").append(tooltip);

  // Function to create a Food instance at the clicked position
  function createFoodAtClick(x, y) {
    const food = new Food(canvas);
    food.x = x;
    food.y = y;
    particles.push(food); // Add to the particles array
  }
$(document).ready(function () {
    // Ensure all modal sections are hidden initially
    $(".modal-section").hide();

    // Event handlers for buttons
    $("#about-button").click(function () {
        openModal("#about-section");
    });

    $("#changelog-button").click(function () {
        openModal("#changelog-section");
    });

    // Close button handler
    $(".close").click(function () {
        $("#content-modal").fadeOut();
    });

    $(window).click(function (e) {
        if ($(e.target).hasClass("modal")) {
            $(e.target).fadeOut();
        }
    });

    // Function to open modal and smoothly switch sections
    function openModal(targetSection) {
        const activeSection = $(".modal-section:visible"); // Find the currently visible section

        if (activeSection.length > 0) {
            // If a section is already visible, fade it out first
            activeSection.fadeOut(300, function () {
                // Fade in the target section after the previous one is hidden
                $(targetSection).fadeIn(300);
            });
        } else {
            // If no section is currently visible, fade in the modal and the target section
            $("#content-modal").fadeIn(300);
            $(targetSection).fadeIn(300);
        }
    }

    if (clickedParticle) {
      tooltip.html(`
                <div style="font-weight: 400; margin-bottom: 5px;">${
                  clickedParticle.speciesName || "Unknown Species"
                }</div>
                <div>Color: ${
                  clickedParticle.colorDescription || "Varied"
                }</div>
                <div>Description: ${clickedParticle.behavior || "Unknown"}</div>
                <div>Size: ${
                  clickedParticle.radius?.toFixed(1) || "N/A"
                } units</div>
            `);
      tooltip.css({
        left: e.pageX + 20 + "px",
        top: e.pageY + 20 + "px",
        display: "block",
        opacity: 1
      });
    }
  });
  
$("#fullscreen-button").on("click", () => {
  isFullscreen = !isFullscreen; // Toggle fullscreen state

  const elements = {
    "#top-nav": "slide-up",
    "#logo-circle": "slide-up",
    ".environment-info": "slide-left",
    "#contract-address-box": "slide-down",
    "#snapshot-button": "slide-down"
  };

  if (isFullscreen) {
    // Slide elements out of view
    Object.entries(elements).forEach(([selector, direction]) => {
      const element = $(selector);
      element.removeClass("slide-reset"); // Ensure reset classes are removed
      element.addClass("element-transition");
      element.addClass(direction);
    });


$("#fullscreen-button").on("click", function () {
    toggle
    ();
});// Update button text
  } else {
    // Reset elements back to their original positions
    const resetElements =
      "#top-nav, .environment-info, #contract-address-box, #snapshot-button, #logo-circle";

    $(resetElements)
      .removeClass("slide-left slide-up slide-down")
      .addClass("element-transition slide-reset");

  }
});
  
  const tourSteps = [];

  document.querySelectorAll("#tour-steps > div").forEach((stepElement) => {
    const step = {
      element: stepElement.getAttribute("data-element"),
      text: stepElement.getAttribute("data-text")
    };
    tourSteps.push(step);
  });

  function drawCircularProgress(currentStep, totalSteps) {
    const canvas = document.getElementById("step-progress-circle");
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 36; // Radius of the circle
    const lineWidth = 6; // Thickness of the circle
    const startAngle = -0.5 * Math.PI; // Start from the top
    const endAngle = ((currentStep / totalSteps) * 2 - 0.5) * Math.PI; // Progress angle

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Gradient for progress circle - simplified to just purple to green
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#9945FF"); // Purple
    gradient.addColorStop(1, "#14F195"); // Light green

    // Progress circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  function updateScrollMask() {
    const content = document.getElementById("guided-tooltip-text");
    const isScrollable = content.scrollHeight > content.clientHeight;
    const isAtBottom =
      Math.abs(
        content.scrollHeight - content.clientHeight - content.scrollTop
      ) < 2;

    content.classList.toggle("has-more-content", isScrollable && !isAtBottom);
    content.classList.toggle("at-bottom", isAtBottom);
  }

function updateStepCounter(currentStep, totalSteps) {
    const displayStep = currentStep + 1;
    document.getElementById("step-counter").textContent = `${displayStep}/${totalSteps}`;
    drawCircularProgress(displayStep, totalSteps);
}

 let activeTourSteps = []; // To hold the steps based on device type

function initializeTour() {
    const isMobile = window.innerWidth < 768;
    
    // Dynamically set activeTourSteps based on device type
    if (isMobile) {
        activeTourSteps = tourSteps; // Include step 0 for mobile
        currentTourStep = 0;         // Start at step 0
    } else {
        activeTourSteps = tourSteps.slice(1); // Exclude step 0 for desktop
        currentTourStep = 0;                   // Start at the first step in activeTourSteps
    }
    
    isTourActive = true; // Activate the tour
    
    // Update the UI to reflect the initial step
    updateTourUI();
    
    // Set up event listeners
    $("#guided-tooltip-prev").off().on("click", function() {
        previousStep();
        updateTourUI();
    });
    $("#guided-tooltip-next").off().on("click", function() {
        nextStep();
        updateTourUI();
    });
    $("#guided-tooltip-exit").off().on("click", endTour);
    
    document.getElementById("guided-tooltip-text").addEventListener("scroll", updateScrollMask);
    window.addEventListener("resize", updateScrollMask);
}

 function startTour() {
    isTourActive = true;
    currentTourStep = 0;
    $("#backdrop").fadeIn(300);
    $("#guided-tooltip").fadeIn(300);
    updateTourUI();
}

function updateTourUI() {
    if (!isTourActive) return;

    const stepData = activeTourSteps[currentTourStep];
    if (!stepData) {
        endTour();
        return;
    }

    // Update the step counter
    updateStepCounter(currentTourStep, activeTourSteps.length);
    
    // Update the progress bar
    const progress = ((currentTourStep + 1) / activeTourSteps.length) * 100;
    $("#tour-progress-bar").css("width", `${progress}%`);

    // Handle Previous button state
    $("#guided-tooltip-prev")
        .toggleClass("disabled", currentTourStep === 0)
        .find("svg")
        .toggle(currentTourStep !== 0);

    // Handle Next button text and arrow visibility
    const isLastStep = currentTourStep === activeTourSteps.length - 1;
    const $nextButton = $("#guided-tooltip-next");
    $nextButton.find("span").text(isLastStep ? "Finish" : "Next");
    $nextButton
        .find("svg")
        .css("display", isLastStep ? "none" : "inline-block");

    // Remove all highlights and reset UI elements
    $(".highlight").removeClass("highlight");
    $("#ecosystem-highlight").css("opacity", "0");
    $(".highlight-canvas").removeClass("highlight-canvas");
    $(".hide-elements").removeClass("hide-elements");
    $(".hide-opacity").removeClass("hide-opacity");

    // Handle specific step UI logic
    if (stepData.element) {
        if (stepData.element === ".animation-wrapper") {
            $("#ecosystem-highlight").css("opacity", "1");
        } else {
            $(stepData.element).addClass("highlight");
        }
    }
 if (currentTourStep === 1) { // Now it's step 1 in activeTourSteps array
    // Add canvas highlight
    $(".animation-wrapper").addClass("highlight-canvas");
    
    // Add UI element transitions
    const elements = {
        "#top-nav": "slide-up",
        "#fullscreen-button": "slide-up",
        ".environment-info": "slide-left",
        "#contract-address-box": "slide-down",
        "#snapshot-button": "slide-down",
        "#logo-circle": "slide-up"
    };

    // Apply transitions
    Object.entries(elements).forEach(([selector, direction]) => {
        const element = $(selector);
        element.addClass("element-transition");
        element.addClass(direction);
    });

    // Set the specialStyle flag for opacity changes
    stepData.specialStyle = true;
} else {
    // Reset all elements
    const elements = "#top-nav, .environment-info, #fullscreen-button, #contract-address-box, #snapshot-button, #logo-circle";
    $(elements)
        .removeClass("slide-left slide-up slide-down hide")
        .addClass("slide-reset");

    // Remove highlight
    $(".animation-wrapper").removeClass("highlight-canvas");

    // After transition completes, remove transition classes
    setTimeout(() => {
        $(elements).removeClass("element-transition slide-reset");
    }, 500);
}

    // Update tooltip styles based on step
    if (stepData.specialStyle) { // Assuming you have a flag in stepData
        $("#guided-tooltip").css({
            background: "rgba(0, 0, 0, 0)",
            transition: "background 0.3s ease",
            "backdrop-filter": "blur(2px)"
        });
        $("#canvas-title, #canvas-subtitle").css({
            transition: "opacity 0s ease"
        });
        setTimeout(() => {
            $("#canvas-title").css("opacity", "0");
            $("#canvas-subtitle").css("opacity", "0");
        }, 10);
    } else {
        $("#guided-tooltip").css({
            background: "rgba(0, 0, 0, 0.95)",
            transition: "background 0.3s ease",
            "backdrop-filter": "blur(10px)"
        });
        $("#canvas-title, #canvas-subtitle").css({
            transition: "opacity 0.6s ease"
        });
        setTimeout(() => {
            $("#canvas-title").css("opacity", "1");
            $("#canvas-subtitle").css("opacity", "1");
        }, 10);
    }

    // Tooltip hover effects
    $("#guided-tooltip")
        .off("mouseenter mouseleave") // Remove previous handlers to prevent duplicates
        .on("mouseenter", function () {
            if (stepData.specialStyle) { // Assuming you have a flag in stepData
                $(this).css("background", "rgba(0, 0, 0, 0.95)");
                $("#guided-tooltip-content").css("background", "rgba(0, 0, 0, 0)");
            }
        })
        .on("mouseleave", function () {
            if (stepData.specialStyle) { // Assuming you have a flag in stepData
                $(this).css("background", "rgba(0, 0, 0, 0)");
                $("#guided-tooltip-content").css("background", "rgba(0, 0, 0, 0)");
            }
        });

    // Update tooltip content
    const content = document.getElementById("guided-tooltip-text");
    content.innerHTML = stepData.text;
    content.scrollTop = 0; // Reset scroll position to top
    updateScrollMask(); // Check scroll status immediately after content update
}

// Updated previousStep Function
function previousStep() {
    if (currentTourStep > 0) {
        currentTourStep--;
        updateTourUI();
    }
}

// Updated nextStep Function
function nextStep() {
    if (currentTourStep < activeTourSteps.length - 1) {
        currentTourStep++;
        updateTourUI();
    } else {
        endTour();
    }
}


  function endTour() {
    isTourActive = false;
    $(".highlight").removeClass("highlight");

    // Fade out guided tooltip and backdrop
    $("#guided-tooltip").fadeOut(300);
    $("#backdrop").fadeOut(300);

    // Handle canvas title and subtitle fade-out
    setTimeout(() => {
      $("#canvas-title, #canvas-subtitle").css({
        opacity: "0",
        transition: "opacity 4s ease"
      });

      setTimeout(() => {
        $("#canvas-title, #canvas-subtitle").css("display", "none");
        titleFadedOut = true;

        // Show hint tooltip after the title fade-out
        showHintTooltip();
      }, 4000); // Wait for title fade-out duration
    }, 4000); // Wait for guided tooltip fade-out
  }

  // Stop all event bubbling on specific buttons
  $("#snapshot-button, #info-toggle").on("click", function (e) {
    e.stopPropagation(); // Stop click from bubbling
    e.preventDefault(); // Prevent default action
  });

  $("#snapshot-button").click(() => {
    isSnapshotMode = !isSnapshotMode; // Toggle the mode
    if (isSnapshotMode) {
      cancelAnimationFrame(updateAnimation); // Pause animation
      $("#snapshot-button").text("Play Simulation"); // Update button text
    } else {
      requestAnimationFrame(update); // Resume animation
      $("#snapshot-button").text("Pause Simulation"); // Update button text
    }
  });

  $(document).click(function (e) {
    if (isSnapshotMode) {
      const mouseX = e.pageX;
      const mouseY = e.pageY;

      // Check if a particle was clicked
      let clickedParticle = null;
      particles.forEach((particle) => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < particle.radius * 2) {
          clickedParticle = particle;
        }
      });

      if (clickedParticle) {
        tooltip.html(`
                <div style="font-weight: 400; margin-bottom: 5px;">${
                  clickedParticle.speciesName || "Unknown Species"
                }</div>
                <div>Color: ${clickedParticle.color || "Varied"}</div>
                <div>Size: ${clickedParticle.radius.toFixed(1)} units</div>
                <div>Behavior: ${
                  clickedParticle.isLeader ? "Leader" : "NA"
                }</div>
            `);
        tooltip.css({
          left: mouseX + 20 + "px",
          top: mouseY + 20 + "px",
          display: "block",
          opacity: 1
        });
      }
    }
  });

  function createLogoCircle() {
    const logoCircle = $('<div id="logo-circle"></div>');

    logoCircle.css({
      position: "absolute",
      top: "20px",
      left: "20px",
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      background: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 998,
      cursor: "pointer",
      overflow: "visible",
      transition: "all 0.3s ease"
    });

    logoCircle.html(
      '<img src="https://i.ibb.co/ZL1pM9M/10.png" alt="Logo" style="width: 70%; height: 70%; border-radius: 50%;" />'
    );

    $("body").append(logoCircle);

    // Modified click handler
    logoCircle.on("click", function () {
      if ($(".environment-info").is(":hidden")) {
        // Check if info div is actually hidden
        maximizeFromLogo();
      }
    });
  }

  // Call this function after the DOM is ready
  $(document).ready(function () {
    createLogoCircle();
  });

  // Add this function at the top level
  function avoidCollisions(particle, particles) {
    const AVOIDANCE_RADIUS = 15; // Distance at which particles start avoiding each other
    const AVOIDANCE_STRENGTH = 0.5; // How strongly particles avoid each other

    let avoidanceX = 0;
    let avoidanceY = 0;
    let count = 0;

    for (const other of particles) {
      if (other === particle) continue;

      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If particles are too close, calculate avoidance force
      if (distance < AVOIDANCE_RADIUS) {
        const force = (AVOIDANCE_RADIUS - distance) / AVOIDANCE_RADIUS;
        avoidanceX += (dx / distance) * force;
        avoidanceY += (dy / distance) * force;
        count++;
      }
    }

    // If there are nearby particles, apply avoidance force
    if (count > 0) {
      particle.x += avoidanceX * AVOIDANCE_STRENGTH;
      particle.y += avoidanceY * AVOIDANCE_STRENGTH;
    }
  }

  async function fetchMarketCap() {
    const tokenAddress = "4cxcFTwUV9a6d5VtdrMszmcNdkEXQCavtNwZocKSpump"; // Replace with your token address
    const isOnPumpfun = false; // Set to true if the token is on Pumpfun; otherwise false for Dexscreener
    let url;

    if (isOnPumpfun) {
      // Fetch data from PumpfunAPI endpoint
      url = `https://api.pumpfunapi.org/price/${tokenAddress}`;
    } else {
      // Fetch data from Dexscreener endpoint
      url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (isOnPumpfun) {
        // Handle PumpfunAPI response
        const priceInUSD = parseFloat(data.USD); // Get the price in USD from PumpfunAPI
        const fetchedMarketCap = priceInUSD * 1000000000; // Multiply by 1 billion to get market cap

        marketCap = fetchedMarketCap;
        priceChange1hr = 0; // No price change data for PumpfunAPI
      } else if (data.pairs && data.pairs.length > 0) {
        // Handle Dexscreener response
        const fetchedMarketCap = parseFloat(data.pairs[0].marketCap) || 0;
        priceChange1hr = parseFloat(data.pairs[0].priceChange.h1) || 0;

        marketCap = fetchedMarketCap;
        updateCoralFormations(marketCap);

      }

      // Optional: Handle additional logic if market cap has changed (for example, "bacteria spawning")
      handleBacteriaSpawning(priceChange1hr);
      updateInfoDisplay();
    } catch (error) {
      console.error("Error fetching market cap data:", error);
    }
  }

  let bacteriaDetected = false; // Global variable to track bacteria presence

  function handleBacteriaSpawning(priceChange1hr) {
    const bacteriaExists = particles.some((p) => p instanceof Bacteria);

    if (priceChange1hr < -15) {
      // Spawn bacteria if the price drops by more than 10%
      if (!bacteriaExists) spawnBacteria();
    } else {
      // Remove bacteria if the price recovers to positive
      if (bacteriaExists) removeBacteria();
    }
  }

  function spawnBacteria() {
    for (let i = 0; i < 20; i++) {
      particles.push(new Bacteria(canvas));
    }
  }

  function removeBacteria() {
    particles = particles.filter((p) => !(p instanceof Bacteria));
  }

  function createInfoDisplay() {
    const container = $('<div id="info-container"></div>');
    const infoDiv = $('<div class="environment-info"></div>');

    container.css({
      position: "fixed",
      top: "20px",
      left: "20px",
      zIndex: 10,
      display: "flex",
      alignItems: "center",
      flexDirection: "column"
    });

    $("body").append(container);
    container.append(infoDiv);

    infoDiv.css({
      position: "fixed", // Explicitly fixed to isolate from layout changes
      top: "100px",
      left: "20px",
      zIndex: 10,
      cursor: "grab"
    });

    // Dragging logic
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    infoDiv.on("mousedown", function (e) {
      isDragging = true;
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;

      infoDiv.css({
        cursor: "grabbing",
        position: "fixed", // Ensure position is fixed
        willChange: "transform" // Optimize for animations
      });
      e.stopPropagation();
    });

    $(document).on("mousemove", function (e) {
      if (isDragging) {
        e.preventDefault();

        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;

        // Use transform for better performance
        infoDiv.css({
          transform: `translate3d(${currentX}px, ${currentY}px, 0)`,
          transition: "none"
        });
      }
    });

    $(document).on("mouseup", function () {
      if (isDragging) {
        isDragging = false;
        infoDiv.css({
          cursor: "grab",
          willChange: "auto" // Reset will-change
        });
      }
    });

    $(document).on("mouseup", function () {
      if (isDragging) {
        isDragging = false;
        infoDiv.css({ cursor: "grab" });
      }
    });

    function updateIndicator(canvasId, percentage, label) {
      const canvas = document.getElementById(canvasId);
      const ctx = canvas.getContext("2d");

      // Set up canvas for high-quality rendering
      const scaleFactor = window.devicePixelRatio || 1; // Account for high-DPI displays
      canvas.width = 60 * scaleFactor;
      canvas.height = 60 * scaleFactor;
      canvas.style.width = "60px";
      canvas.style.height = "60px";
      ctx.scale(scaleFactor, scaleFactor);

      const centerX = 30;
      const centerY = 30;
      const radius = 25;
      const startAngle = -0.5 * Math.PI; // Start at top
      const endAngle = (percentage / 100) * 2 * Math.PI - 0.5 * Math.PI;

      // Calculate color dynamically
      const greenValue = Math.round((percentage / 100) * 255); // Scale green intensity from 0 to 255
      const strokeColor = `rgb(${255 - greenValue}, 255, ${255 - greenValue})`; // Transition from white to green
      // Determine if bacteria are present (for health indicator)
      const hasBacteria = particles.some((p) => p instanceof Bacteria);
      const isHealthIndicator = canvasId === "health-indicator";
      const isGrowthIndicator = canvasId === "growth-indicator";

      // Set shadow color based on bacteria presence for health indicator
      let shadowColor;
      if (isHealthIndicator && hasBacteria) {
        shadowColor = "rgba(255, 0, 0, 0.8)"; // Red glow for bacteria
      } else {
        shadowColor = `rgba(0, ${greenValue}, 0, 0.6)`; // Normal green glow
      }

      const textColor = `rgb(${255 - greenValue}, 255, ${255 - greenValue})`;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "#2a2a2a";
      ctx.lineWidth = 5;
      ctx.stroke();

      // Progress circle with glow effect
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle =
        (isHealthIndicator || isGrowthIndicator) && hasBacteria
          ? "#ff4444"
          : strokeColor; // Red stroke for health indicator with bacteria
      ctx.lineWidth = 5;
      ctx.shadowBlur = isHealthIndicator && hasBacteria ? 15 : 10; // Increased glow for bacteria
      ctx.shadowColor = shadowColor;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Add percentage text in the center
      ctx.font = "12px Arial";
      ctx.fillStyle = isHealthIndicator && hasBacteria ? "#ff4444" : textColor; // Red text for health indicator with bacteria
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Draw percentage text
      ctx.font = "12px Arial";
      ctx.fillStyle =
        (isHealthIndicator || isGrowthIndicator) && hasBacteria
          ? "#ff4444"
          : textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${Math.round(percentage)}%`, centerX, centerY);
    }
    function minimizeToLogo() {
      const infoDiv = $(".environment-info");
      const logoCircle = $("#logo-circle");
      const logoPosition = logoCircle.offset();

      infoDiv.css({
        transition: "all 0.3s ease-in-out",
        transform: "scale(0.1)",
        opacity: "0",
        top: `${logoPosition.top}px`,
        left: `${logoPosition.left}px`
      });

      setTimeout(() => {
        infoDiv.hide();
        logoCircle.addClass("glowing");
      }, 300);

      window.isInfoVisible = false;
    }
    // Full contract address
    const fullAddress = "EvbiweDW89sZPmbZMQ5FGd3Ga3u1apfHFxWSSDFRpump";

    // Function to truncate the address
    function truncateAddress(address) {
      if (address.length > 20) {
        return address.slice(0, 10) + "..." + address.slice(-10);
      }
      return address;
    }

    // Populate the truncated address on load
    document.getElementById("truncated-address").innerText = truncateAddress(
      fullAddress
    );
    document.getElementById("full-address").innerText = fullAddress; // Keep the full address hidden

    // Add Copy-to-Clipboard functionality
    document
      .getElementById("copy-address-btn")
      .addEventListener("click", () => {
        // Copy the full address to the clipboard
        navigator.clipboard
          .writeText(fullAddress)
          .then(() => {
            alert("Contract address copied to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy address: ", err);
          });
      });

    function updateInfo() {
      const params = calculateEnvironmentParams();
      window.isInfoVisible = true;
      const closeButton = `
    <div 
        class="info-close" 
        style="position: absolute; top: 0px; right: 10px; cursor: pointer; color: rgba(255,255,255,0.8); font-size: 22px; text-decoration: none; border: none; outline: none; background: none;"
    >
        ×
    </div>`;
      
const styleSheet = document.createElement("style");
styleSheet.textContent = `
/* Base style for the animated condition text */
.condition-text {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-weight: 500;
    display: inline-block;
    position: relative;
    background-size: 200%;
    will-change: background-position, text-shadow;
    transform: translateZ(0);
    
}

.condition-glow::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: inherit;
    filter: blur(10px);
    opacity: 0.2;
    z-index: -1;
    border-radius: 4px;
}
`;
document.head.appendChild(styleSheet);

let condition, conditionColor, animationClass;
if (priceChange1hr < -15) {
    condition = "Contaminated";
    conditionColor = "linear-gradient(90deg, #ff4444, #ff4444, #ff4444)";
} else {
 if (marketCap < 50000) {
    condition = "Emerging Habitat";
    conditionColor = "linear-gradient(45deg, #00C6FB, #A0D8F1, #005BEA)"; // Already vibrant
} else if (marketCap < 100000) {
    condition = "Expanding Waters";
    conditionColor = "linear-gradient(45deg, #00FF9D, #7FFFD4, #00FFB3)"; // Brighter aqua/mint
    animationClass = "condition-animate-shake";
} else if (marketCap < 1000000) {
    condition = "Vibrant Reef";
    conditionColor = "linear-gradient(45deg, #FFE259, #F3D250, #FFA751)"; // Already vibrant
} else if (marketCap < 1000000) {
    condition = "Dynamic Ecosystem";
    conditionColor = "linear-gradient(45deg, #FF416C, #F5C979, #FF4B2B)"; // Already vibrant
} else if (marketCap < 2500000) {
    condition = "Thriving Biodiversity";
    conditionColor = "linear-gradient(45deg, #7FFF00, #98FB98, #90EE90)"; // Brighter greens
} else if (marketCap < 5000000) {
    condition = "Bursting Ecosystem";
    conditionColor = "linear-gradient(45deg, #00FFFF, #40E0D0, #00CED1)"; // Brighter cyan
} else if (marketCap < 10000000) {
    condition = "Oceanic Metropolis";
    conditionColor = "linear-gradient(45deg, #4169E1, #87CEEB, #1E90FF)"; // Brighter blues
} else if (marketCap < 15000000) {
    condition = "Marine Haven";
    conditionColor = "linear-gradient(45deg, #4682B4, #00BFFF, #26D0CE)"; // Brighter blue-cyan
} else if (marketCap < 20000000) {
    condition = "Aquatic Utopia";
    conditionColor = "linear-gradient(45deg, #4B0082, #9370DB, #8A2BE2)"; // Brighter purple
} else {
    condition = "Endless Ocean";
    conditionColor = "linear-gradient(45deg, #0000FF, #4169E1, #1E90FF)"; // Brighter deep blue
}
}
      // Calculate progress towards the next milestone
      let nextMilestone;
      if (marketCap < 50000) {
        nextMilestone = 50000;
      } else if (marketCap < 70000) {
        nextMilestone = 70000;
      } else if (marketCap < 100000) {
        nextMilestone = 100000;
      } else if (marketCap < 250000) {
        nextMilestone = 250000;
      } else if (marketCap < 500000) {
        nextMilestone = 500000;
      } else if (marketCap < 1000000) {
        nextMilestone = 1000000;
      } else if (marketCap < 2500000) {
        nextMilestone = 2500000;
      } else if (marketCap < 5000000) {
        nextMilestone = 5000000;
      } else if (marketCap < 10000000) {
        nextMilestone = 10000000;        
      } else if (marketCap < 15000000) {
        nextMilestone = 15000000;    
      } else if (marketCap < 20000000) {
        nextMilestone = 20000000;          
      } else {
        nextMilestone = null;
      }
      
        // Format the condition with animation
const conditionHTML = `<span class="condition-text ${animationClass}" style="background-image: ${conditionColor};">${condition}</span>`;


      const progressPercent = nextMilestone
        ? Math.min(((marketCap / nextMilestone) * 100).toFixed(1), 100)
        : 100;

      // Progress bar HTML
      const hasBacteria = particles.some((p) => p instanceof Bacteria);
      const progressBarHTML = nextMilestone
        ? `
<div style="margin-top: 10px; margin-bottom: ${
            priceChange1hr < -15 ? "10px" : "0"
          }; font-size: 14px;">
    <span style="color: ${hasBacteria ? "#ff4444" : "#ffffff"};">${
            hasBacteria ? "Progress on Hold" : `Next Stage at `
          }</span>
    ${
      hasBacteria
        ? ""
        : `<span style="color: #00ff00;">$${nextMilestone.toLocaleString()}</span>
    <span style="color: #ffffff;">MC</span>`
    }
<div style="
    background: #2a2a2a;
    border-radius: 10px;
    height: 12px;
    position: relative;
    width: 100%;
    overflow: hidden;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.8);
    margin-top: 7px;
    margin-bottom: 5px;
">
    <div style="
        background: ${
          hasBacteria
            ? "#ff4444"
            : "linear-gradient(to right, #00e7f5, #14F195, #9945FF)"
        };
        border-radius: 10px;
        height: 100%;
        width: ${progressPercent}%;
        transition: width 0.5s;
        box-shadow: 0 0 10px ${
          hasBacteria ? "rgba(255, 68, 68, 0.6)" : "rgba(20, 241, 149, 0.6)"
        };
    "></div>
</div></div>`
        : `<div style="
        margin-top: 0;
        margin-bottom: 0;
        font-size: 15px;
        color: #ffffff;
    ">
        All Species Introduced!
    </div>`;

      // Bacteria warning
      const bacteriaWarning =
        priceChange1hr < -15 && particles.some((p) => p instanceof Bacteria)
          ? `<div class="warning-label" style="
        color: #ff4444; 
        font-weight: 400; 
        animation: pulse 1.5s infinite;
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
        text-align: left;
    ">⚠️ WARNING: Hostile bacteria detected! Stabilize price immediately.</div>`
          : "";

      const indicatorsHTML = `
    <div id="indicators-container" style="display: flex; justify-content: space-around; margin-top: 10px; padding: 0; border: none; background-color: transparent;">
        <div style="display: flex; flex-direction: column; align-items: center; margin: 0; padding: 0; border: none; background-color: transparent;">
            <canvas id="capacity-indicator" width="80" height="80" style="display: block; margin: 0; padding: 0; border: none; background-color: transparent;"></canvas>
            <div style="font-size: 12px; color: #ffffff; text-align: center; margin: 0; padding: 5px 0; border: none; background-color: transparent;">Capacity</div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; margin: 0; padding: 0; border: none; background-color: transparent;">
            <canvas id="health-indicator" width="80" height="80" style="display: block; margin: 0; padding: 0; border: none; background-color: transparent;"></canvas>
            <div style="font-size: 12px; color: #ffffff; text-align: center; margin: 0; padding: 5px 0; border: none; background-color: transparent;">Health</div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; margin: 0; padding: 0; border: none; background-color: transparent;">
            <canvas id="growth-indicator" width="80" height="80" style="display: block; margin: 0; padding: 0; border: none; background-color: transparent;"></canvas>
            <div style="font-size: 12px; color: #ffffff; text-align: center; margin: 0; padding: 5px 0; border: none; background-color: transparent;">Growth</div>
        </div>
    </div>`;

// Get the current UTC time and format it
const now = new Date();
const utcHour = now.getUTCHours();
const utcMinute = now.getUTCMinutes();
const formattedUTCTime = `${utcHour.toString().padStart(2, '0')}:${utcMinute.toString().padStart(2, '0')}`;

// Update infoDiv
infoDiv.html(
  `${closeButton}
  <h3 style="margin: 0 0 5px 0; text-align: center;">Environment Status</h3>
<h3 style="text-align: center; font-size: 14px; color: rgba(255, 255, 255, 0.7);">
  ${formattedUTCTime} UTC
  <img 
    src="${isDay ? 'https://i.ibb.co/VjqCwkg/sun-1.png' : 'https://i.ibb.co/1rd2vyH/moon.png'}" 
    alt="${isDay ? 'Sun' : 'Moon'}" 
    style="width: 14px; height: 14px; vertical-align: middle; margin-bottom: 2px;margin-left: 2px" 
  />
</h3>
  ${indicatorsHTML}
  <div>Market Cap: $${marketCap.toLocaleString()}</div>
  <div>Price Change (1hr): <span style="color: ${
    priceChange1hr < 0 ? "#ff4444" : "#00ff00"
  }">${priceChange1hr}%</span></div>
        <div>Stage: ${conditionHTML}</div>
  <div>Total Population: ${particles.length}</div>
  ${progressBarHTML}
  ${bacteriaWarning}`
);

      // Add click handler for close button
      $(".info-close")
        .off("click")
        .on("click", function (e) {
          e.stopPropagation();
          const infoDiv = $(".environment-info");
          const logoCircle = $("#logo-circle");
          const logoPosition = logoCircle.offset();

          infoDiv.css({
            transition: "all 0.3s ease-in-out",
            transform: "scale(0.1)",
            opacity: "0",
            top: `${logoPosition.top}px`,
            left: `${logoPosition.left}px`
          });

          setTimeout(() => {
            infoDiv.hide();
            logoCircle.addClass("glowing");
          }, 300);

          window.isInfoVisible = false;
        });

      // Also update the close button handler
      $(".info-close")
        .off("click")
        .on("click", function (e) {
          e.stopPropagation();
          const infoDiv = $(".environment-info");
          const logoCircle = $("#logo-circle");
          const logoPosition = logoCircle.offset();

          infoDiv.css({
            transition: "all 0.3s ease-in-out",
            transform: "scale(0.1)",
            opacity: "0",
            top: `${logoPosition.top}px`,
            left: `${logoPosition.left}px`
          });

          setTimeout(() => {
            infoDiv.css("display", "none");
            logoCircle.addClass("glowing");
          }, 300);

          isInfoVisible = false;
        });
      // Calculate indicator percentages
      const capacityPercentage = Math.min((particles.length / 700) * 100, 100);
      // Exclude Food and Bacteria from growth calculation
      const nonGrowthParticles = particles.filter(
        (p) => !(p instanceof Food || p instanceof Bacteria)
      );
      const uniqueSpecies = [
        ...new Set(nonGrowthParticles.map((p) => p.constructor.name))
      ];
      const totalSpecies = 32; // Replace with your actual total number of species

      const growthPercentage = Math.min(
        (uniqueSpecies.length / totalSpecies) * 100,
        100
      );

      // Example health calculation (replace with real metrics)
      const harmfulParticles = particles.filter((p) => p instanceof Bacteria)
        .length;
      const harmfulRatio =
        particles.length > 0 ? harmfulParticles / particles.length : 0;
      const priceStability = Math.max(100 - Math.abs(priceChange1hr), 0); // Stability = 100 - volatility
      const averageSpeed =
        particles.reduce((sum, p) => sum + (p.speed || 0), 0) /
          particles.length || 0;

      // Apply a significant penalty if bacteria are present
      const bacteriaPenalty = harmfulParticles > 0 ? 20 : 0; // Add penalty if harmful particles are detected

      const healthPercentage = Math.min(
        0.5 * priceStability +
          0.3 * (1 - harmfulRatio) * 100 +
          0.2 * averageSpeed * 100 -
          bacteriaPenalty, // Subtract bacteria penalty
        100
      );
      // Update indicators dynamically
      updateIndicator("capacity-indicator", capacityPercentage, "Capacity");
      updateIndicator("health-indicator", healthPercentage, "Health");
      updateIndicator("growth-indicator", growthPercentage, "Growth");
    }

    function drawIndicator(ctx, value, color) {
      const centerX = 40;
      const centerY = 40;
      const radius = 28;
      const startAngle = -0.5 * Math.PI;
      const endAngle = (value / 100) * 2 * Math.PI - 0.5 * Math.PI;

      // Clear canvas
      ctx.clearRect(0, 0, 80, 80);

      // Background circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(100, 100, 100, 0.3)";
      ctx.lineWidth = 6;
      ctx.stroke();

      // Progress circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.stroke();

      // Text
      ctx.font = "12px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${value}%`, centerX, centerY);
    }

    $("body").append(infoDiv);
    setInterval(updateInfo, 1000);
  }

  function getProbabilitiesBasedOnThreshold(marketCap) {
    if (marketCap < 50000) {
      return {
        paramecium: 0.9,
        plankton: 0.1,
        fishEgg: 0,
        fishLarvaEgg: 0,
        fishLarva: 0,
        neonTrail: 0,
        rainbowTrail: 0,
        jellyfish: 0,
        stingray: 0,
        undulatingSerpent: 0,
      };
    } else if (marketCap < 70000) {
      return {
        paramecium: 0.7,
        plankton: 0.2,
        fishEgg: 0.1,
        fishLarvaEgg: 0,
        fishLarva: 0,
        neonTrail: 0,
        rainbowTrail: 0,
        jellyfish: 0,
        stingray: 0,
        undulatingSerpent: 0
      };
    } else if (marketCap < 100000) {
      return {
        paramecium: 0.5,
        plankton: 0.3,
        fishEgg: 0.1,
        fishLarvaEgg: 0.1,
        fishLarva: 0,
        neonTrail: 0,
        rainbowTrail: 0,
        jellyfish: 0,
        stingray: 0,
        undulatingSerpent: 0
      };
    } else if (marketCap < 250000) {
      return {
        paramecium: 0.3,
        plankton: 0.3,
        fishEgg: 0.2,
        fishLarvaEgg: 0.2,
        fishLarva: 0,
        neonTrail: 0,
        rainbowTrail: 0,
        jellyfish: 0,
        stingray: 0,
        undulatingSerpent: 0
      };
    } else if (marketCap < 500000) {
      return {
        paramecium: 0.2,
        plankton: 0.3,
        fishEgg: 0.1,
        fishLarvaEgg: 0.2,
        fishLarva: 0.2,
        neonTrail: 0,
        rainbowTrail: 0,
        jellyfish: 0,
        stingray: 0,
        undulatingSerpent: 0
      };
    } else if (marketCap < 1000000) {
      return {
        paramecium: 0.1, 
        plankton: 0.3,
        fishEgg: 0.1,
        fishLarvaEgg: 0.2,
        fishLarva: 0.25,
        neonTrail: 0.05,
        rainbowTrail: 0,
        jellyfish: 0,
        stingray: 0,
        undulatingSerpent: 0,
      };
    } else if (marketCap < 2500000) {
      return {
        paramecium: 0.1,
        plankton: 0.1,
        fishEgg: 0.05,
        fishLarvaEgg: 0.2,
        fishLarva: 0.25,
        neonTrail: 0.05,
        rainbowTrail: 0.05,
        jellyfish: 0,
        stingray: 0,
        undulatingSerpent: 0
      };
    } else if (marketCap < 5000000) {
      return {
        paramecium: 0.1,
        plankton: 0.05,       
        fishEgg: 0.05,
        fishLarvaEgg: 0.2,
        fishLarva: 0.4,
        neonTrail: 0.05,
        rainbowTrail: 0.05,
        jellyfish: 0.02,
        stingray: 0,
        undulatingSerpent: 0
      };
    } else if (marketCap < 10000000) {
      return {
        paramecium: 0.1,
        plankton: 0.3,  
        fishEgg: 0.05,        
        fishLarvaEgg: 0.12,
        fishLarva: 0.4,
        neonTrail: 0.05,
        rainbowTrail: 0.05,
        jellyfish: 0.02,
        stingray: 0.02,
        undulatingSerpent: 0
      };   
    } else if (marketCap < 15000000) {
      return {
        paramecium: 0.1, 
        plankton: 0.1,         
        fishEgg: 0.05,
        fishLarvaEgg: 0.11,
        fishLarva: 0.4,
        neonTrail: 0.15,
        rainbowTrail: 0.08,
        jellyfish: 0,
        stingray: 0.1,
        undulatingSerpent: 0.01
      };        
    }
  }

  function calculateEnvironmentParams() {
    const marketCapPercent = marketCap / MAX_MARKETCAP; // Scale marketCap to a percentage
    const baseParticles = 50;
    const marketCapDropPercent =
      previousMarketCap > 0
        ? (previousMarketCap - marketCap) / previousMarketCap
        : 0;

    return {
      maxParticles: Math.floor(
        baseParticles + marketCapPercent * marketCapPercent * 700
      ),
      particleSpeed: 0.3 + marketCapPercent * 1.4,
      colorIntensity: marketCapPercent,
      particleSize: 0.5,
      bacteriaSpawnRate: marketCapDropPercent > 0.1 ? 0.3 : 0,
      particleProbabilities: getProbabilitiesBasedOnThreshold(marketCap) // Use dynamic thresholds
    };
  }
  // Flag to track if the tooltip is active
  let isHintTooltipActive = false;

  // Create the tooltip element
  const hintTooltip = $(
    '<div id="hint-tooltip">Hold down your mouse to feed the fish!</div>'
  ).css({
    position: "absolute",
    padding: "10px 20px",
    background: "rgba(0, 0, 0, 0.8)",
    color: "white",
    fontSize: "12px",
    "font-family": "Inter Tight, sans-serif",
    borderRadius: "5px",
    zIndex: 1000,
    pointerEvents: "none",
    display: "none" // Hidden by default
  });

  // Append tooltip to body
  $("body").append(hintTooltip);

  // Track the mouse position
  $(document).on("mousemove", function (e) {
    mouseX = e.pageX;
    mouseY = e.pageY;

    // Update tooltip position only if it's active
    if (isHintTooltipActive) {
      hintTooltip.css({
        top: `${mouseY + 15}px`,
        left: `${mouseX + 15}px`
      });
    }
  });

  // Function to show the tooltip after guided tooltip fades out
  function showHintTooltip() {
    isHintTooltipActive = true; // Mark tooltip as active
    hintTooltip.css({
      top: `${mouseY + 15}px`, // Start near the cursor
      left: `${mouseX + 15}px`,
      display: "block"
    });

    // Automatically hide the tooltip after 5 seconds
    setTimeout(() => {
      if (isHintTooltipActive) {
        hintTooltip.fadeOut(300, function () {
          $(this).hide(); // Hide but don't remove from DOM
          isHintTooltipActive = false; // Reset flag
        });
      }
    }, 5000);
  }

  // Hide tooltip on click
  $(document).on("click", function () {
    if (isHintTooltipActive) {
      hintTooltip.fadeOut(300, function () {
        $(this).hide(); // Hide but don't remove from DOM
        isHintTooltipActive = false; // Reset flag
      });
    }
  });
  // Mini progress bar near cursor
  const progressBar = $('<div id="cursor-progress-bar"></div>').css({
    position: "absolute",
    width: "20px",
    height: "4px",
    background: "rgba(0, 0, 0, 0.5)",
    borderRadius: "2px",
    overflow: "hidden",
    zIndex: 1000,
    display: "none"
  });

  const progressFill = $("<div></div>").css({
    height: "100%",
    width: "0%",
    background: "#00E7F5",
    transition: "width 0.3s linear"
  });

  progressBar.append(progressFill);
  $("body").append(progressBar);

  // Hold logic with delay
  let holdTimer = null;
  const holdDuration = 3000; // 3 seconds
  const progressBarDelay = 500; // 0.5 secondss
  let isHolding = false;
  let delayTimer = null;

  $(document).on("mousedown", function (e) {
    if (isHolding) return; // Prevent multiple triggers

    isHolding = true;
    progressFill.css("width", "0%");

    // Delay the display of the progress bar
    delayTimer = setTimeout(() => {
      progressBar.css({
        display: "block",
        top: `${e.pageY + 20}px`,
        left: `${e.pageX}px`
      });
      // Start progress animation
      progressFill.animate({ width: "100%" }, holdDuration, "linear");
    }, progressBarDelay);

    // After hold duration, drop food
    holdTimer = setTimeout(() => {
      createFoodAtClick(e.pageX, e.pageY); // Drop food
      progressBar.fadeOut();
    }, holdDuration + progressBarDelay);
  });

  $(document).on("mousemove", function (e) {
    progressBar.css({ top: `${e.pageY + 20}px`, left: `${e.pageX}px` });
  });

  $(document).on("mouseup", function () {
    if (isHolding) {
      clearTimeout(holdTimer);
      clearTimeout(delayTimer); // Cancel progress bar delay
      progressBar.fadeOut();
      progressFill.stop().css("width", "0%"); // Reset progress
      isHolding = false;
    }
  });
class Plankton {
    constructor(canvas, progress) {
        const params = calculateEnvironmentParams();
        const random = Math.random();

        this.canvas = canvas;
        this.progress = progress || 0;
        this.zIndex = 1;
        this.speciesName = "Bioluminescent Plankton";
        this.behavior = "Clusters of microscopic drifters that produce a blue light when disturbed";
        this.colorDescription = "Moonlit pearl";

        this.w = $(window).width();
        this.h = $(window).height();

        // Very slow self-motion
        this.s = 0.01 + random * 0.01;
        this.a = Math.random() * Math.PI * 2;

        // Base cluster radius
        const baseRadius = 1.5 + random * 1;
        this.radius = Math.min(baseRadius * params.particleSize, 2);

        // Swarm logic
        this.swarmId = Math.floor(Math.random() * 5);
        this.sameSwarmRadius = 120;
        this.sameSwarmStrength = 0.05; 
        this.separationDistance = 12;
        this.crossSwarmRadius = 80;
        this.crossSwarmStrength = 0.02;

        // Slow group drift
        this.driftSpeed = 0.01;
        this.driftVariation = 0.0003;
        this.groupAngle = (this.swarmId / 5) * Math.PI * 2;
        this.currentAngle = Math.random() * Math.PI * 2;
        this.currentStrength = 0.01;

        // Each sub-dot has its own luminescentTimer
        this.maxLuminescentFrames = 60;

        // Sub-particles => bigger spread (40..80 px from center)
        const subDotCount = 20 + Math.floor(Math.random() * 11); 
        this.subDots = [];
        // We'll store a "clusterMaxDist" so we know the bounding circle radius:
        this.clusterMaxDist = 80; // 80 is the max sub-dot distance (40..80) + a small margin if you like

        for (let i = 0; i < subDotCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 40; // 40..80 px => big cluster
            this.subDots.push({
                offsetX: Math.cos(angle) * distance,
                offsetY: Math.sin(angle) * distance,
                r: 0.5 + Math.random() * 1,
                luminescentTimer: 0
            });
        }

        // Random spawn
        this.x = Math.random() * this.w;
        this.y = Math.random() * this.h;
    }

    calculateSwarmInfluence(particles) {
        let centerXSame = 0;
        let centerYSame = 0;
        let countSame = 0;

        let centerXCross = 0;
        let centerYCross = 0;
        let countCross = 0;

        let separationX = 0;
        let separationY = 0;

        for (const other of particles) {
            if (!(other instanceof Plankton) || other === this) continue;

            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // separation
            if (dist < this.separationDistance) {
                separationX -= dx;
                separationY -= dy;
            }

            if (other.swarmId === this.swarmId) {
                // same-swarm
                if (dist < this.sameSwarmRadius) {
                    centerXSame += other.x;
                    centerYSame += other.y;
                    countSame++;
                }
            } else {
                // cross-swarm
                if (dist < this.crossSwarmRadius) {
                    centerXCross += other.x;
                    centerYCross += other.y;
                    countCross++;
                }
            }
        }

        // same-swarm attraction
        if (countSame > 0) {
            centerXSame /= countSame;
            centerYSame /= countSame;
            const angleToCenter = Math.atan2(
                centerYSame - this.y, 
                centerXSame - this.x
            );
            this.a += (angleToCenter - this.a) * (this.sameSwarmStrength * 0.3);
        }

        // cross-swarm attraction
        if (countCross > 0) {
            centerXCross /= countCross;
            centerYCross /= countCross;
            const angleToCenter = Math.atan2(
                centerYCross - this.y, 
                centerXCross - this.x
            );
            this.a += (angleToCenter - this.a) * (this.crossSwarmStrength * 0.3);
        }

        // apply separation
        const sepAngle = Math.atan2(separationY, separationX);
        this.a += (sepAngle - this.a) * 0.02;

        // speed changes if near neighbors
        if (countSame + countCross > 0) {
            this.s = Math.min(this.s * 1.005, 0.04);
        } else {
            this.s *= 0.995;
        }
    }

    renderSubDot(ctx, subX, subY, r, sd) {
        const glowFraction = sd.luminescentTimer / this.maxLuminescentFrames;
        if (sd.luminescentTimer <= 0) {
            // faint white
            ctx.beginPath();
            ctx.arc(subX, subY, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
            ctx.fill();
            ctx.closePath();
            return;
        }

        // bright aqua glow
        const rAqua = 0, gAqua = 200, bAqua = 255;
        const subDotGlowRadius = r * 2;
        const glow = ctx.createRadialGradient(
            subX, subY, 0, 
            subX, subY, subDotGlowRadius
        );
        glow.addColorStop(
            0,
            `rgba(${rAqua}, ${gAqua}, ${bAqua}, ${glowFraction})`
        );
        glow.addColorStop(1, `rgba(${rAqua}, ${gAqua}, ${bAqua}, 0)`);

        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(subX, subY, subDotGlowRadius, 0, Math.PI * 2);
        ctx.fill();

        // bright core
        ctx.beginPath();
        ctx.arc(subX, subY, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + 0.3 * glowFraction})`;
        ctx.fill();
        ctx.closePath();

        // optional bigger faint halo
        const bigHaloRadius = 50; 
        const halo = ctx.createRadialGradient(
            subX, subY, 0, 
            subX, subY, bigHaloRadius
        );
        halo.addColorStop(0, `rgba(0, 200, 255, ${0.02 * glowFraction})`);
        halo.addColorStop(1, 'rgba(0, 200, 255, 0)');
        ctx.beginPath();
        ctx.fillStyle = halo;
        ctx.arc(subX, subY, bigHaloRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    render() {
        const ctx = this.canvas;
        // No cluster-wide glow => only sub-dots
        for (const sd of this.subDots) {
            const subX = this.x + sd.offsetX;
            const subY = this.y + sd.offsetY;
            this.renderSubDot(ctx, subX, subY, sd.r, sd);
        }
    }

 move() {
    // minimal ocean current
    this.currentAngle += (Math.random() - 0.5) * 0.002;
    const currentX = Math.cos(this.currentAngle) * this.currentStrength;
    const currentY = Math.sin(this.currentAngle) * this.currentStrength;

    // swarm logic
    this.calculateSwarmInfluence(particles);

    // self-propel
    this.x += Math.cos(this.a) * this.s + currentX;
    this.y += Math.sin(this.a) * this.s + currentY;

    // random angle wiggle
    this.a += (Math.random() - 0.5) * 0.1;

    // group drift
    this.groupAngle += (Math.random() - 0.5) * this.driftVariation;
    this.x += Math.cos(this.groupAngle) * this.driftSpeed;
    this.y += Math.sin(this.groupAngle) * this.driftSpeed;

    // brownian jitter
    this.x += (Math.random() - 0.5) * 0.1;
    this.y += (Math.random() - 0.5) * 0.1;

    // Handle luminescence decay
    for (const sd of this.subDots) {
      if (sd.luminescentTimer > 0) {
        // Decay luminescence more smoothly with adjustable rate
        const decayRate = 2; // Adjust this value: lower = slower fade, higher = faster fade
        sd.luminescentTimer = Math.max(0, sd.luminescentTimer - decayRate);
      }

        // Mouse proximity check
        const subX = this.x + sd.offsetX;
        const subY = this.y + sd.offsetY;
        const dx = subX - mouseX;
        const dy = subY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 20) {
            sd.luminescentTimer = this.maxLuminescentFrames;
        }
    }

    // Collision detection with other particles
    for (const other of particles) {
        if (other === this) continue;

        // Quick bounding circle check
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Let's add a small margin for sub-dot size
        const boundingRadius = this.clusterMaxDist + (other.radius || 2);
        if (dist > boundingRadius) {
            // too far => no collisions possible with sub-dots
            continue;
        }

        // If we pass bounding check, check each sub-dot
        for (const sd of this.subDots) {
            const subX = this.x + sd.offsetX;
            const subY = this.y + sd.offsetY;
            const odx = other.x - subX;
            const ody = other.y - subY;
            const odist = Math.sqrt(odx * odx + ody * ody);

            // Overlap threshold
            const overlapDist = (sd.r + (other.radius || 2)) * 0.5;
            if (odist < overlapDist) {
                sd.luminescentTimer = this.maxLuminescentFrames;
                break; // Exit sub-dot loop once we find a collision
            }
        }
    }

    // screen wrapping
    if (this.x < -this.radius) this.x = this.w + this.radius;
    if (this.x > this.w + this.radius) this.x = -this.radius;
    if (this.y < -this.radius) this.y = this.h + this.radius;
    if (this.y > this.h + this.radius) this.y = -this.radius;

    // Render
    this.render();
    this.progress++;
    return true;
}
}
let lastCoralConfig = null;
  
function getCoralConfigForMarketCap(marketCap) {
    // Base configuration
    const config = {
        shouldSpawn: false,
        gridSize: 0,
        spawnChance: 0,
        maxClustersPerCell: 0,
        baseSize: 50,
        allowedColors: ['cyan'],
        health: 0
    };

    // No corals below 50k
    if (marketCap < 50000) {
        return config;
    }

    // Emerging coral bed (50k - 100k)
    if (marketCap < 100000) {
        return {
            ...config,
            shouldSpawn: true,
            gridSize: 4,
            spawnChance: 0.3,
            maxClustersPerCell: 1,
            allowedColors: ['cyan'],
            health: 0.3
        };
    }

    // Growing coral bed (100k - 250k)
    if (marketCap < 250000) {
        return {
            ...config,
            shouldSpawn: true,
            gridSize: 4,
            spawnChance: 0.4,
            maxClustersPerCell: 1,
            allowedColors: ['cyan', 'azure'],
            health: 0.4
        };
    }

    // Developing coral bed (250k - 500k)
    if (marketCap < 500000) {
        return {
            ...config,
            shouldSpawn: true,
            gridSize: 5,
            spawnChance: 0.45,
            maxClustersPerCell: 2,
            allowedColors: ['cyan', 'azure', 'purple'],
            health: 0.5
        };
    }

    // Thriving coral bed (500k - 1M)
    if (marketCap < 1000000) {
        return {
            ...config,
            shouldSpawn: true,
            gridSize: 5,
            spawnChance: 0.5,
            maxClustersPerCell: 2,
            allowedColors: ['cyan', 'azure', 'purple', 'pink'],
            health: 0.6
        };
    }

    // Flourishing coral bed (1M - 2.5M)
    if (marketCap < 2500000) {
        return {
            ...config,
            shouldSpawn: true,
            gridSize: 6,
            spawnChance: 0.55,
            maxClustersPerCell: 2,
            allowedColors: ['azure', 'purple', 'pink', 'magenta'],
            health: 0.7
        };
    }

    // Advanced coral bed (2.5M - 5M)
    if (marketCap < 5000000) {
        return {
            ...config,
            shouldSpawn: true,
            gridSize: 6,
            spawnChance: 0.6,
            maxClustersPerCell: 2,
            allowedColors: ['purple', 'pink', 'magenta', 'green'],
            health: 0.8
        };
    }

    // Rich coral bed (5M - 7.5M)
    if (marketCap < 7500000) {
        return {
            ...config,
            shouldSpawn: true,
            gridSize: 7,
            spawnChance: 0.65,
            maxClustersPerCell: 3,
            allowedColors: ['magenta', 'green', 'teal', 'gold'],
            health: 0.9
        };
    }

    // Pristine coral bed (7.5M - 10M)
    if (marketCap < 10000000) {
        return {
            ...config,
            shouldSpawn: true,
            gridSize: 7,
            spawnChance: 0.7,
            maxClustersPerCell: 3,
            allowedColors: ['green', 'teal', 'gold'],
            health: 0.95
        };
    }

    // Maximum coral bed (10M+)
    return {
        ...config,
        shouldSpawn: true,
        gridSize: 8,
        spawnChance: 0.7,
        maxClustersPerCell: 3,
        allowedColors: ['teal', 'gold', 'rainbow'],
        health: 1
    };
}

function updateCoralFormations(marketCap) {
    const config = getCoralConfigForMarketCap(marketCap);
    
    // If market cap drops below threshold, remove all corals
    if (!config.shouldSpawn) {
        particles = particles.filter(p => !(p instanceof Coral));
        coralsInitialized = false;
        lastCoralConfig = null;
        return;
    }
    
    // Check if we need to update corals based on significant config changes
    const configChanged = JSON.stringify(config) !== JSON.stringify(lastCoralConfig);
    if (!coralsInitialized || configChanged) {
        particles = particles.filter(p => !(p instanceof Coral));
        
        const marginX = window.innerWidth * 0.1;
        const marginY = window.innerHeight * 0.1;
        const cellWidth = (window.innerWidth - marginX * 2) / config.gridSize;
        const cellHeight = (window.innerHeight - marginY * 2) / config.gridSize;
        
        const coralBeds = [];
        
        // Generate positions using config parameters
        for (let i = 0; i < config.gridSize; i++) {
            for (let j = 0; j < config.gridSize; j++) {
                if (Math.random() < config.spawnChance) {
                    const baseX = marginX + i * cellWidth;
                    const baseY = marginY + j * cellHeight;
                    
                    const clusterSize = 1 + Math.floor(Math.random() * config.maxClustersPerCell);
                    for (let k = 0; k < clusterSize; k++) {
                        coralBeds.push({
                            x: baseX + Math.random() * cellWidth,
                            y: baseY + Math.random() * cellHeight
                        });
                    }
                }
            }
        }

        coralBeds.forEach(pos => {
            const coral = new Coral(
                canvas,
                pos.x,
                pos.y,
                config.baseSize * (0.7 + Math.random() * 0.6),
                config.health,
                config.allowedColors
            );
            particles.push(coral);
        });
        
        coralsInitialized = true;
        lastCoralConfig = config;
    }
}
  
class Coral {
    constructor(canvas, x, y, size, health = 1, allowedColors = ['cyan']) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.baseSize = size * 0.5;
        this.health = health;
        this.zIndex = 0;
        this.allowedColors = allowedColors;
        this.speciesName = "Coral";
        this.behavior = "Living architecture that flourishes with ecosystem health";
        this.colorDescription = "Starlit reef";
        
        this.colorScheme = this.selectColorScheme();
        this.branches = this.generateBranches();
        this.polyps = this.generatePolyps();
        this.rotation = Math.random() * Math.PI * 2;
        
        this.updateColors();
    }

    selectColorScheme() {
        const schemes = {
            cyan: { // Base color (50k+)
                healthy: {r: 31, g: 221, b: 255},
                unhealthy: {r: 100, g: 150, b: 255}
            },
            azure: { // Light blue variant (100k+)
                healthy: {r: 66, g: 218, b: 255},
                unhealthy: {r: 80, g: 140, b: 255}
            },
            purple: { // Purple (250k+)
                healthy: {r: 191, g: 127, b: 255},
                unhealthy: {r: 100, g: 100, b: 180}
            },
            pink: { // Pink (500k+)
                healthy: {r: 255, g: 130, b: 220},
                unhealthy: {r: 180, g: 100, b: 150}
            },
            magenta: { // Deep pink (1M+)
                healthy: {r: 255, g: 100, b: 255},
                unhealthy: {r: 180, g: 80, b: 180}
            },
            green: { // Seafoam green (2.5M+)
                healthy: {r: 130, g: 255, b: 190},
                unhealthy: {r: 100, g: 180, b: 150}
            },
            teal: { // Teal (5M+)
                healthy: {r: 64, g: 224, b: 208},
                unhealthy: {r: 50, g: 160, b: 150}
            },
            gold: { // Golden (7.5M+)
                healthy: {r: 255, g: 215, b: 100},
                unhealthy: {r: 180, g: 150, b: 80}
            },
            rainbow: { // Special rare variant (10M+)
                healthy: {r: 255, g: 255, b: 255},
                unhealthy: {r: 180, g: 180, b: 180}
            }
        };
        
        // Only select from allowed colors
        const availableSchemes = this.allowedColors.map(color => schemes[color]);
        return availableSchemes[Math.floor(Math.random() * availableSchemes.length)];
    }

    updateColors() {
        const {healthy, unhealthy} = this.colorScheme;
        const r = Math.floor(unhealthy.r + (healthy.r - unhealthy.r) * this.health);
        const g = Math.floor(unhealthy.g + (healthy.g - unhealthy.g) * this.health);
        const b = Math.floor(unhealthy.b + (healthy.b - unhealthy.b) * this.health);
        
        this.baseColor = `rgba(${r}, ${g}, ${b}, 0.15)`;
        this.glowColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
        this.polypsColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
    }

    generateBranchPoints(length) {
        const points = [];
        const segments = 5;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const offset = Math.sin(t * Math.PI) * (Math.random() * 5);
            points.push({
                x: t * length + offset,
                y: offset
            });
        }
        
        return points;
    }

    generateBranches() {
        const branches = [];
        const branchCount = 4 + Math.floor(this.health * 4);
        
        // Create main branches
        for (let i = 0; i < branchCount; i++) {
            const angle = (i / branchCount) * Math.PI * 2 + Math.random() * 0.5;
            const length = this.baseSize * (0.4 + Math.random() * 0.3);
            const width = this.baseSize * 0.12;
            
            branches.push({
                angle,
                length,
                width,
                points: this.generateBranchPoints(length)
            });

            // Add sub-branches
            if (Math.random() < 0.7) {
                const subAngle = angle + (Math.random() - 0.5) * 0.5;
                const subLength = length * (0.4 + Math.random() * 0.3);
                branches.push({
                    angle: subAngle,
                    length: subLength,
                    width: width * 0.7,
                    points: this.generateBranchPoints(subLength)
                });
            }
        }
        
        return branches;
    }

    generatePolyps() {
        const polyps = [];
        const polypsCount = Math.floor(8 + this.health * 15);
        
        this.branches.forEach(branch => {
            const branchPolyps = Math.floor(polypsCount / this.branches.length);
            
            for (let i = 0; i < branchPolyps; i++) {
                const t = Math.random();
                const angle = branch.angle + (Math.random() - 0.5) * 0.5;
                const distance = t * branch.length;
                const offset = (Math.random() - 0.5) * branch.width;
                
                // Cluster polyps
                const clusterSize = Math.random() < 0.3 ? 3 : 1;
                for (let j = 0; j < clusterSize; j++) {
                    polyps.push({
                        x: Math.cos(angle) * distance + offset + (Math.random() - 0.5) * 2,
                        y: Math.sin(angle) * distance + offset + (Math.random() - 0.5) * 2,
                        size: 0.4 + Math.random() * 1.2,
                        alpha: 0.3 + Math.random() * 0.4
                    });
                }
            }
        });
        
        return polyps;
    }

    draw() {
        const ctx = this.canvas;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw base glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.baseSize);
        gradient.addColorStop(0, this.glowColor);
        gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.baseSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw branches
        this.branches.forEach(branch => {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            
            branch.points.forEach((point, i) => {
                const x = Math.cos(branch.angle) * point.x - Math.sin(branch.angle) * point.y;
                const y = Math.sin(branch.angle) * point.x + Math.cos(branch.angle) * point.y;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.strokeStyle = this.baseColor;
            ctx.lineWidth = branch.width * (1.5 - Math.random() * 0.5);
            ctx.lineCap = 'round';
            ctx.stroke();
        });

        // Draw polyps
        this.polyps.forEach(polyp => {
            ctx.fillStyle = `rgba(31, 221, 255, ${polyp.alpha})`; // Corrected color format
            ctx.beginPath();
            ctx.arc(polyp.x, polyp.y, polyp.size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    move() {
        this.draw();
        return true;
    }
}

  class FishEgg {
    constructor(canvas) {
      const params = calculateEnvironmentParams();
      const random = Math.random();
      this.progress = 0;
      this.canvas = canvas;
      this.zIndex = 2;
      this.behavior =
        "Tiny beginnings of aquatic life, delicate and full of potential";
      this.colorDescription = "Frosted crystal";
      this.speciesName = "Fish Egg";

      this.x = Math.random() * $(window).width();
      this.y = Math.random() * $(window).height();

      this.w = $(window).width();
      this.h = $(window).height();

      this.radius = (12 + Math.random() * 6) * params.particleSize;

      const baseColor = [255, 255, 255];
      const intensity = 0.3 + params.colorIntensity * 0.7;
      this.color = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${intensity})`;

      this.fish_egg = {
        offset1:
          Math.random() > 0.5
            ? 0.5 + Math.random() * 3
            : 0.5 + Math.random() * -3,
        offset2:
          Math.random() > 0.5
            ? 0.5 + Math.random() * 3
            : 0.5 + Math.random() * -3,
        offset3:
          Math.random() > 0.5
            ? 0.5 + Math.random() * 3
            : 0.5 + Math.random() * -3,
        radius1: 0.5 + Math.random() * 5,
        radius2: 0.5 + Math.random() * 5,
        radius3: 0.5 + Math.random() * 5
      };

      this.variantx1 = Math.random() * 100;
      this.variantx2 = Math.random() * 100;
      this.varianty1 = Math.random() * 100;
      this.varianty2 = Math.random() * 100;

      this.speed = params.particleSpeed;
    }

    createCircle(x, y, r, c) {
      this.canvas.beginPath();
      this.canvas.fillStyle = c;
      this.canvas.arc(x, y, r, 0, Math.PI * 2, false);
      this.canvas.fill();
      this.canvas.closePath();
    }

    createEyes() {
      this.createCircle(
        this.x + this.fish_egg.offset2,
        this.y + this.fish_egg.offset2,
        this.fish_egg.radius2 + 4,
        "rgba(241, 242, 244, 0.5)"
      );
      this.createCircle(
        this.x + this.fish_egg.offset3,
        this.y + this.fish_egg.offset3,
        this.fish_egg.radius3 + 2,
        "rgba(255, 204, 67, 0.8)"
      );
      this.createCircle(
        this.x + Math.random(this.progress / 350) * this.fish_egg.offset1,
        this.y + Math.random(this.progress / 350) * this.fish_egg.offset1,
        this.fish_egg.radius1,
        "rgba(152, 19, 4, 0.6)"
      );
    }

    render() {
      const ctx = this.canvas;

      // Apply highlight effect if the particle is hovered
      if (this.isHighlighted) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 215, 0, 0.8)"; // Subtle white glow
        ctx.lineWidth = 2; // Thinner ring
        ctx.stroke();
        ctx.closePath();
      }

      // Draw the particle normally
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
      this.createEyes();

      this.canvas.beginPath();
      let c = "130, 151, 180";
      let rad = this.canvas.createRadialGradient(
        this.x,
        this.y,
        this.radius,
        this.x,
        this.y,
        1
      );
      rad.addColorStop(0, "rgba(" + c + ",0.5)");
      rad.addColorStop(0.9, "rgba(" + c + ",0)");
      this.canvas.lineWidth = Math.random() * 2.2;
      this.canvas.fillStyle = rad;
      this.canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      this.canvas.fill();
      this.canvas.strokeStyle = "rgba(255, 255, 217, 0.05)";
      this.canvas.stroke();
      this.canvas.closePath();
    }

    move() {
      this.x +=
        (Math.sin(this.progress / this.variantx1) *
          Math.cos(this.progress / this.variantx2)) /
        8;
      this.y +=
        (Math.sin(this.progress / this.varianty1) *
          Math.cos(this.progress / this.varianty2)) /
        8;

      // Wrap around the screen
      if (this.x < 0) this.x = this.w - this.radius;
      if (this.x > this.w) this.x = 0 + this.radius;
      if (this.y < 0) this.y = this.h - this.radius;
      if (this.y > this.h) this.y = 0 + this.radius;

      this.render();
      this.progress++;
      return true;
    }
  }

  class FishLarva {
    constructor(canvas, progress) {
      const params = calculateEnvironmentParams();
      const random = Math.random();
      this.progress = 0;
      this.canvas = canvas;
      this.speed = params.particleSpeed * (0.5 + random * 1.3);
      this.speciesName = "Fish Larva";
      this.behavior =
        "Young swimmers navigating their watery world with curiosity";
      this.colorDescription = "Sunset copper";
      this.zIndex = 3;

      this.x = Math.random() * $(window).width();
      this.y = Math.random() * $(window).height();

      this.s = 0.8 + Math.random() * 0.6;
      this.a = Math.random() * Math.PI * 2;

      this.w = $(window).width();
      this.h = $(window).height();
      this.radius = (3 + random * 2) * params.particleSize;

      // Leadership properties
      this.isLeader = Math.random() < 0.1;
      this.leadershipStrength = this.isLeader ? 0.8 + Math.random() * 0.2 : 0;
      this.visionRange = this.isLeader ? 250 : 150;
      this.separationRange = 40;
      this.alignmentRange = 100;
      this.maxSpeed = this.isLeader ? 2 : 1.6;
      this.minSpeed = 0.4;
      this.turnSpeed = 0.08;

      // Edge avoidance parameters
      this.edgeMargin = 100;
      this.cornerMargin = 150;
      this.edgeTurnForce = 0.15;
      this.cornerForce = 0.3;

      // Movement memory
      this.targetPoint = this.generateNewTarget();
      this.targetTimer = 0;
      this.targetDuration = 200 + Math.random() * 300;

      // Wanderlust
      this.wanderlust = this.isLeader
        ? 0.8 + Math.random() * 0.2
        : 0.2 + Math.random() * 0.3;

      // Color handling
      const intensity = 0.3 + params.colorIntensity * 0.7;
      const leaderColor = "#FFD700"; // Gold color for leaders
      const followerColor = "#F69A34"; // Orange color for followers
      const baseColor = this.hexToRgb(
        this.isLeader ? leaderColor : followerColor
      ) || { r: 246, g: 154, b: 52 };
      this.color = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${intensity})`;
      this.originalColor = this.color; // Store original color for non-swarm state

      // Rainbow swarm properties
      this.baseHue = Math.random() * 360;
      this.colorSpeed = 0.5; // Slowed down for smoother transitions
      this.isInSwarm = false;
      this.swarmThreshold = 30; // Increased minimum fish for rainbow effect
      this.swarmColorRange = 180; // Increased range for fuller rainbow effect
      this.waveSpeed = 0.02; // Controls speed of wave propagation

      // Tail attributes
      this.tailSegments = 6;
      this.tail = Array.from({ length: this.tailSegments }, () => ({
        x: this.x,
        y: this.y,
        angle: this.a
      }));
      this.tailWaveFrequency = 0.05;
      this.tailWaveAmplitude = this.radius * 0.5;
    }

    generateNewTarget() {
      const margin = 100;
      return {
        x: margin + Math.random() * (this.w - 2 * margin),
        y: margin + Math.random() * (this.h - 2 * margin)
      };
    }

    hexToRgb(hex) {
      hex = hex.replace(/^#/, "");
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return null;
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    }

    updateSwarmStatus(particles) {
      let nearbyCount = 0;
      let nearbyFish = [];

      particles.forEach((other) => {
        if (!(other instanceof FishLarva) || other === this) return;

        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.visionRange) {
          nearbyCount++;
          nearbyFish.push(other);
        }
      });

      // Only trigger rainbow effect for large swarms
      this.isInSwarm = nearbyCount >= this.swarmThreshold;

      if (this.isInSwarm) {
        // Calculate swarm center first
        const swarmCenterX =
          nearbyFish.reduce((sum, fish) => sum + fish.x, this.x) /
          (nearbyCount + 1);
        const swarmCenterY =
          nearbyFish.reduce((sum, fish) => sum + fish.y, this.y) /
          (nearbyCount + 1);

        // Calculate position relative to swarm center
        const dx = this.x - swarmCenterX;
        const dy = this.y - swarmCenterY;
        const wavePhase = Math.atan2(dy, dx); // Direction from center
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
        const normalizedDistance = distanceFromCenter / this.visionRange;

        // Create multiple wave components for rich pattern
        const timeComponent = this.progress * this.waveSpeed;
        const distanceComponent = normalizedDistance * Math.PI * 2;
        const angleComponent = wavePhase * 2;

        // Combine waves for flowing rainbow effect
        const wavePattern =
          Math.sin(timeComponent + distanceComponent) * 120 +
          Math.sin(timeComponent * 0.5 + angleComponent) * 60 +
          Math.sin(timeComponent * 0.25 + wavePhase) * 30;

        // Smooth color transition
        const targetHue = (wavePattern + 360) % 360;
        const hueDiff = targetHue - this.baseHue;

        // Normalize hue difference to avoid color jumping
        let normalizedHueDiff = hueDiff;
        while (normalizedHueDiff > 180) normalizedHueDiff -= 360;
        while (normalizedHueDiff < -180) normalizedHueDiff += 360;

        // Actually update the hue
        this.baseHue =
          (this.baseHue + normalizedHueDiff * this.colorSpeed + 360) % 360;
      }
    }

    render() {
      const ctx = this.canvas;

      // Apply highlight effect if the particle is hovered
      if (this.isHighlighted) {
        ctx.save(); // Save the canvas state
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
        const highlightGradient = ctx.createRadialGradient(
          this.x,
          this.y,
          this.radius,
          this.x,
          this.y,
          this.radius + 10
        );
        highlightGradient.addColorStop(0, "rgba(255, 255, 0, 0.8)");
        highlightGradient.addColorStop(1, "rgba(255, 255, 0, 0)");
        ctx.strokeStyle = "rgba(246, 154, 52, 0.8)"; // Subtle white glow
        ctx.lineWidth = 2; // Thinner ring
        ctx.globalCompositeOperation = "lighter"; // Create a glowing effect
        ctx.stroke();
        ctx.restore(); // Restore canvas state
      }
      // Set color based on swarm status
      if (this.isInSwarm) {
        const saturation = 80;
        const lightness = 50;
        const opacity = isDay ? 0.8 : 0.6;
        this.color = `hsla(${this.baseHue}, ${saturation}%, ${lightness}%, ${opacity})`;
      } else {
        this.color = this.originalColor;
      }

      ctx.beginPath();

      // Handle day/night rendering
      if (!isDay) {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          this.radius * 0.5,
          this.x,
          this.y,
          this.radius * 5
        );

        if (this.isInSwarm) {
          gradient.addColorStop(0, `hsla(${this.baseHue}, 80%, 70%, 0.6)`);
        } else {
          gradient.addColorStop(0, `rgba(0, 255, 255, 0.6)`);
        }
        gradient.addColorStop(1, `rgba(0, 255, 255, 0)`);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = this.color;
      }

      // Draw main body
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();

      // Render tail
      this.renderTail();
    }

    renderTail() {
      const ctx = this.canvas;

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);

      this.tail.forEach((segment, i) => {
        const progress = i / this.tailSegments;
        const waveOffset =
          Math.sin(
            this.progress * this.tailWaveFrequency + progress * Math.PI * 2
          ) *
          this.tailWaveAmplitude *
          (1 - progress);

        const angle = segment.angle + waveOffset / 50;
        const tailX = segment.x + Math.cos(angle) * (this.radius / 2);
        const tailY = segment.y + Math.sin(angle) * (this.radius / 2);

        ctx.lineTo(tailX, tailY);
      });

      ctx.lineWidth = 2;
      ctx.strokeStyle = this.color;
      ctx.stroke();
      ctx.closePath();
    }

    updateTail() {
      for (let i = this.tail.length - 1; i > 0; i--) {
        this.tail[i].x = this.tail[i - 1].x;
        this.tail[i].y = this.tail[i - 1].y;
        this.tail[i].angle = this.tail[i - 1].angle;
      }

      this.tail[0].x = this.x;
      this.tail[0].y = this.y;
      this.tail[0].angle = this.a;
    }

    calculateGroupInfluence(particles) {
      let separation = { x: 0, y: 0 };
      let alignment = { x: 0, y: 0 };
      let cohesion = { x: 0, y: 0 };
      let nearbyCount = 0;
      let leaders = [];

      particles.forEach((other) => {
        if (!(other instanceof FishLarva) || other === this) return;

        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.separationRange) {
          separation.x -= dx / distance;
          separation.y -= dy / distance;
        }

        if (distance < this.visionRange) {
          nearbyCount++;

          if (distance < this.alignmentRange) {
            alignment.x += Math.cos(other.a);
            alignment.y += Math.sin(other.a);
          }

          cohesion.x += other.x;
          cohesion.y += other.y;

          if (other.isLeader) {
            leaders.push({
              fish: other,
              distance: distance,
              influence: other.leadershipStrength / (distance * distance)
            });
          }
        }
      });

      if (nearbyCount > 0) {
        cohesion.x = cohesion.x / nearbyCount - this.x;
        cohesion.y = cohesion.y / nearbyCount - this.y;
      }

      return { separation, alignment, cohesion, leaders };
    }

move() {
  this.updateTail();
  this.updateSwarmStatus(particles);

  let ax = 0;
  let ay = 0;

  // Mouse avoidance (enhanced to affect swarm dynamics)
  const mdx = this.x - mouseX;
  const mdy = this.y - mouseY;
  const mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy);

  if (mouseDistance < REPULSION_RADIUS && mouseDistance > 0) {
    const force =
      (1 - mouseDistance / REPULSION_RADIUS) * REPULSION_STRENGTH * 2;
    ax += (mdx / mouseDistance) * force;
    ay += (mdy / mouseDistance) * force;

    // Temporarily weaken swarm behavior when near the mouse
    this.isInSwarm = false; // Swarm behavior is reduced near the mouse
  }

  // Edge and corner avoidance
  const leftDist = this.x;
  const rightDist = this.w - this.x;
  const topDist = this.y;
  const bottomDist = this.h - this.y;

  const inCorner =
    (leftDist < this.cornerMargin &&
      (topDist < this.cornerMargin || bottomDist < this.cornerMargin)) ||
    (rightDist < this.cornerMargin &&
      (topDist < this.cornerMargin || bottomDist < this.cornerMargin));

  if (inCorner) {
    const centerX = this.w / 2;
    const centerY = this.h / 2;
    const towardsCenterX = centerX - this.x;
    const towardsCenterY = centerY - this.y;
    const centerDist = Math.sqrt(
      towardsCenterX * towardsCenterX + towardsCenterY * towardsCenterY
    );

    if (centerDist > 0) {
      const cornerForce =
        this.cornerForce *
        (1 - Math.min(centerDist, this.cornerMargin) / this.cornerMargin);
      ax += (towardsCenterX / centerDist) * cornerForce * 4;
      ay += (towardsCenterY / centerDist) * cornerForce * 4;
    }
  }

  const edgeForce = this.edgeTurnForce * 2;
  if (leftDist < this.edgeMargin) ax += edgeForce;
  if (rightDist < this.edgeMargin) ax -= edgeForce;
  if (topDist < this.edgeMargin) ay += edgeForce;
  if (bottomDist < this.edgeMargin) ay -= edgeForce;

  // Group influences (cohesion, alignment, separation)
  const influences = this.calculateGroupInfluence(particles);

  // Leader-following behavior
  if (this.isLeader) {
    this.targetTimer++;
    if (this.targetTimer > this.targetDuration) {
      this.targetPoint = this.generateNewTarget();
      this.targetTimer = 0;
      this.targetDuration = 200 + Math.random() * 300;
    }

    const dx = this.targetPoint.x - this.x;
    const dy = this.targetPoint.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      ax += (dx / dist) * this.wanderlust;
      ay += (dy / dist) * this.wanderlust;
    }
  } else if (influences.leaders.length > 0) {
    const strongestLeader = influences.leaders.reduce((a, b) =>
      a.influence > b.influence ? a : b
    );

    const dx = strongestLeader.fish.x - this.x;
    const dy = strongestLeader.fish.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      ax += (dx / dist) * strongestLeader.influence;
      ay += (dy / dist) * strongestLeader.influence;
    }
  }

  // Apply group behaviors with dynamic scaling
  ax += influences.separation.x * 2.0;
  ay += influences.separation.y * 2.0;
  ax += influences.alignment.x * (this.isInSwarm ? 0.8 : 0.4);
  ay += influences.alignment.y * (this.isInSwarm ? 0.8 : 0.4);
  ax += influences.cohesion.x * (this.isInSwarm ? 0.8 : 0.4);
  ay += influences.cohesion.y * (this.isInSwarm ? 0.8 : 0.4);

  // Food seeking behavior
  let nearestFood = null;
  let nearestDist = Infinity;

  for (const particle of particles) {
    if (!(particle instanceof Food)) continue;

    const dx = particle.x - this.x;
    const dy = particle.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < nearestDist && distance < this.visionRange) {
      nearestDist = distance;
      nearestFood = particle;
    }
  }

  if (nearestFood) {
    const dx = nearestFood.x - this.x;
    const dy = nearestFood.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      ax += (dx / dist) * 2.0;
      ay += (dy / dist) * 2.0;
    }

    if (dist < this.radius + nearestFood.radius) {
      particles = particles.filter((p) => p !== nearestFood);
    }
  }

  // Normalize acceleration
  const accMagnitude = Math.sqrt(ax * ax + ay * ay);
  if (accMagnitude > 0) {
    ax = (ax / accMagnitude) * 2;
    ay = (ay / accMagnitude) * 2;
  }

  // Update angle with smoother turning
  const targetAngle = Math.atan2(ay, ax);
  const angleDiff = targetAngle - this.a;

  let normalizedDiff = angleDiff;
  while (normalizedDiff > Math.PI) normalizedDiff -= 2 * Math.PI;
  while (normalizedDiff < -Math.PI) normalizedDiff += 2 * Math.PI;

  this.a += Math.sin(normalizedDiff) * this.turnSpeed;

  // Update speed with smooth dampening
  const desiredSpeed = Math.sqrt(ax * ax + ay * ay);
  const speedDiff = desiredSpeed - this.s;
  this.s += speedDiff * 0.1;
  this.s = Math.max(this.minSpeed, Math.min(this.maxSpeed, this.s));

      // Update position
      const prevX = this.x;
      const prevY = this.y;

      this.x += Math.cos(this.a) * this.s;
      this.y += Math.sin(this.a) * this.s;

      // Wrap around the screen and reset tail
      if (this.x < -this.radius) {
        this.x = this.w + this.radius;
        this.resetTail();
      } else if (this.x > this.w + this.radius) {
        this.x = -this.radius;
        this.resetTail();
      }

      if (this.y < -this.radius) {
        this.y = this.h + this.radius;
        this.resetTail();
      } else if (this.y > this.h + this.radius) {
        this.y = -this.radius;
        this.resetTail();
      }

      this.render();
      this.progress++;
      return true;
    }

    // Reset tail method
    resetTail() {
      this.tail.forEach((segment) => {
        segment.x = this.x;
        segment.y = this.y;
      });
    }
  }

  class FishLarvaEgg {
    constructor(canvas, progress) {
      const params = calculateEnvironmentParams();
      const random = Math.random();
      this.progress = 0;
      this.canvas = canvas;
      this.speed = params.particleSpeed * (0.5 + random * 0.2);
      this.zIndex = 1;
      this.speciesName = "Fish Larva Egg";
      this.behavior =
        "A transitional stage, teeming with life waiting to emerge";
      this.colorDescription = "Misty opal";

      this.x = Math.random() * $(window).width();
      this.y = Math.random() * $(window).height();

      this.s = Math.random() * 1;
      this.a = 0;

      this.w = $(window).width();
      this.h = $(window).height();

      const baseRadius = 3 + random * 1.5;
      this.radius = Math.min(baseRadius * params.particleSize, 4);

      const baseColors = {
        healthy: {
          r: 130,
          g: 160,
          b: 196
        },
        unhealthy: {
          r: 46,
          g: 71,
          b: 101
        }
      };

      const intensity = 0.3 + params.colorIntensity * 0.7;
      if (random > 0.8) {
        this.color = `rgba(${baseColors.healthy.r}, ${baseColors.healthy.g}, ${baseColors.healthy.b}, ${intensity})`;
      } else {
        this.color = `rgba(${baseColors.unhealthy.r}, ${baseColors.unhealthy.g}, ${baseColors.unhealthy.b}, ${intensity})`;
      }

      this.variantx1 = Math.random() * 100;
      this.variantx2 = Math.random() * 100;
      this.varianty1 = Math.random() * 100;
      this.varianty2 = Math.random() * 100;

      // Timer map for food interaction
      this.foodTimers = new Map();
    }

    render() {
      const ctx = this.canvas;

      // Apply highlight effect if the particle is hovered
      if (this.isHighlighted) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(238, 180, 238, 0.8)"; // Subtle white glow
        ctx.lineWidth = 2; // Thinner ring
        ctx.stroke();
        ctx.closePath();
      }

      // Draw the particle normally
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();

      if (!isDay) {
        // Apply glow effect at night
        const gradient = this.canvas.createRadialGradient(
          this.x,
          this.y,
          this.radius * 0.5, // Inner circle
          this.x,
          this.y,
          this.radius * 6 // Outer circle
        );
        gradient.addColorStop(0, `rgba(0, 255, 255, 0.6)`); // Bright inner glow
        gradient.addColorStop(1, `rgba(0, 255, 255, 0)`); // Fading outer glow

        this.canvas.fillStyle = gradient;
      } else {
        this.canvas.fillStyle = this.color; // Normal color during the day
      }

      this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.canvas.fill();
      this.canvas.closePath();
      this.canvas.beginPath();
      this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.canvas.lineWidth = 2;
      this.canvas.fillStyle = this.color;
      this.canvas.fill();
      this.canvas.closePath();
    }

    resetPosition() {
      // Wrap around the screen when going off-canvas
      if (this.x < -this.radius) this.x = this.w + this.radius;
      if (this.x > this.w + this.radius) this.x = -this.radius;
      if (this.y < -this.radius) this.y = this.h + this.radius;
      if (this.y > this.h + this.radius) this.y = -this.radius;
    }

move() {
      // Find nearest coral and food
      let nearestCoral = null;
      let nearestCoralDist = Infinity;
      let nearestFood = null;
      let nearestFoodDist = Infinity;

      for (const particle of particles) {
        const dx = particle.x - this.x;
        const dy = particle.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (particle instanceof Coral && distance < nearestCoralDist) {
          nearestCoral = particle;
          nearestCoralDist = distance;
        }
        
        if (particle instanceof Food && distance < nearestFoodDist) {
          nearestFood = particle;
          nearestFoodDist = distance;
          
          // Handle food interaction logic
          if (distance < 50) {
            if (!this.foodTimers.has(particle)) {
              this.foodTimers.set(particle, 0);
            }
            this.foodTimers.set(particle, this.foodTimers.get(particle) + 1);

            if (this.foodTimers.get(particle) > 300) {
              particle.consume();
              particles = particles.filter((p) => p !== particle);
              this.foodTimers.delete(particle);
            }
          } else if (this.foodTimers.has(particle)) {
            this.foodTimers.delete(particle);
          }
        }
      }

      // Base speed and movement
      this.s = 1.5; // Increased base speed
      this.a += (Math.random() - 0.5) * 0.3; // More active direction changes
      
      let dx = Math.cos(this.a) * this.s;
      let dy = Math.sin(this.a) * this.s;

      // Coral influence - more active when near coral
      if (nearestCoral) {
        const coralAttractionRange = 200;
        
        if (nearestCoralDist < coralAttractionRange) {
          const towardsCoral = Math.atan2(nearestCoral.y - this.y, nearestCoral.x - this.x);
          const distanceFactor = 1 - (nearestCoralDist / coralAttractionRange);
          
          // More energetic movement near coral
          if (nearestCoralDist > 80) {
            // Strong attraction when far from coral
            dx += Math.cos(towardsCoral) * this.s * 0.8;
            dy += Math.sin(towardsCoral) * this.s * 0.8;
          } else {
            // Active swimming around coral when close
            const tangentialAngle = towardsCoral + Math.PI/2;
            dx += Math.cos(tangentialAngle) * this.s * 0.5;
            dy += Math.sin(tangentialAngle) * this.s * 0.5;
            
            // Add some randomness for natural movement
            dx += (Math.random() - 0.5) * this.s;
            dy += (Math.random() - 0.5) * this.s;
          }
        }
      }

      // More aggressive food seeking
      if (nearestFood && nearestFoodDist < 150) {
        const towardsFood = Math.atan2(nearestFood.y - this.y, nearestFood.x - this.x);
        const foodInfluence = 2.0 * (1 - nearestFoodDist / 150); // Increased food attraction
        dx += Math.cos(towardsFood) * foodInfluence * this.s;
        dy += Math.sin(towardsFood) * foodInfluence * this.s;
      }

const mouseDistance = Math.sqrt((this.x - mouseX) ** 2 + (this.y - mouseY) ** 2);
if (mouseDistance < REPULSION_RADIUS) {
    const force = (1 - mouseDistance / REPULSION_RADIUS) * REPULSION_STRENGTH * 0.5; // Reduced multiplier from 2 to 0.5
    const avoidance = Math.atan2(this.y - mouseY, this.x - mouseX);
    dx += Math.cos(avoidance) * force * (this.s * 0.3); // Reduced speed influence
    dy += Math.sin(avoidance) * force * (this.s * 0.3);
}

      // Apply movement with less smoothing for more immediate response
      const smoothing = 0.9; // Reduced smoothing for snappier movement
      this.x += dx * smoothing;
      this.y += dy * smoothing;

      // Apply wrapping logic
      this.resetPosition();

      this.render();
      this.progress++;
      return true;
    }
  }
  class Paramecium {
    constructor(canvas) {
      const random = Math.random();
      this.progress = 0;
      this.canvas = canvas;
      this.speciesName = "Paramecium";
      this.behavior =
        "Single-celled wanderers, gracefully moving through the water";
      this.colorDescription = "Gossamer white";
      this.zIndex = 2;

      // Set position
      this.x =
        $(window).width() / 2 + (Math.random() * 300 - Math.random() * 300);
      this.y =
        $(window).height() / 2 +
        ((Math.random() * $(window).height()) / 4 -
          (Math.random() * $(window).height()) / 4);

      // Get viewport size
      this.w = $(window).width();
      this.h = $(window).height();

      // Rotation and dimensions
      this.rotation = (random * 180 * Math.PI) / 180;
      this.radius = 6 + Math.random() * 3; // Adjusted to the original size
      this.ovalWidth = 12; // Original width of the oval
      this.ovalHeight = 4; // Original height of the oval

      // Color
      this.color = "rgba(255,255,255,0.1)";

      // Variants for movement
      this.variantx1 = Math.random() * 100;
      this.variantx2 = Math.random() * 100;
      this.varianty1 = Math.random() * 100;
      this.varianty2 = Math.random() * 100;

      // Highlight property
      this.isHighlighted = false;
    }

    createOval(x, y, w, h) {
      const ctx = this.canvas;

      ctx.beginPath();
      ctx.ellipse(
        x + w / 2,
        y + h / 2,
        w / 2,
        h / 2,
        this.rotation,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }

    render() {
      const ctx = this.canvas;

      // Apply highlight effect if the particle is hovered
      if (this.isHighlighted) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2); // Slightly smaller highlight
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"; // Subtle white glow
        ctx.lineWidth = 2; // Thinner ring
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }

      // Render the oval shape
      this.createOval(
        this.x - this.ovalWidth / 2,
        this.y - this.ovalHeight / 2,
        this.ovalWidth,
        this.ovalHeight
      );
    }

    move() {
      // Update position
      this.x +=
        (Math.sin(this.progress / this.variantx1) *
          Math.cos(this.progress / this.variantx2)) /
        4;
      this.y +=
        (Math.sin(this.progress / this.varianty1) *
          Math.cos(this.progress / this.varianty2)) /
        4;

      // Check bounds
      if (this.x < 0 || this.x > this.w - this.radius) {
        return false;
      }

      if (this.y < 0 || this.y > this.h - this.radius) {
        return false;
      }

      // Render the particle
      this.render();
      this.progress++;
      return true;
    }
  }

  class NeonTrail {
    constructor(canvas) {
      this.speciesName = "Neon Fish";
      this.behavior =
        "Illuminated swimmers leaving radiant trails in their wake";
      this.colorDescription = "Electric azure";
      const params = calculateEnvironmentParams();
      const random = Math.random();
      this.canvas = canvas;
      this.progress = 0;
      this.points = [];
      this.maxPoints = 15;
      this.zIndex = 3;
      this.x = Math.random() * $(window).width();
      this.y = Math.random() * $(window).height();
      this.w = $(window).width();
      this.h = $(window).height();
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 1.5;
      this.radius = (3 + random * 2) * params.particleSize;

      const intensity = 0.3 + params.colorIntensity * 0.7;
      this.color = `rgba(0, 180, 255, ${intensity})`;
    }

    render() {
      const ctx = this.canvas;

      // Apply highlight effect if the particle is hovered
      if (this.isHighlighted) {
        ctx.save(); // Save the current state
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 255, 255, 0.8)"; // Bright cyan glow for NeonTrail
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        ctx.restore(); // Restore the saved state
      }

      // Draw the particle normally
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color; // Use the particle's assigned color
      ctx.fill();
      ctx.closePath();
      ctx.restore();
      // Draw the main body
      this.canvas.beginPath();

      if (!isDay) {
        // Apply glow effect at night
        const gradient = this.canvas.createRadialGradient(
          this.x,
          this.y,
          this.radius * 0.5, // Inner circle
          this.x,
          this.y,
          this.radius * 6 // Outer circle
        );
        gradient.addColorStop(0, `rgba(0, 255, 255, 0.6)`); // Bright inner glow
        gradient.addColorStop(1, `rgba(0, 255, 255, 0)`); // Fading outer glow

        this.canvas.fillStyle = gradient;
      } else {
        this.canvas.fillStyle = this.color; // Normal color during the day
      }

      this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.canvas.fill();
      this.canvas.closePath();
      this.canvas.beginPath();
      this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.canvas.lineWidth = 2;
      this.canvas.fillStyle = this.color;
      this.canvas.fill();
      this.canvas.closePath();

      // Draw the trail
      if (this.points.length > this.maxPoints) {
        this.points.shift();
      }

      this.canvas.beginPath();
      this.canvas.strokeStyle = this.color;
      this.canvas.lineWidth = 1;
      this.canvas.lineCap = "round";

      for (let i = 1; i < this.points.length; i++) {
        const p1 = this.points[i - 1];
        const p2 = this.points[i];
        this.canvas.moveTo(p1.x, p1.y);
        this.canvas.lineTo(p2.x, p2.y);
      }

      this.canvas.stroke();
    }

    move() {
      this.angle += (Math.random() - 0.5) * 0.3;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      // Add collision avoidance
      avoidCollisions(this, particles);

      // Mouse avoidance
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < REPULSION_RADIUS) {
        const force = (1 - distance / REPULSION_RADIUS) * REPULSION_STRENGTH;
        this.x += (dx / distance) * force;
        this.y += (dy / distance) * force;
      }

      // Wrap around the screen
      if (this.x < -this.radius) {
        this.x = this.w + this.radius;
        this.resetTrail();
      } else if (this.x > this.w + this.radius) {
        this.x = -this.radius;
        this.resetTrail();
      }

      if (this.y < -this.radius) {
        this.y = this.h + this.radius;
        this.resetTrail();
      } else if (this.y > this.h + this.radius) {
        this.y = -this.radius;
        this.resetTrail();
      }

      // Add current position to the trail
      this.points.push({
        x: this.x,
        y: this.y
      });

      this.render();
      this.progress++;
      return true;
    }

    // Reset the trail to avoid drawing lines across the screen
    resetTrail() {
      this.points = [{ x: this.x, y: this.y }];
    }
  }

  class RainbowTrail extends NeonTrail {
    constructor(canvas) {
      super(canvas);
      this.hue = 0;
      this.lineWidth = 1.5;
      this.speciesName = "Rainbow Fish";
      this.behavior = "Vibrant streaks of color marking their playful journeys";
      this.colorDescription = "Prismatic";
      this.zIndex = 3;
    }

    render() {
      const ctx = this.canvas;

      // Apply highlight effect if the particle is hovered
      if (this.isHighlighted) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 69, 0, 0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }
      this.canvas.beginPath();

      if (!isDay) {
        // Apply glow effect at night
        const gradient = this.canvas.createRadialGradient(
          this.x,
          this.y,
          this.radius * 0.5, // Inner circle
          this.x,
          this.y,
          this.radius * 6 // Outer circle
        );
        gradient.addColorStop(0, `rgba(0, 255, 255, 0.6)`); // Bright inner glow
        gradient.addColorStop(1, `rgba(0, 255, 255, 0)`); // Fading outer glow

        this.canvas.fillStyle = gradient;
      } else {
        this.canvas.fillStyle = this.color; // Normal color during the day
      }

      this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.canvas.fill();
      this.canvas.closePath();
      // Draw the main body like FishLarva
      this.canvas.beginPath();
      this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.canvas.lineWidth = 2;
      this.canvas.fillStyle = `hsla(${this.hue}, 100%, 50%, 0.7)`;
      this.canvas.fill();
      this.canvas.closePath();

      // Draw the trail
      if (this.points.length > this.maxPoints) {
        this.points.shift();
      }

      this.canvas.beginPath();
      this.hue = (this.hue + 1) % 360;
      this.canvas.strokeStyle = `hsla(${this.hue}, 100%, 50%, 0.4)`;
      this.canvas.lineWidth = this.lineWidth;
      this.canvas.lineCap = "round";

      for (let i = 1; i < this.points.length; i++) {
        const p1 = this.points[i - 1];
        const p2 = this.points[i];
        this.canvas.moveTo(p1.x, p1.y);
        this.canvas.lineTo(p2.x, p2.y);
      }

      this.canvas.stroke();
    }
  }

  class Bacteria {
    constructor(canvas) {
      const params = calculateEnvironmentParams();
      this.canvas = canvas;
      this.progress = 0;
      this.x = Math.random() * $(window).width();
      this.y = Math.random() * $(window).height();
      this.w = $(window).width();
      this.h = $(window).height();
      this.radius = 4 + Math.random() * 3;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 2;
      this.huntingRange = 100;
      this.consumeRange = 10;
      this.speciesName = "Bacteria";
      this.behavior = "Microscopic invaders thriving in unstable environments";
      this.colorDescription = "Crimson pulse";
      this.zIndex = 4;

      this.baseColor = "rgb(255, 0, 0, 0.8)";
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    render() {
      const ctx = this.canvas;

      // Draw the highlight if hovered
      if (this.isHighlighted) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgb(255, 0, 0, 0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      }

      // Render the main bacteria
      ctx.beginPath();
      ctx.fillStyle = this.baseColor;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      const pulseOpacity = 0.3 + Math.sin(this.pulsePhase) * 0.2;

      this.canvas.beginPath();
      this.canvas.fillStyle = `rgba(255, 0, 0, ${pulseOpacity})`;
      this.canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.canvas.fill();

      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + this.progress * 0.05;
        const spikeLength = this.radius * 0.7;
        const x2 = this.x + Math.cos(angle) * (this.radius + spikeLength);
        const y2 = this.y + Math.sin(angle) * (this.radius + spikeLength);

        this.canvas.beginPath();
        this.canvas.strokeStyle = `rgba(255, 0, 0, ${pulseOpacity * 0.7})`;
        this.canvas.moveTo(
          this.x + Math.cos(angle) * this.radius,
          this.y + Math.sin(angle) * this.radius
        );
        this.canvas.lineTo(x2, y2);
        this.canvas.stroke();
      }
    }

    move() {
      let nearestPrey = null;
      let nearestDist = Infinity;

      for (const particle of particles) {
        if (particle === this || particle instanceof Bacteria) continue;

        const dx = particle.x - this.x;
        const dy = particle.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.huntingRange && distance < nearestDist) {
          nearestPrey = particle;
          nearestDist = distance;
        }
      }

      if (nearestPrey) {
        const dx = nearestPrey.x - this.x;
        const dy = nearestPrey.y - this.y;
        this.angle = Math.atan2(dy, dx);

        if (nearestDist < this.consumeRange) {
          particles = particles.filter((p) => p !== nearestPrey);
        }
      } else {
        this.angle += (Math.random() - 0.5) * 0.3;
      }

      // Update position
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      // Apply screen wrapping
      if (this.x < -this.radius) this.x = this.w + this.radius;
      if (this.x > this.w + this.radius) this.x = -this.radius;
      if (this.y < -this.radius) this.y = this.h + this.radius;
      if (this.y > this.h + this.radius) this.y = -this.radius;

      this.pulsePhase += 0.1;
      this.render();
      this.progress++;
      return true;
    }
  }

  class Food {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * $(window).width();
      this.y = Math.random() * $(window).height();
      this.radius = 5 + Math.random() * 5; // Small, glowing size
      this.glowIntensity = 0.8; // Glowing effect
      this.isConsumed = false; // Tracks consumption state
      this.radius = 5; // Size of the food particle
      this.color = "rgba(255, 165, 0, 0.8)"; // Default orange color
      this.speciesName = "Food Particle";
      this.behavior = "Essential sustenance, fueling life in the ecosystem";
      this.colorDescription = "Golden nectar";
    }

    render() {
      const ctx = this.canvas;

      // Apply highlight effect if the particle is hovered
      if (this.isHighlighted) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2); // Slightly larger radius for highlight
        ctx.strokeStyle = "rgba(255, 255, 0, 0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      }

      // Draw the food particle normally
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();

      // Create a glowing effect around the food
      const gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.radius * 2
      );
      gradient.addColorStop(0, `rgba(255, 255, 100, ${this.glowIntensity})`);
      gradient.addColorStop(1, `rgba(255, 255, 100, 0)`);

      // Draw the food particle
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.closePath();
    }

    move() {
      // Slight floating movement
      this.x += Math.sin(this.y / 100) * 0.5;
      this.y += Math.cos(this.x / 100) * 0.5;

      // Keep food within bounds
      if (this.x < 0) this.x = $(window).width();
      if (this.x > $(window).width()) this.x = 0;
      if (this.y < 0) this.y = $(window).height();
      if (this.y > $(window).height()) this.y = 0;

      if (this.isConsumed) return false; // Stop rendering if consumed
      this.render();
      return true;
    }
    consume() {
      this.isConsumed = true; // Mark as consumed
    }
  }
  class UndulatingSerpent {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
      this.path = [];
      this.maxPathLength = 70; // Trail length
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 1.2;
      this.segmentDistance = 15; // Distance between segments
      this.waveAmplitude = 50;
      this.waveFrequency = 0.02;
      this.baseHue = Math.random() * 360; // Random starting hue
      this.colorSpeed = 2; // Speed of color transition
      this.progress = 10; // To create wave-like motion
      this.speciesName = "Ripple Serpent";
      this.behavior =
        "Radiant serpents that weave through the waters in mesmerizing rainbow patterns";
      this.colorDescription = "Chromatic waves";
      this.avoidanceRadius = 50; // Distance to detect nearby serpents
this.turnSpeed = 0.02; // Speed of turning when avoiding others
this.targetAngle = this.angle; // Angle the serpent is trying to turn toward
    }

    updatePath() {
      this.progress++;
      const waveOffset =
        Math.sin(this.progress * this.waveFrequency) * this.waveAmplitude;
      const dx = Math.cos(this.angle) * this.speed;
      const dy = Math.sin(this.angle) * this.speed;

      this.x += dx;
      this.y += dy;

      // Add wave motion
      const newPoint = {
        x: this.x + Math.cos(this.angle + Math.PI / 2) * waveOffset,
        y: this.y + Math.sin(this.angle + Math.PI / 2) * waveOffset
      };

      this.path.unshift(newPoint);

      if (this.path.length > this.maxPathLength) {
        this.path.pop();
      }
    }
    
avoidOthers(serpents) {
  let avoidX = 0;
  let avoidY = 0;
  let count = 0;

  for (const other of serpents) {
    if (other === this) continue; // Skip itself

    // Check the head (main position) of the other serpent
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.avoidanceRadius && distance > 0) {
      avoidX += dx / distance;
      avoidY += dy / distance;
      count++;
    }

    // Check the path (tail) of the other serpent
    for (const segment of other.path) {
      const segmentDx = this.x - segment.x;
      const segmentDy = this.y - segment.y;
      const segmentDistance = Math.sqrt(segmentDx * segmentDx + segmentDy * segmentDy);

      if (segmentDistance < this.avoidanceRadius && segmentDistance > 0) {
        avoidX += segmentDx / segmentDistance;
        avoidY += segmentDy / segmentDistance;
        count++;
      }
    }
  }

  if (count > 0) {
    const avgAvoidX = avoidX / count;
    const avgAvoidY = avoidY / count;
    this.targetAngle = Math.atan2(avgAvoidY, avgAvoidX); // Adjust target angle to avoid collision
  }
}
      smoothSteer() {
    let angleDiff = this.targetAngle - this.angle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    this.angle += angleDiff * this.turnSpeed;
  }

    smoothWrap() {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const buffer = this.segmentDistance * 2; // Buffer zone for wrapping

      // Create duplicate segments near edges for smooth transition
      if (this.x < buffer) {
        const rightX = this.x + screenWidth;
        this.path.forEach((segment, i) => {
          if (segment.x < buffer) {
            this.path[i] = {
              ...segment,
              rightDuplicate: { x: segment.x + screenWidth, y: segment.y }
            };
          }
        });
      } else if (this.x > screenWidth - buffer) {
        const leftX = this.x - screenWidth;
        this.path.forEach((segment, i) => {
          if (segment.x > screenWidth - buffer) {
            this.path[i] = {
              ...segment,
              leftDuplicate: { x: segment.x - screenWidth, y: segment.y }
            };
          }
        });
      }

      // Actual wrapping
      if (this.x < 0) {
        this.x += screenWidth;
        this.path = this.path.map((segment) => ({
          x: segment.x + screenWidth,
          y: segment.y
        }));
      } else if (this.x > screenWidth) {
        this.x -= screenWidth;
        this.path = this.path.map((segment) => ({
          x: segment.x - screenWidth,
          y: segment.y
        }));
      }

      // Vertical wrapping
      if (this.y < buffer) {
        this.path.forEach((segment, i) => {
          if (segment.y < buffer) {
            this.path[i] = {
              ...segment,
              bottomDuplicate: { x: segment.x, y: segment.y + screenHeight }
            };
          }
        });
      } else if (this.y > screenHeight - buffer) {
        this.path.forEach((segment, i) => {
          if (segment.y > screenHeight - buffer) {
            this.path[i] = {
              ...segment,
              topDuplicate: { x: segment.x, y: segment.y - screenHeight }
            };
          }
        });
      }

      if (this.y < 0) {
        this.y += screenHeight;
        this.path = this.path.map((segment) => ({
          x: segment.x,
          y: segment.y + screenHeight
        }));
      } else if (this.y > screenHeight) {
        this.y -= screenHeight;
        this.path = this.path.map((segment) => ({
          x: segment.x,
          y: segment.y - screenHeight
        }));
      }
    }

    render() {
      const ctx = this.canvas;

      // Apply highlight effect to the head if the serpent is hovered
      if (this.isHighlighted && this.path.length > 0) {
        const headSegment = this.path[0]; // Use the first segment as the "head"
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          headSegment.x,
          headSegment.y,
          this.segmentDistance + 5,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = "rgba(139, 69, 19, 1)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }

      // Draw the main body segments with rainbow gradient
      for (let i = 0; i < this.path.length - 1; i++) {
        const segment = this.path[i];
        const nextSegment = this.path[i + 1];
        const opacity = 1 - i / this.path.length;

        // Calculate hue for this segment
        const hue = (this.baseHue + i * 3) % 360;
        const saturation = 80;
        const lightness = 50;

        // Draw main segment
        this.drawSegment(
          ctx,
          segment,
          nextSegment,
          opacity,
          hue,
          saturation,
          lightness
        );

        // Draw duplicates if they exist with same rainbow effect
        if (segment.rightDuplicate && nextSegment.rightDuplicate) {
          this.drawSegment(
            ctx,
            segment.rightDuplicate,
            nextSegment.rightDuplicate,
            opacity,
            hue,
            saturation,
            lightness
          );
        }
        if (segment.leftDuplicate && nextSegment.leftDuplicate) {
          this.drawSegment(
            ctx,
            segment.leftDuplicate,
            nextSegment.leftDuplicate,
            opacity,
            hue,
            saturation,
            lightness
          );
        }
        if (segment.topDuplicate && nextSegment.topDuplicate) {
          this.drawSegment(
            ctx,
            segment.topDuplicate,
            nextSegment.topDuplicate,
            opacity,
            hue,
            saturation,
            lightness
          );
        }
        if (segment.bottomDuplicate && nextSegment.bottomDuplicate) {
          this.drawSegment(
            ctx,
            segment.bottomDuplicate,
            nextSegment.bottomDuplicate,
            opacity,
            hue,
            saturation,
            lightness
          );
        }
      }

      // Update base hue for animation
      this.baseHue = (this.baseHue + this.colorSpeed) % 360;
    }

    drawSegment(
      ctx,
      segment,
      nextSegment,
      opacity,
      hue,
      saturation,
      lightness
    ) {
      // Main segment
      ctx.beginPath();
      ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
      ctx.lineWidth = Math.max(1, 6 - opacity * 6);
      ctx.moveTo(segment.x, segment.y);
      ctx.lineTo(nextSegment.x, nextSegment.y);
      ctx.stroke();
      ctx.closePath();

      // Glow effect
      ctx.beginPath();
      ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 20}%, ${
        opacity * 0.5
      })`;
      ctx.lineWidth = Math.max(2, 8 - opacity * 8);
      ctx.moveTo(segment.x, segment.y);
      ctx.lineTo(nextSegment.x, nextSegment.y);
      ctx.stroke();
      ctx.closePath();
    }

    move() {
      this.updatePath();
      this.smoothWrap();
      this.render();
      return true;
    }
  }
class Jellyfish {
    constructor(canvas) {
        const params = calculateEnvironmentParams();
        this.canvas = canvas;
        
        // Initialize position using window dimensions
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = (15 + Math.random() * 10) * params.particleSize;
        this.baseSize = this.size;
        this.pulseOffset = Math.random() * Math.PI * 2;
        
        // Movement parameters
        this.currentAngle = Math.random() * Math.PI * 2;
        this.targetAngle = this.currentAngle;
        this.angleChangeSpeed = 0.02; // Controls how quickly the jellyfish turns
        this.speed = 0.5; // Base speed
        this.changeDirectionInterval = this.getRandomInterval(); // Time until next direction change
        this.timeSinceLastChange = 0;
        
        this.verticalBias = 0;
        this.zIndex = 5;
        this.radius = this.size;
        
        // Timing parameters - adjusted for smoother pulsing
        this.startTime = Date.now() * 0.001;
        this.pulseSpeed = 0.5; // Increased significantly for visible pulsing
        
        // Species info
        this.speciesName = "Jellyfish";
        this.behavior = "Graceful pulsating creatures that drift with the currents";
        this.colorDescription = "Lunar glass";
        
        // Swarm parameters
        this.swarmRadius = 200;
        this.separationDistance = 50;
        this.cohesionStrength = 0.01;
        this.alignmentStrength = 0.05;
        this.separationStrength = 0.03;
    }

    // Helper method to get a random interval between direction changes
    getRandomInterval() {
        return 2 + Math.random() * 3; // Change direction every 2-5 seconds
    }

    draw(ctx, currentTime) {
        // Calculate pulse based on elapsed time
        const elapsed = currentTime - this.startTime;
        const t = elapsed * this.pulseSpeed + this.pulseOffset;
        
        // Create multi-wave pulsing effect
    const pulse = 1 + 
                 Math.sin(t) * 0.08 +        // Primary pulse reduced from 0.3
                 Math.sin(t * 1.5) * 0.04 +  // Secondary pulse reduced from 0.15
                 Math.sin(t * 0.5) * 0.04;   // Tertiary pulse reduced from 0.15
                     
        const currentSize = this.baseSize * pulse;
        
        ctx.beginPath();
        const points = 6;
        
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            // Reduced wobble for clearer pulsing
            const wobble = Math.sin(angle * 3 + elapsed * 2) * 0.05;
            const radius = currentSize * (1 + wobble);
            
            const x = this.x + Math.cos(angle) * radius;
            const y = this.y + Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                const prevAngle = ((i - 1) / points) * Math.PI * 2;
                const cpx = this.x + Math.cos((angle + prevAngle) / 2) * radius * 1.2;
                const cpy = this.y + Math.sin((angle + prevAngle) / 2) * radius * 1.2;
                ctx.quadraticCurveTo(cpx, cpy, x, y);
            }
        }
        
        ctx.closePath();

        // Highlight effect for hover
        if (this.isHighlighted) {
            ctx.save();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }
      const innerGlow = ctx.createRadialGradient(
    this.x, this.y, 0,
    this.x, this.y, currentSize * 0.5
);
innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
innerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
ctx.fillStyle = innerGlow;
ctx.fill();
      
      ctx.beginPath();
ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
ctx.lineWidth = 1;
ctx.stroke();

        // Enhanced gradient with pulsing opacity
        try {
            const pulseOpacity = 0.2 + Math.sin(t) * 0.1;
const gradient = ctx.createRadialGradient(
    this.x, this.y, 0,
    this.x, this.y, currentSize
);
// More sophisticated gradient
gradient.addColorStop(0, `rgba(200, 220, 255, ${0.4 + pulseOpacity})`);  // Brighter core
gradient.addColorStop(0.3, `rgba(160, 190, 255, ${0.3 + pulseOpacity})`);
gradient.addColorStop(0.6, `rgba(120, 160, 255, ${0.2 + pulseOpacity})`);
gradient.addColorStop(1, `rgba(80, 130, 255, ${0.1 + pulseOpacity})`);
            ctx.fillStyle = gradient;
        } catch (e) {
            ctx.fillStyle = 'rgba(100, 150, 255, 0.2)';
        }
        
        ctx.fill();
    }

    calculateSwarmBehavior(jellyfishArray) {
        // [Existing swarm behavior method]
        let neighbors = 0;
        let avgX = 0;
        let avgY = 0;
        let avgDX = 0;
        let avgDY = 0;

        jellyfishArray.forEach(other => {
            if (other !== this) {
                const dx = other.x - this.x;
                const dy = other.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.swarmRadius) {
                    neighbors++;
                    avgX += other.x;
                    avgY += other.y;
                    avgDX += Math.cos(other.currentAngle);
                    avgDY += Math.sin(other.currentAngle);
                }
            }
        });

        if (neighbors > 0) {
            const centerX = avgX / neighbors;
            const centerY = avgY / neighbors;
            const alignAngle = Math.atan2(avgDY / neighbors, avgDX / neighbors);

            // Adjust current angle towards the average alignment
            this.currentAngle += (alignAngle - this.currentAngle) * this.alignmentStrength;

            // Optional: Adjust towards center of mass for cohesion
            const angleToCenter = Math.atan2(centerY - this.y, centerX - this.x);
            this.currentAngle += (angleToCenter - this.currentAngle) * this.cohesionStrength;
        }
    }

    move(particles, deltaTime) {
        if (particles && Array.isArray(particles)) {
            const jellyfishArray = particles.filter(p => p instanceof Jellyfish);
            this.calculateSwarmBehavior(jellyfishArray);
        }

        // Update time since last direction change
        this.timeSinceLastChange += deltaTime;
        if (this.timeSinceLastChange >= this.changeDirectionInterval) {
            this.targetAngle = Math.random() * Math.PI * 2;
            this.changeDirectionInterval = this.getRandomInterval();
            this.timeSinceLastChange = 0;
        }

        // Smoothly interpolate current angle towards target angle
        this.currentAngle += (this.targetAngle - this.currentAngle) * this.angleChangeSpeed;

        // Calculate movement based on current angle
        const moveX = Math.cos(this.currentAngle) * this.speed;
        const moveY = Math.sin(this.currentAngle) * this.speed - this.verticalBias;

        this.x += moveX;
        this.y += moveY;

        // Screen wrapping
        if (this.x < -this.size) this.x = window.innerWidth + this.size;
        if (this.x > window.innerWidth + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = window.innerHeight + this.size;
        if (this.y > window.innerHeight + this.size) this.y = -this.size;

        // Draw
        this.render();
        return true;
    }

    render() {
        const currentTime = Date.now() * 0.001;
        this.draw(this.canvas, currentTime);
    }
}

  class Stingray {
    constructor(canvas) {
      const params = calculateEnvironmentParams();
      this.canvas = canvas;
      this.ctx = canvas;
      // Use window dimensions
      this.w = window.innerWidth;
      this.h = window.innerHeight;
      this.x = Math.random() * this.w;
      this.y = Math.random() * this.h;
      this.radius = 20; // Adjust size as needed for collision detection
      this.zIndex = 1;
      this.speciesName = "Stingray";
      this.behavior =
        "Silent guardians of the deep, drifting gracefully through the lower waters";
      this.colorDescription = "Ocean silk";
      this.isHighlighted = false; // Default to not highlighted

      this.angle = Math.random() * Math.PI * 2;
      this.targetAngle = this.angle;
      this.bodyColor = "rgba(100, 149, 237, 0.9)";

      // Movement parameters
      this.turnSpeed = 0.008; // Reduced from 0.015 for wider turns
      this.wanderPoint = 0;
      this.wanderSpeed = 0.01; // Reduced from 0.02 for less frequent direction changes
      this.speed = 0.8; // Slightly slower for more graceful movement

      // Collision parameters
      this.avoidanceRadius = 50;
      this.avoidanceStrength = 0.1;

      // Undulation parameters for wings only
      this.phase = 0;
      this.waveSpeed = 0.1;
      this.waveAmplitude = 0.2;

      // Shimmer effect parameters
      this.shimmerPhase = Math.random() * Math.PI * 2;
      this.shimmerSpeed = 0.05;
    }

    draw() {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle + Math.PI * 1.5);

      // Highlight effect (keep this outside the snapshot check as it should work in both modes)
      if (this.isHighlighted) {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 10, 0, Math.PI * 2);
        ctx.strokeStyle = "RGB(191, 255, 255)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      }

      // Only update animation phases if not in snapshot mode
      if (!isSnapshotMode) {
        this.shimmerPhase += this.shimmerSpeed;
        this.phase += this.waveSpeed;
      }

      // Calculate effects using the current phase values
      const shimmerOffset = Math.sin(this.shimmerPhase) * 0.2;
      const wingWave = Math.sin(this.phase) * 5;

      let gradient;
      if (!isDay) {
        // Nighttime: Strong glowing effect with a vibrant outer glow
        gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50); // Larger glow radius
        gradient.addColorStop(0, `rgba(0, 191, 255, ${1 + shimmerOffset})`); // Bright cyan core
        gradient.addColorStop(0.5, `rgba(0, 255, 127, ${0.7 + shimmerOffset})`); // Neon green middle
        gradient.addColorStop(1, `rgba(0, 0, 128, 0.3)`); // Fading deep blue outer edge
      } else {
        // Daytime: Subtle gradient with natural colors
        gradient = ctx.createLinearGradient(-30, 0, 30, 0);
        gradient.addColorStop(0, `rgba(100, 149, 237, ${1 + shimmerOffset})`); // Cornflower blue
        gradient.addColorStop(
          0.5,
          `rgba(255, 255, 255, ${0.8 + shimmerOffset})`
        ); // Soft white
        gradient.addColorStop(1, `rgba(100, 149, 237, ${1 - shimmerOffset})`); // Cornflower blue
      }

      // Draw the stingray body
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.lineTo(5.6, 16);
      ctx.lineTo(16, 5.6 + wingWave);
      ctx.lineTo(0, -12);
      ctx.lineTo(-16, 5.6 + wingWave);
      ctx.lineTo(-5.6, 16);
      ctx.closePath();

      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw static tail
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(0, -24);
      ctx.strokeStyle = this.bodyColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    }

    avoidOthers(particles) {
      if (!Array.isArray(particles)) {
        return false;
      }

      let avoidX = 0;
      let avoidY = 0;
      let count = 0;

      for (const other of particles) {
        if (!other || !(other instanceof Stingray) || other === this) continue;

        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.avoidanceRadius && distance > 0) {
          avoidX += dx / distance;
          avoidY += dy / distance;
          count++;
        }
      }

      if (count > 0) {
        this.targetAngle = Math.atan2(avoidY, avoidX);
      }

      return count > 0;
    }

    calculateNextPosition(particles) {
      this.wanderPoint += this.wanderSpeed;

      // Mouse avoidance
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const mouseDistance = Math.sqrt(dx * dx + dy * dy);

      if (mouseDistance < 150 && mouseDistance > 0) {
        // Mouse avoidance within a 150px radius
        const avoidanceAngle = Math.atan2(dy, dx); // Angle away from the mouse
        const avoidanceStrength = (1 - mouseDistance / 150) * 0.15; // Strength of avoidance decreases with distance
        this.targetAngle =
          this.targetAngle * (1 - avoidanceStrength) +
          avoidanceAngle * avoidanceStrength;
      }

      const isAvoiding = this.avoidOthers(particles);

      if (!isAvoiding && mouseDistance >= 150) {
        // Reduced angle change magnitude for smoother wandering
        const angleChange = Math.sin(this.wanderPoint) * 0.02; // Reduced from 0.05
        this.targetAngle += angleChange;

        // Reduce frequency of random direction changes
        if (Math.random() < 0.005) {
          // Reduced from 0.01
          const targetX = Math.random() * this.w;
          const targetY = Math.random() * this.h;
          // Blend the new direction with current direction for smoother transitions
          const newAngle = Math.atan2(targetY - this.y, targetX - this.x);
          this.targetAngle = this.angle * 0.7 + newAngle * 0.3; // Weighted average
        }
      }

      // Smoothly adjust the current angle towards the target angle
      let angleDiff = this.targetAngle - this.angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      this.angle += angleDiff * this.turnSpeed;

      // Apply speed gradually for smoother acceleration
      const currentSpeed =
        this.speed * (0.8 + Math.cos(this.wanderPoint * 0.5) * 0.2);
      this.x += Math.cos(this.angle) * currentSpeed;
      this.y += Math.sin(this.angle) * currentSpeed;
    }

    wrapPosition() {
      if (this.x < -40) this.x = this.w + 39;
      if (this.x > this.w + 40) this.x = -39;
      if (this.y < -40) this.y = this.h + 39;
      if (this.y > this.h + 40) this.y = -39;
    }

    move(particles) {
      this.calculateNextPosition(particles);
      this.wrapPosition();
      this.draw();
      return true;
    }
  }

  function createCanvas() {
    let tela = document.createElement("canvas");
    tela.width = window.innerWidth;
    tela.height = window.innerHeight;
    tela.style.position = "absolute";
    tela.style.top = "0";
    tela.style.left = "0";

    const container = $(".animation-container");
    if (container.length === 0) {
      console.error("Animation container not found");
      return;
    }

    container.append(tela);
    let canvas = tela.getContext("2d");
    return [tela, canvas];
  }

  function popolate(num) {
    const params = calculateEnvironmentParams();
    const actualNum = Math.min(num, params.maxParticles);
    let fishEggCount = 0;
    const maxFishEggs = Math.floor(actualNum * 0.1);

    for (let i = 0; i < actualNum; i++) {
      let random = Math.random();
      let cumulativeProbability = 0;
      let type = null;

      // FishLarvaEgg
      if (params.particleProbabilities.fishLarvaEgg > 0) {
        cumulativeProbability += params.particleProbabilities.fishLarvaEgg;
        if (random < cumulativeProbability) {
          type = new FishLarvaEgg(canvas);
          particles.push(type);
          continue;
        }
      }
      // Plankton
if (params.particleProbabilities.plankton > 0) {
    cumulativeProbability += params.particleProbabilities.plankton;
    if (random < cumulativeProbability) {
        type = new Plankton(canvas);
        particles.push(type);
        continue;
    }
}

      // FishLarva
      if (params.particleProbabilities.fishLarva > 0) {
        cumulativeProbability += params.particleProbabilities.fishLarva;
        if (random < cumulativeProbability) {
          type = new FishLarva(canvas);
          particles.push(type);
          continue;
        }
      }

      // Paramecium
      if (params.particleProbabilities.paramecium > 0) {
        cumulativeProbability += params.particleProbabilities.paramecium;
        if (random < cumulativeProbability) {
          type = new Paramecium(canvas);
          particles.push(type);
          continue;
        }
      }

      // FishEgg
      if (
        params.particleProbabilities.fishEgg > 0 &&
        fishEggCount < maxFishEggs
      ) {
        cumulativeProbability += params.particleProbabilities.fishEgg;
        if (random < cumulativeProbability) {
          type = new FishEgg(canvas);
          fishEggCount++;
          particles.push(type);
          continue;
        }
      }

      // NeonTrail
      if (params.particleProbabilities.neonTrail > 0) {
        cumulativeProbability += params.particleProbabilities.neonTrail;
        if (random < cumulativeProbability) {
          type = new NeonTrail(canvas);
          particles.push(type);
          continue;
        }
      }

      // RainbowTrail
      if (params.particleProbabilities.rainbowTrail > 0) {
        cumulativeProbability += params.particleProbabilities.rainbowTrail;
        if (random < cumulativeProbability) {
          type = new RainbowTrail(canvas);
          particles.push(type);
          continue;
        }
      }

      // UndulatingSerpent
      if (params.particleProbabilities.undulatingSerpent > 0) {
        cumulativeProbability += params.particleProbabilities.undulatingSerpent;
        if (random < cumulativeProbability) {
          type = new UndulatingSerpent(canvas);
          particles.push(type);
          continue;
        }
      }
      // Add Stingray here
      if (params.particleProbabilities.stingray > 0) {
        cumulativeProbability += params.particleProbabilities.stingray;
        if (random < cumulativeProbability) {
          type = new Stingray(canvas);
          particles.push(type);
          continue;
        }
      }
if (params.particleProbabilities.jellyfish > 0) {
    cumulativeProbability += params.particleProbabilities.jellyfish;
    if (random < cumulativeProbability) {
        type = new Jellyfish(canvas);
        particles.push(type);
        continue;
    }
}
      // Fallback: FishLarvaEgg
      type = new FishLarvaEgg(canvas);
      particles.push(type);
    }

    return particles.length;
  }

  function updateEnvironment() {
    const params = calculateEnvironmentParams();
    particles = [];
    popolate(max_particles);
  }

let currentRedIntensity = 0.1; // Initial intensity for red
let currentGreenIntensity = 0.15; // Initial intensity for green
  let pulseTime = 0;
window.planktonGreenIntensity = 0;

function clear() {
    const params = calculateEnvironmentParams();

    // Clamp priceChange1hr to the range [-50, 40]
    const clampedPriceChange = Math.max(-10, Math.min(priceChange1hr, 40));

    // Fully clear the canvas first
    canvas.fillStyle = "rgb(2, 1, 18)"; // Deep dark base color
    canvas.fillRect(0, 0, tela.width, tela.height);

    // Add the gradient background
    let grd = canvas.createRadialGradient(
        tela.width / 2,
        tela.height / 2,
        0, // Center of the screen
        tela.width / 2,
        tela.height / 2,
        tela.width // Edge of the screen
    );

    const alpha1 = 0.6; // Center intensity
    const alpha2 = 0.01; // Edge intensity
    grd.addColorStop(0, `rgba(33, 4, 104, ${alpha1})`); // Purple core
    grd.addColorStop(0.6, `rgba(15, 5, 50, 0.2)`);       // Transition to darker
    grd.addColorStop(1, `rgba(2, 1, 18, ${alpha2})`);    // Dark edge
    canvas.fillStyle = grd;
    canvas.fillRect(0, 0, tela.width, tela.height);

    // We can keep maxIntensity for red,
    // but define a smaller greenMaxIntensity for green:
    const maxRedIntensity = 0.05;
    const maxGreenIntensity = 0.05; // reduce this to make green less bright

    const transitionSpeed = 0.1; // Smoothness of transitions

    // Small pulse effect
    const pulseEffect = 0.05 * Math.sin(pulseTime);

    // === RED GLOW IF NEGATIVE ===
    if (clampedPriceChange < 0) {
        const magnitude = Math.abs(clampedPriceChange) / 50; 
        const targetRedIntensity = maxRedIntensity * magnitude + pulseEffect; 
        currentRedIntensity += (targetRedIntensity - currentRedIntensity) * transitionSpeed; 

        const redGlow = canvas.createRadialGradient(
            tela.width / 2,
            tela.height / 2,
            0, 
            tela.width / 2,
            tela.height / 2,
            tela.width * 0.6
        );
        redGlow.addColorStop(0, `rgba(255, 0, 0, ${currentRedIntensity})`);
        redGlow.addColorStop(1, "rgba(255, 0, 0, 0)");
        canvas.fillStyle = redGlow;
        canvas.fillRect(0, 0, tela.width, tela.height);
    }

    // === GREEN GLOW IF POSITIVE ===
    if (clampedPriceChange > 0) {
        const magnitude = clampedPriceChange / 20;
        // Use the new 'maxGreenIntensity' here instead of maxRedIntensity
        const targetGreenIntensity = maxGreenIntensity * magnitude + pulseEffect;
        currentGreenIntensity += (targetGreenIntensity - currentGreenIntensity) * transitionSpeed;

        const greenGlow = canvas.createRadialGradient(
            tela.width / 2,
            tela.height / 2,
            0, 
            tela.width / 2,
            tela.height / 2,
            tela.width * 0.6
        );
        greenGlow.addColorStop(0, `rgba(0, 255, 0, ${currentGreenIntensity})`);
        greenGlow.addColorStop(1, "rgba(0, 255, 0, 0)");
        canvas.fillStyle = greenGlow;
        canvas.fillRect(0, 0, tela.width, tela.height);

        // Also apply same green intensity to plankton
        const planktonTarget = Math.max(0, currentGreenIntensity);
        window.planktonGreenIntensity += (planktonTarget - window.planktonGreenIntensity) * 0.1;
    } else {
        // Fade out plankton's green intensity if not positive
        window.planktonGreenIntensity += (0 - window.planktonGreenIntensity) * 0.1;
    }

    // Fade out unused red/green intensities
    if (clampedPriceChange >= 0) {
        currentRedIntensity += (0 - currentRedIntensity) * transitionSpeed;
    }
    if (clampedPriceChange <= 0) {
        currentGreenIntensity += (0 - currentGreenIntensity) * transitionSpeed;
    }

    pulseTime += 0.01; // Pulse increment
}

let updateAnimation; // Declare to store the animation frame request

function calculateWavePosition(timestamp, canvasWidth, canvasHeight) {
  const timeSec = timestamp * 0.001;
  let waveInfo = { active: false, x: 0, y: 0 };

  // Check if it's time to start a wave
  if (!waveActive && timeSec > waveStartTime + waveInterval) {
    waveActive = true;
    waveStartTime = timeSec;
  }
  
  if (waveActive) {
    const waveElapsed = timeSec - waveStartTime;
    const fraction = waveElapsed / waveDuration;
    
    if (fraction >= 1) {
      // Wave ended
      waveActive = false;
    } else {
      // Calculate diagonal position
      // Total distance to travel is the diagonal of the canvas
      const diagonal = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
      const progress = fraction * diagonal;
      
      // Calculate x and y positions along diagonal
      waveInfo.x = (progress / diagonal) * canvasWidth;
      waveInfo.y = (progress / diagonal) * canvasHeight;
      waveInfo.active = true;
    }
  }
  
  return waveInfo;
}

let animationFrameId = null;

function update(timestamp) {
  // Clear any existing animation frame
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  // Clear the canvas
  clear();
  isDay = calculateIsDay();
  
  // Sort by zIndex
  particles.sort((a, b) => a.zIndex - b.zIndex);

  if (!isSnapshotMode) {
    // Movement
    particles = particles.filter((particle) => particle && particle.move());

    // Re-populate if needed
    if (time_to_recreate) {
      const params = calculateEnvironmentParams();
      const desiredParticles = Math.floor(params.maxParticles * 0.8);
      if (particles.length < desiredParticles) {
        popolate(1);
      }
    }

    // Get wave position
    const waveInfo = calculateWavePosition(timestamp, window.innerWidth, window.innerHeight);

    // Now apply wave logic + draw
    particles.forEach((p) => {
      if (waveInfo.active && p instanceof Plankton) {
        // Calculate distance from wave front (diagonal line)
        const dx = p.x - waveInfo.x;
        const dy = p.y - waveInfo.y;
        
        // Check if particle is behind the wave front
        // Using a width for the wave effect
        const waveWidth = 1; // Adjust this value to change the width of the wave effect
        const distanceFromWaveFront = dx + dy;
        
        if (distanceFromWaveFront < waveWidth && distanceFromWaveFront > -waveWidth) {
          // Set full luminescence for dots within wave effect
          for (const sd of p.subDots) {
            // Only set to max if the new value would be higher than current
            const newValue = p.maxLuminescentFrames;
            if (newValue > sd.luminescentTimer) {
                sd.luminescentTimer = newValue;
            }
          }
        }
      }

      // Render
      if (p.render) p.render();
    });
  } else {
    // Snapshot mode
    particles.forEach((p) => {
      // Handle mouse interactions for plankton
      if (p instanceof Plankton) {
        // Process each sub-dot for mouse proximity and luminescence
        for (const sd of p.subDots) {
          const subX = p.x + sd.offsetX;
          const subY = p.y + sd.offsetY;
          const dx = subX - mouseX;
          const dy = subY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Check mouse proximity and update luminescence
          if (dist < 20) {
            sd.luminescentTimer = p.maxLuminescentFrames;
          } else if (sd.luminescentTimer > 0) {
            // Decay the glow if not in proximity
            sd.luminescentTimer--;
          }
        }
      }

      // Render the particle
      if (p.render) {
        p.render();
      } else if (p.draw) {
        p.draw();
      }
    });
  }

  // Request next frame with proper management
  animationFrameId = requestAnimationFrame(update);
}

// Add this function to handle mode changes
function toggleSnapshotMode(enabled) {
  isSnapshotMode = enabled;
  
  // Cancel any existing animation frame when switching modes
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  // Start the animation loop again
  animationFrameId = requestAnimationFrame(update);
}

  $(window).on("resize", function () {
    if (tela) {
      tela.width = window.innerWidth;
      tela.height = window.innerHeight;
    }
  });

  function createCursorGlow() {
    $(".cursor-glow").remove();

    const cursorGlow = $("<div></div>").addClass("cursor-glow");
    cursorGlow.css({
      position: "absolute",
      width: "200px",
      height: "200px",
      "pointer-events": "none",
      "border-radius": "50%",
      background:
        "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(150,180,255,0.01) 50%, rgba(0,0,0,0) 70%)",
      "z-index": "99999",
      "margin-left": "-100px",
      "margin-top": "-100px"
    });

    $("body").append(cursorGlow);
  }

function redrawParticles() {
    if (isSnapshotMode) {
        clear();
        // Sort particles by zIndex before drawing
        particles.sort((a, b) => a.zIndex - b.zIndex);
        particles.forEach((particle) => {
            if (particle) {
                // Add debug log
                if (particle instanceof Jellyfish) {
                    console.log('Redrawing jellyfish in snapshot mode');
                }
                // Force draw method for jellyfish
                if (particle instanceof Jellyfish) {
                    particle.draw(canvas, Date.now() * 0.001);
                } else if (typeof particle.draw === "function") {
                    particle.draw();
                } else if (typeof particle.render === "function") {
                    particle.render();
                }
            }
        });
    }
}
  $(document).mousemove(function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    

    // Update cursor glow position
    const glow = $(".cursor-glow");
    if (glow.length === 0) {
      createCursorGlow();
    }
    glow.css({
      left: mouseX,
      top: mouseY
    });

    let hoveredParticle = null;

    // Check hover for all particles
    particles.forEach((particle) => {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
              // Add Coral detection
        if (particle instanceof Coral) {
            if (distance < particle.baseSize) {
                hoveredParticle = particle;
            }
        } else if (distance < particle.radius * 2) {
            hoveredParticle = particle;
        }
    
      
      const clusterHoverRadius = 100;

if (distance < clusterHoverRadius && particle instanceof Plankton) {
   hoveredParticle = particle;
}

      // For UndulatingSerpent, check the head segment
      if (particle instanceof UndulatingSerpent && particle.path.length > 0) {
        const head = particle.path[0];
        const headDx = mouseX - head.x;
        const headDy = mouseY - head.y;
        const headDistance = Math.sqrt(headDx * headDx + headDy * headDy);

        if (headDistance < particle.segmentDistance + 10) {
          hoveredParticle = particle;
        }
      } else if (distance < particle.radius * 2) {
        hoveredParticle = particle;
      }
    });

if (hoveredParticle) {
  // Count the number of particles of the same species
  const speciesCount = hoveredParticle instanceof Plankton 
    ? "N/A" 
    : particles.filter(particle => particle.constructor === hoveredParticle.constructor).length;
      
      // Tooltip display
      tooltip.html(`
<div style="font-weight: 400; font-size: 12px; margin-bottom: 5px; text-align: left;">
    ${hoveredParticle.speciesName || "Unknown Species"}
    </div>
    <div>
        <span style="color: white;">Color:</span> 
        <span style="color: white;">${
          hoveredParticle.colorDescription || "Varied"
        }</span>
    </div>
    <div>
        <span style="color: white;">Description:</span> 
        <span style="color: white;">${
          hoveredParticle.behavior || "Unknown"
        }</span>
    </div>
    <div>
        <span style="color: white;">Size:</span> 
        <span style="color: white;">${
          hoveredParticle.radius?.toFixed(1) || "N/A"
        }</span>
    </div>
    <div>
        <span style="color: white;">Number:</span> 
        <span style="color: white;">${speciesCount}</span>
    </div>
`);
      tooltip.css({
        left: mouseX + 20 + "px",
        top: mouseY + 20 + "px",
        display: "block",
        opacity: 1
      });

      clearTimeout(tooltip.hideTimeout);
      tooltip.hideTimeout = setTimeout(() => {
        tooltip.css("opacity", 0);
        setTimeout(() => tooltip.css("display", "none"), 300);
      }, 2000);

      // Highlight functionality
      particles.forEach((particle) => {
        if (particle.constructor === hoveredParticle.constructor) {
          particle.isHighlighted = true; // Highlight similar particles
        } else {
          particle.isHighlighted = false; // Reset others
        }
      });

      if (isSnapshotMode) {
        redrawParticles(); // Force redraw if in snapshot mode
      }
    } else {
      // Reset highlighting for all particles
      particles.forEach((particle) => {
        particle.isHighlighted = false;
      });

      // Hide tooltip
      clearTimeout(tooltip.hideTimeout);
      tooltip.hideTimeout = setTimeout(() => {
        tooltip.css("opacity", 0);
        setTimeout(() => tooltip.css("display", "none"), 300);
      }, 300);

      if (isSnapshotMode) {
        redrawParticles();
      }
    }
  });

  function init() {
    max_particles = 700;
    particles = [];
    frequency = 20;
    init_num = max_particles;
    max_time = frequency * max_particles;
    time_to_recreate = false;
    createCursorGlow();
    initializeTour();
    startTour();

    const data = createCanvas();
    if (!data) return;

    tela = data[0];
    canvas = data[1];

    updateInfoDisplay = createInfoDisplay();

    // Fetch the market cap and update particles immediately
    fetchMarketCap().then(() => {
      const params = calculateEnvironmentParams(); // Calculate based on fetched market cap
      popolate(params.maxParticles); // Populate particles instantly
    });

    // Set up periodic fetching of market cap data
    setInterval(fetchMarketCap, 30000);

    setTimeout(function () {
      time_to_recreate = true;
    }, max_time);

    update(); // Start the animation loop
  }
  init();
});