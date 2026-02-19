const handleSpinner = (status) => {
    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("spinner").classList.add("flex");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("spinner").classList.remove("flex");
        document.getElementById("word-container").classList.remove("hidden");
    }
};

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(data => displayLessons(data.data));
};


const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach(btn => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
    handleSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive();
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            clickBtn.classList.add("active");
            displayLevelWord(data.data);
        });
};

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (words.length == 0) {

        wordContainer.innerHTML = `
        <div class="text-center col-span-full rounded-xl py-10 space-y-6 font-bangla">
            <img class="mx-auto" src="./assets/alert-error.png" alt="alert error">
            <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
        </div>
        `;
        handleSpinner(false);
        return;
    }

    words.forEach(word => {
        const card = document.createElement("div");
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4 h-full flex flex-col justify-around">
            <div class="">
                <h2 class="text-2xl font-bold">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
                <p class="font-semibold">Meaning / Pronunciation</p>
                <p class="text-2xl font-medium font-bangla">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি "}</p>
            </div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80] "><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume"></i></button>
            </div>
        </div>
        `;

        wordContainer.append(card);
    });

    handleSpinner(false);
};

const loadWordDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data)
};

const loadSynonyms = (synonyms) => {
    const synonymsElement = synonyms.map(synonym => `<span class="btn"> ${synonym} </span>`);
    return synonymsElement.join(" ");
};

const displayWordDetails = (wordDetails) => {
    const wordDetailsContainer = document.getElementById("word-details-container");
    wordDetailsContainer.innerHTML = `
        <div class="">
            <h2 class="text-2xl font-bold">${wordDetails.word} ( <i class="fa-solid fa-microphone-lines"></i> :${wordDetails.pronunciation})</h2>
        </div>
        <div class="">
            <h2 class="font-bold">Meaning</h2>
            <p>${wordDetails.meaning}</p>
        </div>          
        <div class="">
            <h2 class="font-bold">Example</h2>
           <p>${wordDetails.sentence}</p>
        </div>
        <div class="">
            <h2 class="font-bold">Synonyms</h2>
            <div class="">
                ${loadSynonyms(wordDetails.synonyms)}
            </div>
        </div>                          
    `
    document.getElementById("word_modal").showModal();
};

const displayLessons = (lessons) => {
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";
    for (let lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `<button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
        </button>`

        levelContainer.append(btnDiv);
    }
};

loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
    removeActive();
    const input = document.getElementById("input-search");
    const serachValue = input.value.trim().toLowerCase();

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then(data => {
            const allWords = data.data;
            const filterWords = allWords.filter(word => word.word.toLowerCase().includes(serachValue));
            displayLevelWord(filterWords)
        })
});