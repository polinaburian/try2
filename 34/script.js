// Initialize the candle count
var candleCount = 1; // Start with 1 for the initial candle

// Update the initial candle count in the output
updateCandlesOutput();

$(document).ready(function () {
  // Add a click event listener to the document body
  $("body").on("click", function (event) {
    // Check if the click occurred outside the cake
    if (
      !$(event.target).closest(".cake").length &&
      !$(event.target).is("#blowOutButton")
    ) {
      // Display a pop-up alert
      alert("FIRE DANGER! DON'T MISBEHAVE!");
    }
  });

  $(".cake").on("click", function (event) {
    // Check if the click occurred on the icing, flame, or flickering
    if (
      $(event.target).hasClass("icing") ||
      $(event.target).hasClass("flame") ||
      $(event.target).hasClass("flickering")
    ) {
      // Create a new candle element
      const newCandle = document.createElement("div");
      newCandle.classList.add("candle");
      newCandle.innerHTML = '<div class="flame"></div>';

      // Increment the candle count
      candleCount++;

      // Update the output element
      updateCandlesOutput();

      const rect = event.currentTarget.getBoundingClientRect();
      // Set the position of the new candle based on the click event
      newCandle.style.left = event.clientX - rect.left + "px";
      newCandle.style.top = event.clientY - rect.top + "px";

      // Append the new candle to the cake
      this.appendChild(newCandle);

      // Show the newly added candle
      $(newCandle).removeClass("hidden");
    }
  });
});

function updateCandlesOutput() {
  // Update the output element with the current candle count
  const outputElement = document.getElementById("candlesOutput");
  outputElement.textContent = candleCount;

  // Check if there are any visible flames
  const visibleFlames = $(".flame:visible");

  if (visibleFlames.length === 0) {
    // Show the blow out button
    $("#blowOutButton").removeClass("hidden");
  }
}

// Additional code for microphone input and blowing effect
let blowing = false;

function checkLoudness(analyserNode, threshold) {
  const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
  analyserNode.getByteFrequencyData(dataArray);
  const average =
    dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
  return average > threshold;
}

function handleBlowing() {
  if (blowing) {
    // Get the number of candles to extinguish randomly
    const candlesToExtinguish = Math.floor(Math.random() * candleCount) + 1;

    // Extinguish the selected candles
    for (let i = 0; i < candlesToExtinguish; i++) {
      extinguishRandomCandle();
    }

    // Update the output element and check if the button should be visible
    updateCandlesOutput();

    // Reset blowing state after 200 milliseconds
    setTimeout(() => {
      blowing = false;
    }, 200);
  }
}
function blowOutCandles() {
  console.log("Blowing out candles"); // Add this line for debugging

  // Hide all visible candles
  $(".candle:not(.hidden)").hide();

  // Update the candle count to 0
  candleCount = 0;

  // Update the output element and hide the blow out button
  updateCandlesOutput();
  $("#blowOutButton").addClass("hidden");

  // Log the state of the button after hiding
  console.log(
    "Button visibility after hiding:",
    $("#blowOutButton").css("display")
  );
  window.open("https://youtu.be/zJdHAe8jYlg?si=VNLQocdxveka7qi-", "_blank");
}

function extinguishRandomCandle() {
  // Get all visible candles
  const visibleCandles = $(".candle:not(.hidden)");

  if (visibleCandles.length > 0) {
    // Randomly select a visible candle
    const randomIndex = Math.floor(Math.random() * visibleCandles.length);
    const randomCandle = visibleCandles.eq(randomIndex);

    // Hide the flame of the selected candle
    randomCandle.find(".flame").hide();
  }
}
// Request microphone permission and set up audio context
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const microphone = audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 256;
    microphone.connect(analyserNode);

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const loudnessThreshold = 200; // Adjust this threshold as needed
    let isBlowing = false;

    // Check loudness and handle blowing every 100 milliseconds
    setInterval(() => {
      const loudnessThreshold = 80; // Adjust this threshold as needed
      const isBlowing = checkLoudness(analyserNode, loudnessThreshold);

      if (isBlowing) {
        // Handle blowing when loudness threshold is exceeded
        blowing = true; // Set blowing state to true
        handleBlowing(); // Call the handleBlowing function
      }
    }, 100);
  })
  .catch((error) => {
    console.error("Error accessing microphone:", error);
  });
