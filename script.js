$(document).ready(function() {
    // Global variables
    let max_particles, particles, frequency, init_num, max_time, time_to_recreate, tela, canvas;
    let marketCap = 0; // Replace environmentHealth with marketCap
    const MAX_MARKETCAP = 5000000; // Replace MAX_HEALTH
    let mouseX = 0;
    let mouseY = 0;
    const REPULSION_RADIUS = 100;
    const REPULSION_STRENGTH = 5;
    let previousMarketCap = marketCap;
  let isSnapshotMode = false;
  let priceChange1hr = 0; // Initialize to 0 or some default value
let isDay = true; // Start with daytime
let titleFadedOut = false; // Flag to ensure fade-out happens only once
  

function maximizeFromLogo() {
    const infoDiv = $('.environment-info');
    const logoCircle = $('#logo-circle');
    
    infoDiv.show().css({
        transform: 'scale(1)',
        opacity: '1',
        top: '100px',
        left: '20px',
        transition: 'all 0.3s ease-in-out'
    });

    logoCircle.removeClass('glowing');
    window.isInfoVisible = true;
}
  
function updateInfoDisplay() {
}
// Create a tooltip element
const tooltip = $('<div class="tooltip"></div>');
$('body').append(tooltip);
  
function updateTime() {
    isDay = !isDay; // Toggle between day and night
    updateLighting(); // Adjust lighting for day/night cycle
}
      // Function to create a Food instance at the clicked position
    function createFoodAtClick(x, y) {
        const food = new Food(canvas);
        food.x = x;
        food.y = y;
        particles.push(food); // Add to the particles array
    }
      // Modals
    $('#about-button').click(() => $('#about-modal').fadeIn());
    $('#changelog-button').click(() => $('#changelog-modal').fadeIn());
    $('.close').click(function () {
        $(this).closest('.modal').fadeOut();
    });
    $(window).click(function (e) {
        if ($(e.target).hasClass('modal')) {
            $(e.target).fadeOut();
        };

        if (clickedParticle) {
            tooltip.html(`
                <div style="font-weight: 400; margin-bottom: 5px;">${clickedParticle.speciesName || "Unknown Species"}</div>
                <div>Color: ${clickedParticle.colorDescription || "Varied"}</div>
                <div>Description: ${clickedParticle.behavior || "Unknown"}</div>
                <div>Size: ${clickedParticle.radius?.toFixed(1) || "N/A"} units</div>
            `);
            tooltip.css({
                left: e.pageX + 20 + 'px',
                top: e.pageY + 20 + 'px',
                display: 'block',
                opacity: 1,
            });
        }
});

// Stop all event bubbling on specific buttons
$('#snapshot-button, #info-toggle').on('click', function (e) {
    e.stopPropagation(); // Stop click from bubbling
    e.preventDefault(); // Prevent default action
});

$('#snapshot-button').click(() => {
    isSnapshotMode = !isSnapshotMode; // Toggle the mode
    if (isSnapshotMode) {
        cancelAnimationFrame(updateAnimation); // Pause animation
        $('#snapshot-button').text('Play Simulation'); // Update button text
    } else {
        requestAnimationFrame(update); // Resume animation
        $('#snapshot-button').text('Pause Simulation'); // Update button text
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
                <div style="font-weight: 400; margin-bottom: 5px;">${clickedParticle.speciesName || "Unknown Species"}</div>
                <div>Color: ${clickedParticle.color || "Varied"}</div>
                <div>Size: ${clickedParticle.radius.toFixed(1)} units</div>
                <div>Behavior: ${clickedParticle.isLeader ? "Leader" : "NA"}</div>
            `);
            tooltip.css({
                left: mouseX + 20 + 'px',
                top: mouseY + 20 + 'px',
                display: 'block',
                opacity: 1,
            });
        }
    }
});
  
function createLogoCircle() {
    const logoCircle = $('<div id="logo-circle"></div>');

    logoCircle.css({
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        cursor: 'pointer',
        overflow: 'visible',
        transition: 'all 0.3s ease'
    });

    logoCircle.html(
        '<img src="https://i.imghippo.com/files/ml7732OA.png" alt="Logo" style="width: 70%; height: 70%; border-radius: 50%;" />'
    );

    $('body').append(logoCircle);

    // Modified click handler
    logoCircle.on('click', function() {
        console.log('Logo clicked, isInfoVisible:', window.isInfoVisible); // Debug log
        if ($('.environment-info').is(':hidden')) {  // Check if info div is actually hidden
            maximizeFromLogo();
        }
    });
}

// Call this function after the DOM is ready
$(document).ready(function () {
    createLogoCircle();
});

  
function updateLighting() {
    let backgroundColor, particleGlow;

    if (isDay) {
        backgroundColor = 'rgb(25, 25, 54)';  // Lighter for day
        particleGlow = 1.0; // Full intensity
    } else {
        backgroundColor = 'rgb(0, 0, 20)';  // Darker for night
        particleGlow = 0.4; // Dim intensity
    }

    canvas.fillStyle = backgroundColor;
    canvas.fillRect(0, 0, tela.width, tela.height);

    particles.forEach((particle) => {
        if (particle instanceof FishLarva) {
            particle.glowIntensity = particleGlow;
        }
    });
}


// Make day/night cycle longer (5 minutes)
setInterval(updateTime, 50000);

    // Add this function at the top level
    function avoidCollisions(particle, particles) {
        const AVOIDANCE_RADIUS = 15; // Distance at which particles start avoiding each other
        const AVOIDANCE_STRENGTH = 0.5; // How strongly particles avoid each other

        let avoidanceX = 0;
        let avoidanceY = 0;
        let count = 0;

        for(const other of particles) {
            if(other === particle) continue;

            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If particles are too close, calculate avoidance force
            if(distance < AVOIDANCE_RADIUS) {
                const force = (AVOIDANCE_RADIUS - distance) / AVOIDANCE_RADIUS;
                avoidanceX += (dx / distance) * force;
                avoidanceY += (dy / distance) * force;
                count++;
            }
        }

        // If there are nearby particles, apply avoidance force
        if(count > 0) {
            particle.x += avoidanceX * AVOIDANCE_STRENGTH;
            particle.y += avoidanceY * AVOIDANCE_STRENGTH;
        }
    }


async function fetchMarketCap() {
    const tokenAddress = 'C3JX9TWLqHKmcoTDTppaJebX2U7DcUQDEHVSmJFz6K6S';
    const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.pairs && data.pairs.length > 0) {
            const fetchedMarketCap = parseFloat(data.pairs[0].marketCap) || 0;
            priceChange1hr = parseFloat(data.pairs[0].priceChange.h1) || 0;

            previousMarketCap = marketCap;
            marketCap = fetchedMarketCap;

 handleBacteriaSpawning(priceChange1hr);
            updateInfoDisplay();
        }
    } catch (error) {
        console.error('Error fetching market cap data:', error);
    }
}

  
 let bacteriaDetected = false; // Global variable to track bacteria presence


function handleBacteriaSpawning(priceChange1hr) {
    const bacteriaExists = particles.some(p => p instanceof Bacteria);

    if (priceChange1hr < -10) {
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
    particles = particles.filter(p => !(p instanceof Bacteria));
}

function createInfoDisplay() {
    const container = $('<div id="info-container"></div>');
    const infoDiv = $('<div class="environment-info"></div>');

    container.css({
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    });

    $('body').append(container);
    container.append(infoDiv);

    infoDiv.css({
        position: 'fixed', // Explicitly fixed to isolate from layout changes
        top: '100px',
        left: '20px',
        zIndex: 10,
        cursor: 'grab',
    });

// Dragging logic
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

infoDiv.on('mousedown', function(e) {
    isDragging = true;
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    
    infoDiv.css({ 
        cursor: 'grabbing',
        position: 'fixed',  // Ensure position is fixed
        willChange: 'transform'  // Optimize for animations
    });
    e.stopPropagation();
});

$(document).mousemove(function (e) {
    console.log("Mouse moved. Coordinates:", e.clientX, e.clientY);
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!titleFadedOut) {
        console.log("Fading out canvas title and subtitle using CSS...");
        $('#canvas-title, #canvas-subtitle').css('opacity', '0'); // Trigger the CSS fade-out for both
        setTimeout(() => {
            $('#canvas-title, #canvas-subtitle').css('display', 'none'); // Hide after transition
            console.log("Canvas title and subtitle faded out and hidden using CSS.");
        }, 4000); // Match the duration of the CSS transition
        titleFadedOut = true;
    }
});
  
$(document).on('mousemove', function(e) {
    if (isDragging) {
        e.preventDefault();
        
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;

        // Use transform for better performance
        infoDiv.css({
            transform: `translate3d(${currentX}px, ${currentY}px, 0)`,
            transition: 'none'
        });
    }
});

$(document).on('mouseup', function() {
    if (isDragging) {
        isDragging = false;
        infoDiv.css({ 
            cursor: 'grab',
            willChange: 'auto'  // Reset will-change
        });
    }
});

$(document).on('mouseup', function () {
    if (isDragging) {
        isDragging = false;
        infoDiv.css({ cursor: 'grab' });
    }
});
  
function updateIndicator(canvasId, percentage, label) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    // Set up canvas for high-quality rendering
    const scaleFactor = window.devicePixelRatio || 1; // Account for high-DPI displays
    canvas.width = 60 * scaleFactor;
    canvas.height = 60 * scaleFactor;
    canvas.style.width = '60px';
    canvas.style.height = '60px';
    ctx.scale(scaleFactor, scaleFactor);

    const centerX = 30;
    const centerY = 30;
    const radius = 25;
    const startAngle = -0.5 * Math.PI; // Start at top
    const endAngle = (percentage / 100) * 2 * Math.PI - 0.5 * Math.PI;

    // Calculate color dynamically
    const greenValue = Math.round((percentage / 100) * 255); // Scale green intensity from 0 to 255
    const strokeColor = `rgb(${255 - greenValue}, 255, ${255 - greenValue})`; // Transition from white to green
    const shadowColor = `rgba(0, ${greenValue}, 0, 0.6)`; // Greenish glow
    const textColor = `rgb(${255 - greenValue}, 255, ${255 - greenValue})`; // Match text color to stroke

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Progress circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = strokeColor; // Dynamic color
    ctx.lineWidth = 5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = shadowColor;
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow blur

    // Add percentage text in the center
    ctx.font = '12px Arial';
    ctx.fillStyle = textColor; // Dynamic text color
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(percentage)}%`, centerX, centerY);
}
function minimizeToLogo() {
    const infoDiv = $('.environment-info');
    const logoCircle = $('#logo-circle');
    const logoPosition = logoCircle.offset();
    
    console.log('Minimizing to logo'); // Debug log
    
    infoDiv.css({
        transition: 'all 0.3s ease-in-out',
        transform: 'scale(0.1)',
        opacity: '0',
        top: `${logoPosition.top}px`,
        left: `${logoPosition.left}px`
    });

    setTimeout(() => {
        infoDiv.hide();
        logoCircle.addClass('glowing');
    }, 300);

    window.isInfoVisible = false;
}
// Full contract address
const fullAddress = 'C3JX9TWLqHKmcoTDTppaJebX2U7DcUQDEHVSmJFz6K6S';

// Function to truncate the address
function truncateAddress(address) {
    if (address.length > 20) {
        return address.slice(0, 10) + '...' + address.slice(-10);
    }
    return address;
}

// Populate the truncated address on load
document.getElementById('truncated-address').innerText = truncateAddress(fullAddress);
document.getElementById('full-address').innerText = fullAddress; // Keep the full address hidden

// Add Copy-to-Clipboard functionality
document.getElementById('copy-address-btn').addEventListener('click', () => {
    // Copy the full address to the clipboard
    navigator.clipboard.writeText(fullAddress).then(() => {
        alert('Contract address copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy address: ', err);
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

    // Check for the "TOXIC" condition based on price change
    if (priceChange1hr < -20) {
        condition = "Contaminated";
        conditionColor = "#ff4444";
    } else {
        // Determine the ecosystem stage based on marketCap thresholds
        if (marketCap < 50000) {
            condition = "Early Ecosystem"; // Corresponds to <20000 in getProbabilitiesBasedOnThreshold
            conditionColor = "#ffffff"; // Optional: Set color
        } else if (marketCap < 100000) {
            condition = "Ecosystem Growing"; // Corresponds to <100000
            conditionColor = "#ffffff"; // Optional: Set color
        } else if (marketCap < 500000) {
            condition = "Mid-Level Ecosystem"; // Corresponds to <500000
            conditionColor = "#ffffff"; // Optional: Set color
        } else {
            condition = "Thriving Ecosystem"; // Market cap >= 500000
            conditionColor = "#ffffff"; // Optional: Set color
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
    } else {
        nextMilestone = null;
    }

    const progressPercent = nextMilestone
        ? Math.min(((marketCap / nextMilestone) * 100).toFixed(1), 100)
        : 100;

    // Progress bar HTML
const progressBarHTML = nextMilestone
    ? `
<div style="margin-top: 10px; margin-bottom: ${priceChange1hr < -10 ? '10px' : '0'}; font-size: 14px;">
    <span style="color: #ffffff;">New Species at </span>
    <span style="color: #00ff00;">$${nextMilestone.toLocaleString()}</span>
    <span style="color: #ffffff;">MC</span>
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
        background: linear-gradient(to right, #9945FF, #14F195, #00e7f5);
        border-radius: 10px;
        height: 100%;
        width: ${progressPercent}%;
        transition: width 0.5s;
        box-shadow: 0 0 10px rgba(20, 241, 149, 0.6);
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
const bacteriaWarning = priceChange1hr < -10 && particles.some(p => p instanceof Bacteria)
    ? `<div class="warning-label" style="
        color: #ff4444; 
        font-weight: 400; 
        animation: pulse 1.5s infinite;
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
        text-align: left;
    ">⚠️ WARNING: Hostile bacteria detected! Stabilize price immediately.</div>`
    : '';

    const indicatorsHTML = `
    <div id="indicators-container" style="display: flex; justify-content: space-around; margin-top: 20px; padding: 0; border: none; background-color: transparent;">
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

    // Update infoDiv
    infoDiv.html(
        `${closeButton}
        <h3 style="margin: 0 0 15px 0">Environment Status</h3>
        ${indicatorsHTML}
        <div>Market Cap: $${marketCap.toLocaleString()}</div>
        <div>Price Change (1hr): <span style="color: ${priceChange1hr < 0 ? '#ff4444' : '#00ff00'}">${priceChange1hr}%</span></div>
        <div>Stage: <span style="color: ${conditionColor}; font-weight: 400;">${condition}</span></div>
        <div>Time of Day: ${isDay ? 'Morning' : 'Night'}</div>
        <div>Total Population: ${particles.length}</div>
        ${progressBarHTML}
        ${bacteriaWarning}`);
  
// Add click handler for close button
$('.info-close').off('click').on('click', function(e) {
    e.stopPropagation();
    const infoDiv = $('.environment-info');
    const logoCircle = $('#logo-circle');
    const logoPosition = logoCircle.offset();
    
    infoDiv.css({
        transition: 'all 0.3s ease-in-out',
        transform: 'scale(0.1)',
        opacity: '0',
        top: `${logoPosition.top}px`,
        left: `${logoPosition.left}px`
    });

    setTimeout(() => {
        infoDiv.hide();
        logoCircle.addClass('glowing');
    }, 300);

    window.isInfoVisible = false;
});

// Also update the close button handler
$('.info-close').off('click').on('click', function(e) {
    e.stopPropagation();
    const infoDiv = $('.environment-info');
    const logoCircle = $('#logo-circle');
    const logoPosition = logoCircle.offset();
    
    infoDiv.css({
        transition: 'all 0.3s ease-in-out',
        transform: 'scale(0.1)',
        opacity: '0',
        top: `${logoPosition.top}px`,
        left: `${logoPosition.left}px`
    });

    setTimeout(() => {
        infoDiv.css('display', 'none');
        logoCircle.addClass('glowing');
    }, 300);

    isInfoVisible = false;
});
    // Calculate indicator percentages
    const capacityPercentage = Math.min((particles.length / 5000) * 100, 100);
   // Exclude Food and Bacteria from growth calculation
    const nonGrowthParticles = particles.filter(p => !(p instanceof Food || p instanceof Bacteria));
    const uniqueSpecies = [...new Set(nonGrowthParticles.map(p => p.constructor.name))];
    const totalSpecies = 10; // Replace with your actual total number of species

    const growthPercentage = Math.min((uniqueSpecies.length / totalSpecies) * 100, 100);

    // Example health calculation (replace with real metrics)
    const harmfulParticles = particles.filter(p => p instanceof Bacteria).length;
    const harmfulRatio = particles.length > 0 ? harmfulParticles / particles.length : 0;
    const priceStability = Math.max(100 - Math.abs(priceChange1hr), 0); // Stability = 100 - volatility
    const averageSpeed = particles.reduce((sum, p) => sum + (p.speed || 0), 0) / particles.length || 0;
    const healthPercentage = Math.min(
        (0.5 * priceStability) + (0.3 * (1 - harmfulRatio) * 100) + (0.2 * averageSpeed * 100),
        100
    );

    // Update indicators dynamically
    updateIndicator('capacity-indicator', capacityPercentage, 'Capacity');
    updateIndicator('health-indicator', healthPercentage, 'Health');
    updateIndicator('growth-indicator', growthPercentage, 'Growth');

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
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Progress circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.stroke();

    // Text
    ctx.font = '12px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${value}%`, centerX, centerY);
}

        $('body').append(infoDiv);
        setInterval(updateInfo, 1000);
    }
  
  function getProbabilitiesBasedOnThreshold(marketCap) {
    if (marketCap < 50000) {
        // Early ecosystem stage
        return {
            fishLarvaEgg: 0,
            fishLarva: 0,
            paramecium: 1,
            fishEgg: 0, 
            neonTrail: 0,
            rainbowTrail: 0,  
            undulatingSerpent: 0,
            stingray: 0,
        };
    } else if (marketCap < 70000) {
        // Ecosystem is growing
        return {
            fishLarvaEgg: 0,
            fishLarva: 0, 
            paramecium: 0.7,
            fishEgg: 0.3, 
            neonTrail: 0,
            rainbowTrail: 0,
            undulatingSerpent: 0, 
        };
    } else if (marketCap < 100000) {
        // Mid-level ecosystem
        return {
            fishLarvaEgg: 0.2,
            fishLarva: 0, 
            paramecium: 0.5, 
            fishEgg: 0.3, 
            neonTrail: 0, 
            rainbowTrail: 0,
            undulatingSerpent: 0,
        };
    } else if (marketCap < 250000) {
        // Mid-level ecosystem
        return {
            fishLarvaEgg: 0.2,
            fishLarva: 0.2, 
            paramecium: 0.4, 
            fishEgg: 0.2, 
            neonTrail: 0, 
            rainbowTrail: 0,
            undulatingSerpent: 0,           
        };
    } else if (marketCap < 500000) {
        // Mid-level ecosystem
        return {
            fishLarvaEgg: 0.2,
            fishLarva: 0.4, 
            paramecium: 0.15, 
            fishEgg: 0.2, 
            neonTrail: 0.05, 
            rainbowTrail: 0,
            undulatingSerpent: 0,           
        };
    } else if (marketCap < 1000000) {
        // Mid-level ecosystem
        return {
            fishLarvaEgg: 0.2,
            fishLarva: 0.39, 
            paramecium: 0.1, 
            fishEgg: 0.2, 
            neonTrail: 0.1, 
            rainbowTrail: 0.01,
            undulatingSerpent: 0,           
        };
    } else if (marketCap < 2000000) {
        // Mid-level ecosystem
        return {
            fishLarvaEgg: 0.2,
            fishLarva: 0.24, 
            paramecium: 0.2, 
            fishEgg: 0.2, 
            neonTrail: 0.1, 
            rainbowTrail: 0.05,
            undulatingSerpent: 0.01,           
        };
    } else {
        // Thriving ecosystem (high market cap)
        return {
            fishLarvaEgg: 0, 
            fishLarva: 0,
            paramecium: 0,
            fishEgg: 0,
            neonTrail: 0, 
            rainbowTrail: 0,
            undulatingSerpent: 0,
        };
    }
}

    function calculateEnvironmentParams() {
        const marketCapPercent = marketCap / MAX_MARKETCAP; // Scale marketCap to a percentage
        const baseParticles = 50;
        const marketCapDropPercent =
            previousMarketCap > 0 ? (previousMarketCap - marketCap) / previousMarketCap : 0;

return {
    maxParticles: Math.floor(baseParticles + (marketCapPercent * marketCapPercent * 5000)),
    particleSpeed: 0.3 + (marketCapPercent * 1.4),
    colorIntensity: marketCapPercent,
    particleSize: 0.5,
    bacteriaSpawnRate: marketCapDropPercent > 0.1 ? 0.3 : 0,
    particleProbabilities: getProbabilitiesBasedOnThreshold(marketCap), // Use dynamic thresholds
};

    }
    const hintTooltip = $('<div id="hint-tooltip">Hold down your mouse to feed the fish!</div>').css({
        position: 'absolute',
        padding: '10px 20px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        fontSize: '12px',
      "font-family": 'Inter Tight, sans-serif',
        borderRadius: '5px',
        zIndex: 1000,
        pointerEvents: 'none',
        display: 'none', // Hidden by default
    });
    $('body').append(hintTooltip);

    // Show the tooltip on mousemove
    $(document).on('mousemove', function (e) {
        hintTooltip.css({
            top: `${e.pageY + 15}px`, // Position near cursor
            left: `${e.pageX + 15}px`,
            display: 'block',
        });
    });

    // Hide the tooltip on click
    $(document).on('click', function () {
        hintTooltip.fadeOut(300, function () {
            $(this).remove(); // Remove the tooltip after fade-out
        });
    });

    // Mini progress bar near cursor
    const progressBar = $('<div id="cursor-progress-bar"></div>').css({
        position: 'absolute',
        width: '20px',
        height: '4px',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '2px',
        overflow: 'hidden',
        zIndex: 1000,
        display: 'none',
    });

    const progressFill = $('<div></div>').css({
        height: '100%',
        width: '0%',
        background: '#00E7F5',
        transition: 'width 0.3s linear',
    });

    progressBar.append(progressFill);
    $('body').append(progressBar);

    // Hold logic
    let holdTimer = null;
    const holdDuration = 3000; // 3 seconds
    let isHolding = false;

    $(document).on('mousedown', function (e) {
        if (isHolding) return; // Prevent multiple triggers

        isHolding = true;
        progressBar.css({ display: 'block', top: `${e.pageY + 20}px`, left: `${e.pageX}px` });
        progressFill.css('width', '0%');

        // Start progress animation
        progressFill.animate({ width: '100%' }, holdDuration, 'linear');

        // After hold duration, drop food
        holdTimer = setTimeout(() => {
            createFoodAtClick(e.pageX, e.pageY); // Drop food
            progressBar.fadeOut();
        }, holdDuration);
    });

    $(document).on('mousemove', function (e) {
        progressBar.css({ top: `${e.pageY + 20}px`, left: `${e.pageX}px` });
    });

    $(document).on('mouseup', function () {
        if (isHolding) {
            clearTimeout(holdTimer);
            progressBar.fadeOut();
            progressFill.stop().css('width', '0%'); // Reset progress
            isHolding = false;
        }
    });

    class FishEgg {
        constructor(canvas) {
            const params = calculateEnvironmentParams();
            const random = Math.random();
            this.progress = 0;
            this.canvas = canvas;
          this.behavior = "Tiny beginnings of aquatic life, delicate and full of potential";
          this.colorDescription = "Opaque";
          this.speciesName = "Fish Egg";
          

            this.x = Math.random() * $(window).width();
            this.y = Math.random() * $(window).height();

            this.w = $(window).width();
            this.h = $(window).height();

            this.radius = (12 + Math.random() * 6) * params.particleSize;

            const baseColor = [255, 255, 255];
            const intensity = 0.3 + (params.colorIntensity * 0.7);
            this.color = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${intensity})`;

            this.fish_egg = {
                offset1: Math.random() > 0.5 ? 0.5 + Math.random() * 3 : 0.5 + Math.random() * -3,
                offset2: Math.random() > 0.5 ? 0.5 + Math.random() * 3 : 0.5 + Math.random() * -3,
                offset3: Math.random() > 0.5 ? 0.5 + Math.random() * 3 : 0.5 + Math.random() * -3,
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
            this.createCircle(this.x + this.fish_egg.offset2, this.y + this.fish_egg.offset2, this.fish_egg.radius2 + 4, "rgba(241, 242, 244, 0.5)")
            this.createCircle(this.x + this.fish_egg.offset3, this.y + this.fish_egg.offset3, this.fish_egg.radius3 + 2, "rgba(255, 204, 67, 0.8)")
            this.createCircle(this.x + (Math.random(this.progress / 350) * this.fish_egg.offset1), this.y + (Math.random(this.progress / 350) * this.fish_egg.offset1), this.fish_egg.radius1, "rgba(152, 19, 4, 0.6)")
        }

        render() {
    const ctx = this.canvas;

    // Apply highlight effect if the particle is hovered
if (this.isHighlighted) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)'; // Subtle white glow
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
            let c = '130, 151, 180';
            let rad = this.canvas.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, 1);
            rad.addColorStop(0, 'rgba(' + c + ',0.5)');
            rad.addColorStop(0.9, 'rgba(' + c + ',0)');
            this.canvas.lineWidth = Math.random() * 2.2;
            this.canvas.fillStyle = rad;
            this.canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.canvas.fill();
            this.canvas.strokeStyle = "rgba(255, 255, 217, 0.05)";
            this.canvas.stroke();
            this.canvas.closePath();
        }

move() {
    this.x += (Math.sin(this.progress / this.variantx1) * Math.cos(this.progress / this.variantx2)) / 8;
    this.y += (Math.sin(this.progress / this.varianty1) * Math.cos(this.progress / this.varianty2)) / 8;

    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < REPULSION_RADIUS) {
        const force = (1 - distance / REPULSION_RADIUS) * REPULSION_STRENGTH;
        this.x += (dx / distance) * force;
        this.y += (dy / distance) * force;
    }

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
this.behavior = "Young swimmers navigating their watery world with curiosity";
this.colorDescription = "Orange, glows blue at night";

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
        this.wanderlust = this.isLeader ? 0.8 + Math.random() * 0.2 : 0.2 + Math.random() * 0.3;

        // Color handling
        const intensity = 0.3 + (params.colorIntensity * 0.7);
        const leaderColor = "#FFD700";  // Gold color for leaders
        const followerColor = "#F69A34"; // Orange color for followers
        const baseColor = this.hexToRgb(this.isLeader ? leaderColor : followerColor) || 
            { r: 246, g: 154, b: 52 };
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
            angle: this.a,
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
        hex = hex.replace(/^#/, '');
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
    
    particles.forEach(other => {
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
        const swarmCenterX = nearbyFish.reduce((sum, fish) => sum + fish.x, this.x) / (nearbyCount + 1);
        const swarmCenterY = nearbyFish.reduce((sum, fish) => sum + fish.y, this.y) / (nearbyCount + 1);
        
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
        this.baseHue = (this.baseHue + normalizedHueDiff * this.colorSpeed + 360) % 360;
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
            this.x, this.y, this.radius,
            this.x, this.y, this.radius + 10
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)'; // Subtle white glow
ctx.lineWidth = 2; // Thinner ring
        ctx.globalCompositeOperation = 'lighter'; // Create a glowing effect
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
                this.x, this.y, this.radius * 0.5,
                this.x, this.y, this.radius * 5
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
                Math.sin(this.progress * this.tailWaveFrequency + progress * Math.PI * 2) *
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

        particles.forEach(other => {
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

        // Mouse avoidance
        const mdx = this.x - mouseX;
        const mdy = this.y - mouseY;
        const mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mouseDistance < REPULSION_RADIUS && mouseDistance > 0) {
            const force = (1 - mouseDistance / REPULSION_RADIUS) * REPULSION_STRENGTH * 2;
            ax += (mdx / mouseDistance) * force;
            ay += (mdy / mouseDistance) * force;
        }

        // Edge and corner avoidance
        const leftDist = this.x;
        const rightDist = this.w - this.x;
        const topDist = this.y;
        const bottomDist = this.h - this.y;

        const inCorner = (leftDist < this.cornerMargin && (topDist < this.cornerMargin || bottomDist < this.cornerMargin)) ||
            (rightDist < this.cornerMargin && (topDist < this.cornerMargin || bottomDist < this.cornerMargin));

        if (inCorner) {
            const centerX = this.w / 2;
            const centerY = this.h / 2;
            const towardsCenterX = centerX - this.x;
            const towardsCenterY = centerY - this.y;
            const centerDist = Math.sqrt(towardsCenterX * towardsCenterX + towardsCenterY * towardsCenterY);

            if (centerDist > 0) {
                const cornerForce = this.cornerForce * (1 - Math.min(centerDist, this.cornerMargin) / this.cornerMargin);
                ax += (towardsCenterX / centerDist) * cornerForce * 4;
                ay += (towardsCenterY / centerDist) * cornerForce * 4;
            }
        }

        // Edge avoidance
        const edgeForce = this.edgeTurnForce * 2;
        if (leftDist < this.edgeMargin) ax += edgeForce;
        if (rightDist < this.edgeMargin) ax -= edgeForce;
        if (topDist < this.edgeMargin) ay += edgeForce;
        if (bottomDist < this.edgeMargin) ay -= edgeForce;

        // Group influences
        const influences = this.calculateGroupInfluence(particles);

        // Leader behavior
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

        // Apply group behaviors
    ax += influences.separation.x * 2.0;
    ay += influences.separation.y * 2.0;
    ax += influences.alignment.x * 0.8;
    ay += influences.alignment.y * 0.8;
    ax += influences.cohesion.x * 0.8;
    ay += influences.cohesion.y * 0.8;

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
            particles = particles.filter(p => p !== nearestFood);
        }
    }

    // Normalize acceleration
    const accMagnitude = Math.sqrt(ax * ax + ay * ay);
    if (accMagnitude > 0) {
        ax = ax / accMagnitude * 2;
        ay = ay / accMagnitude * 2;
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
    this.tail.forEach(segment => {
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
        this.speciesName = "Fish Larva Egg";
      this.behavior = "A transitional stage, teeming with life waiting to emerge";
this.colorDescription = "Pale translucent white with a faint shimmer";

        this.x = Math.random() * $(window).width();
        this.y = Math.random() * $(window).height();

        this.s = Math.random() * 1;
        this.a = 0;

        this.w = $(window).width();
        this.h = $(window).height();

        const baseRadius = 3 + (random * 1.5);
        this.radius = Math.min(baseRadius * params.particleSize, 4);

        const baseColors = {
            healthy: {
                r: 130,
                g: 160,
                b: 196,
            },
            unhealthy: {
                r: 46,
                g: 71,
                b: 101,
            },
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
ctx.strokeStyle = 'rgba(238, 180, 238, 0.8)'; // Subtle white glow
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

    if (!isDay) { // Apply glow effect at night
        const gradient = this.canvas.createRadialGradient(
            this.x, this.y, this.radius * 0.5, // Inner circle
            this.x, this.y, this.radius * 6 // Outer circle
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
        let nearestFood = null;
        let nearestDist = Infinity;

        // Find the nearest food particle
        for (const particle of particles) {
            if (!(particle instanceof Food)) continue;

            const dx = particle.x - this.x;
            const dy = particle.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < nearestDist) {
                nearestDist = distance;
                nearestFood = particle;
            }

            // Handle food interaction logic
            if (distance < 50) {
                if (!this.foodTimers.has(particle)) {
                    this.foodTimers.set(particle, 0);
                }
                this.foodTimers.set(particle, this.foodTimers.get(particle) + 1);

                if (this.foodTimers.get(particle) > 300) { // 5 seconds
                    particle.consume(); // Consume the food
                    particles = particles.filter((p) => p !== particle); // Remove food
                    this.foodTimers.delete(particle); // Clear timer
                }
            } else {
                // Reset timer if the egg moves away
                if (this.foodTimers.has(particle)) {
                    this.foodTimers.delete(particle);
                }
            }
        }

        // Orbit around the nearest food if within range
        if (nearestFood && nearestDist < 250) {
            const dx = nearestFood.x - this.x;
            const dy = nearestFood.y - this.y;
            const angle = Math.atan2(dy, dx);

            // Circular orbit
            const orbitSpeed = 1.5; // Adjust orbit speed
            this.x += Math.cos(angle + Math.PI / 2) * orbitSpeed; // Perpendicular to attraction
            this.y += Math.sin(angle + Math.PI / 2) * orbitSpeed;

            // Gradual inward pull
            this.x += (nearestFood.x - this.x) * 0.01;
            this.y += (nearestFood.y - this.y) * 0.01;
        } else {
            // Default random movement
            this.x += Math.cos(this.a) * this.s;
            this.y += Math.sin(this.a) * this.s;
            this.a += Math.random() * 0.1 - 0.05;
        }

        // Mouse repulsion logic
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < REPULSION_RADIUS) {
            const force = (1 - distance / REPULSION_RADIUS) * REPULSION_STRENGTH;
            this.x += (dx / distance) * force;
            this.y += (dy / distance) * force;
        }

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
this.behavior = "Single-celled wanderers, gracefully moving through the water";
this.colorDescription = "Faint white";

        // Set position
        this.x = ($(window).width() / 2) + (Math.random() * 300 - Math.random() * 300);
        this.y = ($(window).height() / 2) + (Math.random() * $(window).height() / 4 - Math.random() * $(window).height() / 4);

        // Get viewport size
        this.w = $(window).width();
        this.h = $(window).height();

        // Rotation and dimensions
        this.rotation = (random * 180) * Math.PI / 180;
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
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, this.rotation, 0, Math.PI * 2);
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
ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'; // Subtle white glow
ctx.lineWidth = 2; // Thinner ring
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }

        // Render the oval shape
        this.createOval(this.x - this.ovalWidth / 2, this.y - this.ovalHeight / 2, this.ovalWidth, this.ovalHeight);
    }

    move() {
        // Update position
        this.x += (Math.sin(this.progress / this.variantx1) * Math.cos(this.progress / this.variantx2)) / 4;
        this.y += (Math.sin(this.progress / this.varianty1) * Math.cos(this.progress / this.varianty2)) / 4;

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
this.behavior = "Illuminated swimmers leaving radiant trails in their wake";
this.colorDescription = "Cyan";
        const params = calculateEnvironmentParams();
        const random = Math.random();
        this.canvas = canvas;
        this.progress = 0;
        this.points = [];
        this.maxPoints = 15;
        this.x = Math.random() * $(window).width();
        this.y = Math.random() * $(window).height();
        this.w = $(window).width();
        this.h = $(window).height();
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 1.5;
        this.radius = (3 + random * 2) * params.particleSize;

        const intensity = 0.3 + (params.colorIntensity * 0.7);
        this.color = `rgba(0, 180, 255, ${intensity})`;
    }

    render() {
          const ctx = this.canvas;

    // Apply highlight effect if the particle is hovered
    if (this.isHighlighted) {
        ctx.save(); // Save the current state
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)'; // Bright cyan glow for NeonTrail
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

    if (!isDay) { // Apply glow effect at night
        const gradient = this.canvas.createRadialGradient(
            this.x, this.y, this.radius * 0.5, // Inner circle
            this.x, this.y, this.radius * 6 // Outer circle
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
        this.canvas.lineCap = 'round';

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
            y: this.y,
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
this.colorDescription = "A vibrant array of rainbow hues";
        }

        render() {
                  const ctx = this.canvas;

        // Apply highlight effect if the particle is hovered
        if (this.isHighlighted) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 69, 0, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
                    this.canvas.beginPath();

    if (!isDay) { // Apply glow effect at night
        const gradient = this.canvas.createRadialGradient(
            this.x, this.y, this.radius * 0.5, // Inner circle
            this.x, this.y, this.radius * 6 // Outer circle
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
            if(this.points.length > this.maxPoints) {
                this.points.shift();
            }

            this.canvas.beginPath();
            this.hue = (this.hue + 1) % 360;
            this.canvas.strokeStyle = `hsla(${this.hue}, 100%, 50%, 0.4)`;
            this.canvas.lineWidth = this.lineWidth;
            this.canvas.lineCap = 'round';

            for(let i = 1; i < this.points.length; i++) {
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
        this.colorDescription = "Red";

        this.baseColor = 'rgb(255, 0, 0, 0.8)';
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    render() {
        const ctx = this.canvas;

        // Draw the highlight if hovered
        if (this.isHighlighted) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgb(255, 0, 0, 0.8)';
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
            this.canvas.moveTo(this.x + Math.cos(angle) * this.radius, this.y + Math.sin(angle) * this.radius);
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
                particles = particles.filter(p => p !== nearestPrey);
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
this.colorDescription = "Bright Yellow";
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
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
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
        this.maxPathLength = 100; // Trail length
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 1.2;
        this.segmentDistance = 15; // Distance between segments
        this.waveAmplitude = 50;
        this.waveFrequency = 0.02;
        this.baseHue = Math.random() * 360; // Random starting hue
        this.colorSpeed = 2; // Speed of color transition
        this.progress = 0; // To create wave-like motion
      this.speciesName = "Ripple Serpent";
this.behavior = "Graceful navigators of the water";
this.colorDescription = "Shimmering scales with alternating colors";
    }

    updatePath() {
        this.progress++;
        const waveOffset = Math.sin(this.progress * this.waveFrequency) * this.waveAmplitude;
        const dx = Math.cos(this.angle) * this.speed;
        const dy = Math.sin(this.angle) * this.speed;

        this.x += dx;
        this.y += dy;

        // Add wave motion
        const newPoint = {
            x: this.x + Math.cos(this.angle + Math.PI / 2) * waveOffset,
            y: this.y + Math.sin(this.angle + Math.PI / 2) * waveOffset,
        };

        this.path.unshift(newPoint);

        if (this.path.length > this.maxPathLength) {
            this.path.pop();
        }
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
            this.path = this.path.map(segment => ({
                x: segment.x + screenWidth,
                y: segment.y
            }));
        } else if (this.x > screenWidth) {
            this.x -= screenWidth;
            this.path = this.path.map(segment => ({
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
            this.path = this.path.map(segment => ({
                x: segment.x,
                y: segment.y + screenHeight
            }));
        } else if (this.y > screenHeight) {
            this.y -= screenHeight;
            this.path = this.path.map(segment => ({
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
        ctx.arc(headSegment.x, headSegment.y, this.segmentDistance + 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(139, 69, 19, 1)';
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
            const hue = (this.baseHue + (i * 3)) % 360;
            const saturation = 80;
            const lightness = 50;
            
            // Draw main segment
            this.drawSegment(ctx, segment, nextSegment, opacity, hue, saturation, lightness);
            
            // Draw duplicates if they exist with same rainbow effect
            if (segment.rightDuplicate && nextSegment.rightDuplicate) {
                this.drawSegment(ctx, segment.rightDuplicate, nextSegment.rightDuplicate, opacity, hue, saturation, lightness);
            }
            if (segment.leftDuplicate && nextSegment.leftDuplicate) {
                this.drawSegment(ctx, segment.leftDuplicate, nextSegment.leftDuplicate, opacity, hue, saturation, lightness);
            }
            if (segment.topDuplicate && nextSegment.topDuplicate) {
                this.drawSegment(ctx, segment.topDuplicate, nextSegment.topDuplicate, opacity, hue, saturation, lightness);
            }
            if (segment.bottomDuplicate && nextSegment.bottomDuplicate) {
                this.drawSegment(ctx, segment.bottomDuplicate, nextSegment.bottomDuplicate, opacity, hue, saturation, lightness);
            }
        }
        
        // Update base hue for animation
        this.baseHue = (this.baseHue + this.colorSpeed) % 360;
    }

    drawSegment(ctx, segment, nextSegment, opacity, hue, saturation, lightness) {
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
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 20}%, ${opacity * 0.5})`;
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
  class Stingray {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.angle = Math.random() * Math.PI * 2;
        this.targetAngle = this.angle;
        this.speed = 1.5;
        this.bodyColor = "rgba(100, 149, 237, 0.9)";
        
        // Movement parameters
        this.turnSpeed = 0.015;
        this.wanderPoint = 0;
        this.wanderSpeed = 0.02;
        
        // Collision parameters
        this.avoidanceRadius = 50; // Distance to start avoiding other fish
        this.avoidanceStrength = 0.1; // How strongly to avoid others
        
        // Undulation parameters for wings only
        this.phase = 0;
        this.waveSpeed = 0.1;
        this.waveAmplitude = 0.2;

        // Shimmer effect parameters
        this.shimmerPhase = Math.random() * Math.PI * 2; // Randomize starting point
        this.shimmerSpeed = 0.05; // Speed of shimmer
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI * 1.5);
      
        // Update shimmer phase
        this.shimmerPhase += this.shimmerSpeed;
        const shimmerOffset = Math.sin(this.shimmerPhase) * 0.2;

        // Create a gradient for the shimmering wings
        const gradient = ctx.createLinearGradient(-30, 0, 30, 0);
        gradient.addColorStop(0, `rgba(0, 149, 237, ${0.7 + shimmerOffset})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.4 + shimmerOffset})`);
        gradient.addColorStop(1, `rgba(0, 149, 237, ${0.7 - shimmerOffset})`);

        // Update wing undulation
        this.phase += this.waveSpeed;
        const wingWave = Math.sin(this.phase) * 5;

        // Draw the stingray body
        ctx.beginPath();
        ctx.moveTo(0, 15); // Smaller body
        ctx.lineTo(7, 20);
        ctx.lineTo(20, 7 + wingWave); // Scale down points
        ctx.lineTo(0, -15); // Tail base
        ctx.lineTo(-20, 7 + wingWave);
        ctx.lineTo(-7, 20);
        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw static tail
        ctx.beginPath();
        ctx.moveTo(0, -13); // Base of the tail
        ctx.lineTo(0, -30); // Shorter tail
        ctx.strokeStyle = this.bodyColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

avoidOthers(particles) {
    let avoidX = 0;
    let avoidY = 0;
    let count = 0;

    // Filter for only Stingray instances
    const nearbyStingrays = particles.filter(particle => particle instanceof Stingray);

    for (const other of nearbyStingrays) {
        if (other === this) continue;

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

    wrapPosition() {
        // Screen wrapping with smooth transition
        if (this.x < -40) this.x = this.canvas.width + 39;
        if (this.x > this.canvas.width + 40) this.x = -39;
        if (this.y < -40) this.y = this.canvas.height + 39;
        if (this.y > this.canvas.height + 40) this.y = -39;
    }

    calculateNextPosition(stingrays) {
        this.wanderPoint += this.wanderSpeed;
        
        // Check if avoiding others
        const isAvoiding = this.avoidOthers(stingrays);

        if (!isAvoiding) {
            // Random wandering when not avoiding others
            const angleChange = Math.sin(this.wanderPoint) * 0.05;
            this.targetAngle += angleChange;

            // Occasionally pick a new target point in the canvas
            if (Math.random() < 0.01) {
                const targetX = Math.random() * this.canvas.width;
                const targetY = Math.random() * this.canvas.height;
                this.targetAngle = Math.atan2(targetY - this.y, targetX - this.x);
            }
        }

        // Smooth turning
        let angleDiff = this.targetAngle - this.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        this.angle += angleDiff * this.turnSpeed;

        // Update position
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    move(stingrays) {
        this.calculateNextPosition(stingrays);
        this.wrapPosition();
        this.draw();
    }
}
  
    function createCanvas() {
        let tela = document.createElement('canvas');
        tela.width = window.innerWidth;
        tela.height = window.innerHeight;
        tela.style.position = 'absolute';
        tela.style.top = '0';
        tela.style.left = '0';

        const container = $('.animation-container');
        if(container.length === 0) {
            console.error('Animation container not found');
            return;
        }

        container.append(tela);
        let canvas = tela.getContext('2d');
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
        if (params.particleProbabilities.fishEgg > 0 && fishEggCount < maxFishEggs) {
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
        cumulativeProbability += params.particleProbabilities.stingray;
        if (random < cumulativeProbability) {
            type = new Stingray(canvas);
            particles.push(type);
            continue;
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

function clear() {
    const params = calculateEnvironmentParams();

    // Fully clear the canvas first
    canvas.fillStyle = 'rgb(2, 1, 18)'; // Deep dark base color
    canvas.fillRect(0, 0, tela.width, tela.height);

    // Add the gradient background
    let grd = canvas.createRadialGradient(
        tela.width / 2, tela.height / 2, 0, // Center of the screen
        tela.width / 2, tela.height / 2, tela.width // Edge of the screen
    );

    const alpha1 = 0.6; // Center intensity
    const alpha2 = 0.01; // Edge intensity

    grd.addColorStop(0, `rgba(33, 4, 104, ${alpha1})`); // Purple core
    grd.addColorStop(0.6, `rgba(15, 5, 50, 0.2)`); // Transition to darker
    grd.addColorStop(1, `rgba(2, 1, 18, ${alpha2})`); // Dark edge

    canvas.fillStyle = grd;
    canvas.fillRect(0, 0, tela.width, tela.height);

    // Add a soft radial glow effect when price changes
    if (priceChange1hr < 0) {
        // Red glow for negative price change
        const redGlow = canvas.createRadialGradient(
            tela.width / 2, tela.height / 2, 0, // Center of the screen
            tela.width / 2, tela.height / 2, tela.width * 0.3 // Extend glow outward
        );
        redGlow.addColorStop(0, 'rgba(255, 0, 0, 0.10)');
        redGlow.addColorStop(1, 'rgba(255, 0, 0, 0)');
        canvas.fillStyle = redGlow;
        canvas.fillRect(0, 0, tela.width, tela.height);
    }

    if (priceChange1hr > 0) {
        // Green glow for positive price change
        const greenGlow = canvas.createRadialGradient(
            tela.width / 2, tela.height / 2, 0, // Center of the screen
            tela.width / 2, tela.height / 2, tela.width * 0.3 // Extend glow outward
        );
        greenGlow.addColorStop(0, 'rgba(0, 255, 0, 0.15)');
        greenGlow.addColorStop(1, 'rgba(0, 255, 0, 0)');
        canvas.fillStyle = greenGlow;
        canvas.fillRect(0, 0, tela.width, tela.height);
    }
}

 let updateAnimation; // Declare to store the animation frame request

function update() {
    if (!isSnapshotMode) {
        // Clear the canvas
        clear();

        // Update and render particles
        particles = particles.filter((particle) => particle.move());

        // Add more particles if needed
        if (time_to_recreate) {
            const params = calculateEnvironmentParams();
            const desiredParticles = Math.floor(params.maxParticles * 0.8); // Target 80% of maxParticles
            if (particles.length < desiredParticles) {
                popolate(1); // Add particles one by one
            }
        }

        // Continue animation loop
        updateAnimation = requestAnimationFrame(update);
    }
}


    $(window).on('resize', function() {
        if(tela) {
            tela.width = window.innerWidth;
            tela.height = window.innerHeight;
        }
    });

    function createCursorGlow() {
        $('.cursor-glow').remove();

        const cursorGlow = $('<div></div>').addClass('cursor-glow');
        cursorGlow.css({
            'position': 'absolute',
            'width': '200px',
            'height': '200px',
            'pointer-events': 'none',
            'border-radius': '50%',
            'background': 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(150,180,255,0.01) 50%, rgba(0,0,0,0) 70%)',
            'z-index': '99999',
            'margin-left': '-100px',
            'margin-top': '-100px'
        });

        $('body').append(cursorGlow);
    }
  
  function redrawParticles() {
    clear();
    particles.forEach((particle) => {
        particle.render();
    });
}

$(document).mousemove(function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Update cursor glow position
    const glow = $('.cursor-glow');
    if (glow.length === 0) {
        createCursorGlow();
    }
    glow.css({
        left: mouseX,
        top: mouseY,
    });

    let hoveredParticle = null;

    // Check hover for all particles
    particles.forEach((particle) => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

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
        const speciesCount = particles.filter(
            (particle) => particle.constructor === hoveredParticle.constructor
        ).length;

        // Tooltip display
tooltip.html(`
<div style="font-weight: 400; font-size: 12px; margin-bottom: 5px; text-align: left;">
    ${hoveredParticle.speciesName || "Unknown Species"}
    </div>
    <div>
        <span style="color: white;">Color:</span> 
        <span style="color: white;">${hoveredParticle.colorDescription || "Varied"}</span>
    </div>
    <div>
        <span style="color: white;">Description:</span> 
        <span style="color: white;">${hoveredParticle.behavior || "Unknown"}</span>
    </div>
    <div>
        <span style="color: white;">Size:</span> 
        <span style="color: white;">${hoveredParticle.radius?.toFixed(1) || "N/A"} units</span>
    </div>
    <div>
        <span style="color: white;">Number:</span> 
        <span style="color: white;">${speciesCount}</span>
    </div>
`);
        tooltip.css({
            left: mouseX + 20 + 'px',
            top: mouseY + 20 + 'px',
            display: 'block',
            opacity: 1,
        });

        clearTimeout(tooltip.hideTimeout);
        tooltip.hideTimeout = setTimeout(() => {
            tooltip.css('opacity', 0);
            setTimeout(() => tooltip.css('display', 'none'), 300);
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
            tooltip.css('opacity', 0);
            setTimeout(() => tooltip.css('display', 'none'), 300);
        }, 300);

        if (isSnapshotMode) {
            redrawParticles();
        }
    }
});


function init() {
    max_particles = 1200;
    particles = [];
    frequency = 20;
    init_num = max_particles;
    max_time = frequency * max_particles;
    time_to_recreate = false;
    createCursorGlow();

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
    setInterval(fetchMarketCap, 1000);

    setTimeout(function() {
        time_to_recreate = true;
    }, max_time);

    update(); // Start the animation loop
}
    init();
});