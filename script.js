const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const btn = document.getElementById("search-btn");
const inpWord = document.getElementById("inp-word");
const defaultCards = document.getElementById("default-cards");

async function getWord() {
    let word = inpWord.value.trim();

    if (word.length === 0) {
        result.innerHTML = `<h3 class="warning">Please enter a word</h3>`;
        result.classList.add("active");
        defaultCards.style.display = "none";
        return;
    }

    try {
        btn.innerHTML = '...';
        
        const response = await fetch(`${url}${word}`);
        
        if (!response.ok) {
            btn.innerHTML = 'Search';
            result.innerHTML = `<h3 class="error">Word not found. Please try another word.</h3>`;
            result.classList.add("active");
            defaultCards.style.display = "none";
            return;
        }

        const data = await response.json();
        const entry = data[0];
        
        btn.innerHTML = 'Search';
        
        let phoneticText = entry.phonetic || (entry.phonetics.find(p => p.text)?.text) || "";
        let audioSrc = entry.phonetics.find(p => p.audio && p.audio !== "")?.audio || "";

        const definitions = entry.meanings[0].definitions[0];
        const partOfSpeech = entry.meanings[0].partOfSpeech;
        const definition = definitions.definition;
        
        const example = definitions.example || "Example not available";

        defaultCards.style.display = "none";
        result.classList.add("active");

        result.innerHTML = `
            <div class="word-header">
                <h3>${word}</h3>
                ${audioSrc ? `<button onclick="playSound()" style="background:none; border:none; color:#0056f1; font-size:1.5rem; cursor:pointer;"><i class="fas fa-volume-up"></i></button>` : ''}
            </div>
            
            <div class="details">
                <p><strong>${partOfSpeech}</strong> • ${phoneticText}</p>
            </div>
            
            <p class="word-meaning">
                ${definition}
            </p>
            
            <p class="word-example">
                "${example}"
            </p>
            
            ${audioSrc ? `<audio id="audio-player" src="${audioSrc}"></audio>` : ''}
        `;

    } catch (error) {
        btn.innerHTML = 'Search';
        result.innerHTML = `<h3 class="error">An error occurred while fetching data.</h3>`;
        result.classList.add("active");
    }
}

function playSound() {
    const audio = document.getElementById("audio-player");
    if (audio) {
        audio.play();
    }
}

btn.addEventListener("click", getWord);

inpWord.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        getWord();
    }
});