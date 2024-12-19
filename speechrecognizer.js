if ("webkitSpeechRecognition" in window) {
  let speechRecognition = new webkitSpeechRecognition();
  let final_transcript = "";

  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = document.querySelector("#select_dialect").value;

  speechRecognition.onstart = () => {
    document.querySelector("#status").style.display = "block";
  };
  speechRecognition.onerror = () => {
    document.querySelector("#status").style.display = "none";
    console.log("Speech Recognition Error");
  };
  speechRecognition.onend = () => {
    document.querySelector("#status").style.display = "none";
    console.log("Speech Recognition Ended");
  };

  speechRecognition.onresult = (event) => {
    let interim_transcript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    document.querySelector("#final").innerHTML = final_transcript;
    document.querySelector("#interim").innerHTML = interim_transcript;
  };

  document.querySelector("#start").onclick = () => {
    speechRecognition.start();
  };
  document.querySelector("#stop").onclick = () => {
    speechRecognition.stop();
  };
} else {
  console.log("Speech Recognition Not Available");
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const saveBtn = document.querySelector("#save");
const clearBtn = document.querySelector("#clear");
const copyBtn = document.querySelector("#copy");
const statusP = document.querySelector("#status");
const finalDiv = document.querySelector("#final");
const interimDiv = document.querySelector("#interim");
const wordCountSpan = document.querySelector("#wordCount");
const totalWordsSpan = document.querySelector("#totalWords");
const speakingRateSpan = document.querySelector("#speakingRate");
const accuracySpan = document.querySelector("#accuracy");
const confidenceBar = document.querySelector(".confidence-bar");
const recordingTime = document.querySelector("#recordingTime");
const autoPunctuation = document.querySelector("#autoPunctuation");
const showCommandsBtn = document.querySelector("#showCommands");
const commandsList = document.querySelector("#commandsList");
const themesPanel = document.querySelector("#themesPanel");
const translateBtn = document.querySelector("#translate"); // Button to trigger translation
const translatedDiv = document.querySelector("#translated"); // Div to display translated text

let finalTranscript = '';
let isRecording = false;
let startTime = null;
let timerInterval = null;
let wordCount = 0;
let totalConfidence = 0;
let recognitionCount = 0;

recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 1;

const commands = {
  'start recording': () => startBtn.click(),
  'stop recording': () => stopBtn.click(),
  'clear transcript': () => clearBtn.click(),
  'save transcript': () => saveBtn.click(),
  'copy text': () => copyBtn.click(),
  'new line': () => finalTranscript += '\n',
  'new paragraph': () => finalTranscript += '\n\n'
};

startBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);
clearBtn.addEventListener("click", clearTranscript);
copyBtn.addEventListener("click", copyTranscript);
saveBtn.addEventListener("click", saveTranscript);
showCommandsBtn.addEventListener("click", toggleCommands);
autoPunctuation.addEventListener("change", updatePunctuation);
translateBtn.addEventListener("click", translateTranscript);

document.querySelectorAll('.theme-option').forEach(option => {
  option.addEventListener('click', () => {
      const theme = option.dataset.theme;
      document.documentElement.setAttribute('data-theme', theme);
      document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      showToast(`Theme changed to ${theme}`);
  });
});

function startRecording() {
  if (!isRecording) {
      recognition.start();
      isRecording = true;
      statusP.style.display = "inline";
      document.querySelector(".status-indicator").classList.add("status-active");
      startBtn.classList.replace("btn-success", "btn-secondary");
      startTime = Date.now();
      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);
      showToast("Recording started");
  }
}

function stopRecording() {
  if (isRecording) {
      recognition.stop();
      isRecording = false;
      statusP.style.display = "none";
      document.querySelector(".status-indicator").classList.remove("status-active");
      startBtn.classList.replace("btn-secondary", "btn-success");
      clearInterval(timerInterval);
      showToast("Recording stopped");
  }
}

function clearTranscript() {
  finalTranscript = '';
  finalDiv.innerHTML = '';
  interimDiv.innerHTML = '';
  wordCount = 0;
  updateStatistics();
  showToast("Transcript cleared");
}

function copyTranscript() {
  navigator.clipboard.writeText(finalTranscript).then(() => {
      showToast("Text copied to clipboard");
  });
}

function saveTranscript() {
  const blob = new Blob([finalTranscript], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transcript_${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Transcript saved");
}

function translateTranscript() {
  const targetLanguage = document.querySelector("#select_translation_language").value; // Language dropdown
  translateText(finalTranscript, targetLanguage).then(translatedText => {
      translatedDiv.innerHTML = translatedText;
      showToast("Translation completed");
  }).catch(error => {
      console.error("Translation failed", error);
      showToast("Translation failed");
  });
}

async function translateText(text, targetLanguage) {
  const apiKey = 'YOUR_TRANSLATION_API_KEY'; // Replace with your API key
  const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          q: text,
          target: targetLanguage
      })
  });

  if (!response.ok) {
      throw new Error("Translation API error");
  }

  const data = await response.json();
  return data.data.translations[0].translatedText;
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');
  recordingTime.textContent = `${minutes}:${seconds}`;
}


// Function to start tracking statistics
function startStatistics() {
    startTime = Date.now();
    finalTranscript = '';
    totalWords = 0;
    totalConfidence = 0;
    recognitionCount = 0;
    updateStatistics();
}

// Function to update the statistics
function updateStatistics() {
    // Calculate total words
    totalWords = finalTranscript.trim() === '' ? 0 : finalTranscript.trim().split(/\s+/).length;
    totalWordsSpan.textContent = totalWords;

    // Calculate speaking rate (WPM)
    if (startTime) {
        const elapsedMinutes = (Date.now() - startTime) / 60000; // Convert milliseconds to minutes
        speakingRate = elapsedMinutes > 0 ? Math.round(totalWords / elapsedMinutes) : 0;
        speakingRateSpan.textContent = speakingRate;
    }

    // Calculate accuracy (average confidence)
    const accuracy = recognitionCount > 0 ? Math.round((totalConfidence / recognitionCount) * 100) : 0;
    accuracySpan.textContent = accuracy;
}

// Speech recognition setup
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
        startStatistics(); // Initialize statistics on recording start
        document.querySelector("#status").style.display = "inline";
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const confidence = event.results[i][0].confidence; // Confidence score for the result
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
                totalConfidence += confidence;
                recognitionCount++;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        document.querySelector("#final").innerHTML = finalTranscript;
        document.querySelector("#interim").innerHTML = interimTranscript;

        updateStatistics(); // Update statistics in real time
    };

    recognition.onend = () => {
        document.querySelector("#status").style.display = "none";
        console.log("Speech recognition stopped.");
    };

    // Start recognition
    document.querySelector("#start").addEventListener("click", () => {
        recognition.start();
    });

    // Stop recognition
    document.querySelector("#stop").addEventListener("click", () => {
        recognition.stop();
    });

    // Clear the transcript and reset statistics
    document.querySelector("#clear").addEventListener("click", () => {
        finalTranscript = '';
        totalWords = 0;
        speakingRate = 0;
        totalConfidence = 0;
        recognitionCount = 0;
        document.querySelector("#final").innerHTML = '';
        document.querySelector("#interim").innerHTML = '';
        updateStatistics();
    });
} else {
    console.error("Speech recognition is not supported in this browser.");
}
