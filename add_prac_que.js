var qq = {
    username: "",
    exam: "neet",
    que_array: [],
    fil_array: [],
    cat_array: [],
    today_que: [],
    search_level: "",
    search_cat: "",
    que_no: "",
    que_id: "",
    native_language: "urdu",
    is_today: false,
    setting: {
        hide_que_categories: false,
        theme: "light",
        chatgpt_id: "d3e80b6f-e8c1-4e7b-9cfb-e00982a66365",
    },
};
var is_edit_category = true;
var old_cat = "";
var first_time = true;
var google_search_tab, chatgpt_search_tab;
var normal_que_text, mcq_que_text;
loadAddPracticeQuestionsUI();

function loadAddPracticeQuestionsUI() {
    console.log(arguments.callee.name + " called");

    const interval_apq = setInterval(() => {
        if (document.querySelector(".add-sec button")) {
            clearInterval(interval_apq); // This stops the interval
            getAddPracQueData();

            document.querySelector(".today-que").addEventListener("click", function () {
                qq.search_level = "";
                qq.search_cat = "";
                qq.fil_array = qq.today_que;
                is_today = true;
                showQuestion();
            });
            document.querySelector(".center").classList.remove("hide");
            textareaAutoHeightSetting();
            document.querySelector(".refresh-icon").addEventListener("click", refresh);

            document.querySelector("div#add button#close").addEventListener("click", function () {
                openPracticeSection();
            });
            /*
            document.querySelector(" button.add").addEventListener("click", function () {
                qq.fil_array = qq.today_que;
            });
            */
            document.querySelector("button.add").addEventListener("click", function () {
                openAddQuestionSection();
                if (first_time) {
                    textareaAutoHeightSetting();
                    first_time = false;
                }
            });

            actionOnQuestionLevel();

            document.querySelector(".add button.add-category").addEventListener("click", function () {
                addCategory("", "add");
            });
            document.querySelector(".answer-section button.add-category").addEventListener("click", function () {
                addCategory("", "answer");
            });
            document.querySelector(".answer-section button.update-category").addEventListener("click", function () {
                addCategory("", "answer", "edit");
            });
            document.querySelectorAll(".search-level .level").forEach((level) => {
                level.addEventListener("click", function (event) {
                    document.querySelectorAll(".search-level .level").forEach((div) => {
                        if (div != level) div.classList.remove("active");
                    });

                    level.classList.toggle("active");
                    if (level.className.indexOf("active") > 0) {
                        qq.search_level = level.textContent;
                    } else {
                        qq.search_level = "";
                    }
                    filter();
                    console.log(`qq.search_level: ${qq.search_level}`);
                });
            });

            document.querySelector(".google").addEventListener("click", function (event) {
                searchQuestionOnline("google", event);
            });
            document.querySelector(".chatgpt").addEventListener("click", function (event) {
                searchQuestionOnline("chatgpt", event);
            });

            document.querySelector(".search-container .question-level").addEventListener("change", function () {
                var select = document.querySelector(".question-level");
                var selectedValue = select.options[select.selectedIndex].value;
                qq.search_level = selectedValue;
                // You can use the selectedValue in your code for further actions
                console.log(`search level = "${qq.search_level}"`);
                if (qq.search_level == "all") {
                    qq.search_level = "";
                    select.style.removeProperty("color");
                } else {
                    select.style.color = `var(--${qq.search_level})`;
                }
                filter();
            });

            document.querySelectorAll(".answer-section .level").forEach((level) => {
                level.addEventListener("click", function (event) {
                    document.querySelectorAll(".answer-section .level").forEach((div) => {
                        if (div != level) div.classList.remove("active");
                    });
                    level.classList.add("active");
                    if (level.className.indexOf("active") > 0) {
                        qq.fil_array[qq.que_no].level = level.textContent;
                        console.log(`curr_que_level: ${qq.fil_array[qq.que_no].level}`);
                        saveAddPracQueData();
                    }
                });
            });

            document.querySelector(".clear-icon-cat").addEventListener("click", removeSearchCat);
            document.querySelector("button#answer").addEventListener("click", checkAnswer);

            document.querySelector("button#delete").addEventListener("click", function () {
                scrollToTop();
                document.querySelector(".delete-confirmation.overlay").classList.remove("hide");
            });

            // Add event listeners to the Yes and No buttons to handle confirmation
            document.getElementById("yes").addEventListener("click", function () {
                deleteQuestion(qq.fil_array[qq.que_no].id);
                // For example, you can delete the question or perform any other action
                document.querySelector(".delete-confirmation.overlay").classList.add("hide");
            });

            document.getElementById("no").addEventListener("click", function () {
                // Close the overlay without performing the delete action
                document.querySelector(".delete-confirmation.overlay").classList.add("hide");
            });

            document.querySelector("button#next").addEventListener("click", nextQuestion);
            document.querySelector("button#prev").addEventListener("click", prevQuestion);
            document.querySelector("button#refresh").addEventListener("click", refresh);
            document.querySelector("button#random").addEventListener("click", getRandomQuestion);

            addQuestionSectionTriggerEventListners();

            document.querySelector("button#add").addEventListener("click", addQuestion);

            /*
            const interval_add_button = setInterval(function () {
                var que = document.querySelector(".add textarea.question").value;
                var exp = document.querySelector(".add textarea.explanation").value;
                var cat = document.querySelector(".add .categories").innerHTML;
                var option = document.querySelector(".add-question-section select").value;
            
                if (que !== "" && exp !== "" && cat != "") {
                    var que_type = document.querySelector(".question-type-tab.active").className.toLowerCase();

                    if (que_type.indexOf("mcq") != -1 && option != "") {
                        document.querySelector("button#add").classList.remove("hide");
                    } else if (que_type.indexOf("mcq") != -1 && option == "") {
                        document.querySelector("button#add").classList.add("hide");
                    } else {
                        document.querySelector("button#add").classList.remove("hide");
                    }
                } else {
                    document.querySelector("button#add").classList.add("hide");
                }
            }, 1000);
            */

            document.querySelector("button#clear").addEventListener("click", clearInputFields);

            setSpanTextarea();

            if (qq.que_array.length == 0) {
                var message = 'No questions data found. Open "add question" section by clicking the "add" button.';
                noQuestion(message);
                return;
            } else {
                refresh();
            }
        }
    }, 1000);
}

function addQuestionSectionTriggerEventListners() {
    console.log(arguments.callee.name + " called");

    document.querySelectorAll(".question-type-tab").forEach((tab) => {
        //debugger_;;

        tab.addEventListener("click", function (event) {
            //debugger_;;
            textareaAutoHeightSetting();
            if (!event.target.classList.contains("active")) {
                document.querySelectorAll(".question-type-tab").forEach((tab) => {
                    tab.classList.toggle("active");
                });
            }
            if (event.target.classList.contains("mcq")) {
                show(".mcq-answer-option");
                show(".set-default-mcq-template");
                document.querySelector(".add-question-section select").value = "";
                setMCQQuestionTemplate();
            } else {
                hide(".mcq-answer-option");
                hide(".set-default-mcq-template");
                setMCQQuestionTemplate("normal");
            }
        });
    });

    document.querySelector(".set-default-mcq-template").addEventListener("click", setMCQQuestionTemplate);
}

function setMCQQuestionTemplate(type) {
    console.log(arguments.callee.name + " called");
    //debugger_;;
    var question_textarea = document.querySelector(".add-question-section textarea.question");
    if (qq.exam.toLowerCase() == "upsc") {
        question_textarea.value = upsc_mcq_template;
    } else {
        question_textarea.value = other_mcq_template;
    }
    if (type == "normal") {
        question_textarea.value = "";
    }
    textareaAutoHeightSetting();
}

function actionOnQuestionLevel() {
    console.log(arguments.callee.name + " called");
    document.querySelectorAll(".question-section .level").forEach((level) => {
        //level.classList.remove("active");
        level.addEventListener("click", function () {
            qq.fil_array[qq.que_no].level = level.textContent;
            if (level.textContent == "hard") {
                qq.fil_array[qq.que_no].revision_date = revisionDate(1);
            } else if (level.textContent == "medium") {
                qq.fil_array[qq.que_no].revision_date = revisionDate(5);
            }
            if (level.textContent == "easy") {
                qq.fil_array[qq.que_no].revision_date = revisionDate(10);
            }
            checkAnswer();
            saveAddPracQueData();
        });
    });
}

function setSpanTextarea() {
    console.log(arguments.callee.name + " called");

    // question
    var question_textarea = document.querySelector(".answer-section textarea.question");
    var question_span = document.querySelector(".answer-section span.question");

    question_textarea.addEventListener("blur", function () {
        if (question_textarea.value.trim() != "") {
            toggleSpanTextarea(".answer-section .question");
        }
    });
    question_span.addEventListener("click", function () {
        toggleSpanTextarea(".answer-section .question");
        question_textarea.focus();
        textareaAutoHeightSetting();
    });
    question_textarea.addEventListener("input", function () {
        qq.fil_array[qq.que_no].question = question_textarea.value;
        //debugger_;;
        question_span.innerHTML = replaceTextWithMarkup(question_textarea.value);
        saveAddPracQueData();
    });

    //  explanation
    var explanation_textarea = document.querySelector(".answer-section textarea.explanation");
    var explanation_span = document.querySelector(".answer-section span.explanation");

    if (explanation_textarea.value.trim() == "") {
        toggleSpanTextarea(".answer-section .explanation");
    }
    explanation_textarea.addEventListener("input", function () {
        qq.fil_array[qq.que_no].explanation = explanation_textarea.value;
        explanation_span.innerHTML = replaceTextWithMarkup(explanation_textarea.value);
        saveAddPracQueData();
    });
    explanation_textarea.addEventListener("blur", function () {
        if (explanation_textarea.value.trim() != "") {
            toggleSpanTextarea(".answer-section .explanation");
        }
    });
    explanation_span.addEventListener("click", function () {
        toggleSpanTextarea(".answer-section .explanation");
        explanation_textarea.focus();
        textareaAutoHeightSetting();
    });

    /* // Add section
    question_textarea = document.querySelector(".add-question-section textarea.question");
    question_span = document.querySelector(".add-question-section span.question");
    question_textarea.addEventListener("input", function () {
        question_span.innerHTML = replaceTextWithMarkup(question_textarea.value);
    });
    question_textarea.addEventListener("blur", function () {
        if (question_textarea.value.trim() != "") {
            toggleSpanTextarea(".add-question-section .question");
        }
    });
    question_span.addEventListener("click", function () {
        toggleSpanTextarea(".add-question-section .question");
        question_textarea.focus();
        textareaAutoHeightSetting();
    });

    //  explanation
    explanation_textarea = document.querySelector(".add-question-section textarea.explanation");
    explanation_span = document.querySelector(".add-question-section span.explanation");

    explanation_textarea.addEventListener("input", function () {
        explanation_span.innerHTML = replaceTextWithMarkup(explanation_textarea.value);
    });

    explanation_textarea.addEventListener("blur", function () {
        if (explanation_textarea.value.trim() == "") return;
        toggleSpanTextarea(".add-question-section .explanation");
    });

    explanation_span.addEventListener("click", function () {
        toggleSpanTextarea(".add-question-section .explanation");
        explanation_textarea.focus();
        textareaAutoHeightSetting();
    });

    /* Add question
    question = document.querySelector(".add textarea.question");
    question.addEventListener("input", function () {
        document.querySelector(".add span.question").innerHTML = replaceTextWithMarkup(question.value);
    });
    question.addEventListener("blur", function () {
        var span = document.querySelector(".add span.question");
        if (span.textContent.trim() != "") {
            toggleSpanTextarea(".add .question");
        }
    });
    document.querySelector(".add span.question").addEventListener("click", function () {
        toggleSpanTextarea(".add .question");
        question.focus();
        textareaAutoHeightSetting();
        //question.value = question.value + " ";
    });

    // Add Explanation
    explanation = document.querySelector(".add textarea.explanation");
    explanation.addEventListener("input", function () {
        document.querySelector(".add span.explanation").innerHTML = replaceTextWithMarkup(explanation.value);
    });
    explanation.addEventListener("blur", function () {
        //debugger_;;
        var span = document.querySelector(".add span.explanation");
        if (span.textContent.trim() != "") {
            toggleSpanTextarea(".add .explanation");
        }
    });
    document.querySelector(".add span.explanation").addEventListener("click", function () {
        toggleSpanTextarea(".add .explanation");
        explanation.focus();
        textareaAutoHeightSetting();
        //explanation.value = explanation.value + " ";
    });
    */
}

function simulateSpaceKeyPress(textarea) {
    console.log(arguments.callee.name + " called");
    // Create a new key event
    const spaceKeyEvent = new KeyboardEvent("keydown", {
        key: " ",
        keyCode: 32,
        which: 32,
    });

    // Dispatch the event on the textarea
    textarea.dispatchEvent(spaceKeyEvent);
}

function toggleSpanTextarea(class_name) {
    console.log(arguments.callee.name + " called");
    var span, textarea;
    var words = class_name.split(" ");
    if (words.length >= 2) {
        var last_word = words.pop();
        span = words.join(" ") + ` span${last_word}`;
        textarea = words.join(" ") + ` textarea${last_word}`;
    } else {
        span = `span${class_name}`;
        textarea = `textarea${class_name}`;
    }
    //debugger_;;
    document.querySelector(span).classList.toggle("hide");
    document.querySelector(textarea).classList.toggle("hide");
    console.log(`toggled ${span} and ${textarea} `);
}

function filter(category) {
    console.log(arguments.callee.name + " called");
    if (category != undefined) {
        qq.search_cat = category;
    }

    //qq.que_array = sortArrayInRandomOrder(qq.que_array);
    var temp = filterQuestion(qq.que_array, qq.search_level, qq.search_cat);
    if (temp == "random") {
        return;
    }
    qq.fil_array = temp;
    if (qq.fil_array.length) {
        qq.fil_array = sortArrayInRandomOrder(qq.fil_array);
        qq.que_no = 0;
        showQuestion();
    } else {
        if (qq.search_level != "" && qq.search_cat == "") {
            noQuestion(`No question found for level '${qq.search_level}'`);
        } else if (qq.search_level != "" && qq.search_cat != "") {
            noQuestion(`No question found for level '${qq.search_level}' AND category '${qq.search_cat}'`);
        }
    }
}

function searchQuestionOnline(link, event) {
    console.log(arguments.callee.name + " called");
    //debugger_;;
    var question_text = qq.fil_array[qq.que_no].question;
    if (qq.search_cat == "vocab") {
        question_text = `${question_text} define? and also give its meaning in ${qq.native_language}`;
    }
    copyToClipboard(question_text);
    var a = document.createElement("a");

    if (link == "google") {
        a.href = "https://www.bing.com/search?q=" + question_text;
        a.target = "revise_google_search";
        openLinkInExistingTab(a.href, "google");
    } else if (link == "chatgpt") {
        a.href = `https://chat.openai.com/c/${qq.setting.chatgpt_id}`;
        a.target = "revise_chatGPT_search";
        openLinkInExistingTab(a.href, "chatgpt");
    }
}

function openLinkInExistingTab(link, type) {
    console.log(arguments.callee.name + " called");
    if (type === "chatgpt") {
        if (chatgpt_search_tab && !chatgpt_search_tab.closed) {
            chatgpt_search_tab.focus();
        } else {
            chatgpt_search_tab = window.open(link);
            chatgpt_search_tab.addEventListener("load", () => {
                // Once the tab is loaded, set the clipboard value and click the button
                const clipboardValue = "Your clipboard value here"; // Replace with your actual clipboard value
                chatgpt_search_tab.postMessage({ clipboardValue }, "*");
            });
        }
    } else if (type === "google") {
        if (google_search_tab && !google_search_tab.closed) {
            google_search_tab.focus();
        } else {
            google_search_tab = window.open(link);
            google_search_tab.addEventListener("load", () => {
                // Once the tab is loaded, set the clipboard value and click the button
                const clipboardValue = "Your clipboard value here"; // Replace with your actual clipboard value
                google_search_tab.postMessage({ clipboardValue }, "*");
            });
        }
    }
}

// In the chatgpt_search_tab (newly opened tab)
window.addEventListener("message", function (event) {
    console.log(arguments.callee.name + " called");
    //debugger_;;
    if (event.data && event.data.clipboardValue) {
        // Set the clipboard value to the textarea
        const textarea = document.querySelector("#prompt-textarea");
        textarea.value = event.data.clipboardValue;

        // Click the button
        const button = document.querySelector(".flex.w-full.items-center button");
        button.click();
    }
});

function copyToClipboard(text) {
    console.log(arguments.callee.name + " called");
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

function replaceTextWithMarkup(text) {
    console.log(arguments.callee.name + " called");

    text = text.replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>');
    text = text.replace(/\^\^(.*?)\^\^/g, '<span class="highlight">$1</span>');
    text = convertHeadings(text);
    text = text.replace(/\n/g, "<br>");
    return text;
}
function convertHeadings(inputText) {
    console.log(arguments.callee.name + " called");
    // Define a regular expression to match headings
    const regex = /^(#{1,3})\s+([^\n]*)\n/gm;

    // Replace the matching patterns with the desired HTML
    const outputText = inputText.replace(regex, (match, headingLevel, text) => {
        const level = headingLevel.length;
        return `<span class="heading${level} heading">${text}</span>\n`;
    });

    return outputText;
}

function toggleElements() {
    console.log(arguments.callee.name + " called");

    if ("answer-explanation") {
        document.querySelector(".answer-section span.explanation").classList.toggle("hide");
        document.querySelector(".answer-section textarea.explanation").classList.toggle("hide");
    }
    if ("answer-question") {
        document.querySelector(".answer-section span.explanation").classList.toggle("hide");
        document.querySelector(".answer-section textarea.explanation").classList.toggle("hide");
    }
}

function loadTodayQuestion() {
    console.log(arguments.callee.name + " called");
    qq.today_que = [];
    qq.today_que = getTodayQuestions(qq.que_array);
    var today_que_ele = document.querySelector(".today-que");
    if (qq.today_que.length != 0) {
        today_que_ele.classList.remove("hide");
        today_que_ele.textContent = `Today revision questions: ${qq.today_que.length}`;
        today_que_ele.addEventListener("click", function () {
            qq.fil_array = qq.today_que;
            qq.que_no = 0;
            showQuestion();
            today_que_ele.classList.add("hide");
        });
    } else {
        today_que_ele.classList.add("hide");

        refresh();
    }
}

document.getElementById("backup").addEventListener("click", function () {
    backupData(qq);
});

function refresh() {
    console.log(arguments.callee.name + " called");
    getAddPracQueData();
    updateCategories();
    qq.search_level = "";
    document.querySelector(`.search-container input`).classList.remove("hide");
    document.querySelector(`.search-container .category`).classList.add("hide");

    qq.search_cat = "";
    document.querySelector(`.search-container select`).value = "all";
    document.querySelector(`.search-container select`).style.removeProperty("color");

    //loadTodayQuestion();

    filter();
}
function updateCategories(loc) {
    console.log(arguments.callee.name + " called");
    qq.cat_array = loadCategories(qq.que_array);
    setAutoCompeleteForAllInputs(qq.cat_array);
    setAllCategories(qq.cat_array, qq.que_array);
}

function handleSelectChange() {
    console.log(arguments.callee.name + " called");
    var select = document.getElementById("difficultySelect");
    var selectedValue = select.options[select.selectedIndex].value;
    qq.search_level = selectedValue;
    // You can use the selectedValue in your code for further actions
    console.log(`search level = "${qq.search_level}"`);
    if (qq.search_level == "all") {
        qq.search_level = "";
    }
    filter();
}

function noQuestion(message) {
    console.log(arguments.callee.name + " called");
    if (message) {
        document.querySelector(".center .no-que").textContent = message;
    } else {
        document.querySelector(".center .no-que").textContent = "No questions";
    }
    document.querySelector(".center .no-que").classList.remove("hide");

    document.querySelector(".que-num ").classList.add("hide");
    document.querySelector(".center .question").classList.add("hide");
    document.querySelector(".center .answer-section").classList.add("hide");
    document.querySelector(".bottom.button-section").classList.add("hide");
}
function openPracticeSection() {
    console.log(arguments.callee.name + " called");
    console.log("practice section opened");
    document.querySelector(".add_prac_que > #practice").classList.remove("hide");

    document.querySelector(".add_prac_que > #add").classList.add("hide");
    refresh();
}
function openAddQuestionSection() {
    console.log(arguments.callee.name + " called");
    console.log("add question section opened");
    document.querySelector(".add_prac_que > #practice").classList.add("hide");

    document.querySelector(".add_prac_que > #add").classList.remove("hide");
    setAutoCompeleteForAllInputs(qq.cat_array);
}

function showQuestion() {
    //debugger_;;
    console.log(arguments.callee.name + " called");
    console.log("showQuestion is called");
    document.querySelector(".center .question").classList.remove("hide");
    document.querySelector("button#answer").classList.add("hide");
    document.querySelectorAll(".question-section .level").forEach((level) => {
        level.classList.remove("active");
    });

    document.querySelector(".bottom.button-section").classList.remove("hide");

    document.querySelector(".center .answer-section").classList.add("hide");
    document.querySelector(".center .no-que").classList.add("hide");

    hide("button#delete");
    hide("button#answer");

    document.querySelector(".que-num").textContent = qq.que_no + 1 + "/" + qq.fil_array.length;

    document.querySelector(".question-section span.question").innerHTML = replaceTextWithMarkup(qq.fil_array[qq.que_no].question);
    //debugger_;;
    var is_mcq = false;
    if (is_mcq) {
        addAnswerOptionCheckButtons();
    } else {
    }

    loadQuestionCategories(qq.fil_array[qq.que_no].categories);

    document.querySelector(".answer-section textarea.question").value = qq.fil_array[qq.que_no].question;
    document.querySelector(".answer-section textarea.question").classList.add("hide");

    document.querySelector(".answer-section span.question").innerHTML = replaceTextWithMarkup(qq.fil_array[qq.que_no].question);
    document.querySelector(".answer-section span.question").classList.remove("hide");

    document.querySelector(".answer-section textarea.explanation").value = qq.fil_array[qq.que_no].explanation;
    document.querySelector(".answer-section textarea.explanation").classList.add("hide");

    document.querySelector(".answer-section span.explanation").innerHTML = replaceTextWithMarkup(qq.fil_array[qq.que_no].explanation);
    document.querySelector(".answer-section span.explanation").classList.remove("hide");

    showCategoriesInAnswer();
}

function isMcq(array, index) {
    if (array[index].type == "mcq") {
        return true;
    } else {
        return false;
    }
}

function addAnswerOptionCheckButtons() {
    //debugger_;;
    var answer_option_div = document.querySelector(".mcq-check-options");
    answer_option_div.classList.remove("hide");
    answer_option_div.innerHTML = `\n<span>Select the correct option:</span><div class="ans-opt-list">
                        <input type="radio" value="a" class="a" name="option"><span> (a) </span>
                        <input type="radio" value="b" class="b" name="option"><span> (b) </span>
                        <input type="radio" value="c" class="c" name="option"><span> (c) </span>
                        <input type="radio" value="d" class="d" name="option"><span> (d) </span>
                        </div>
                        `;
    var inputs = answer_option_div.querySelectorAll("input").forEach((input) => {
        input.addEventListener("click", function (event) {
            checkMcqAnswerOption(event);
        });
    });
}

function checkMcqAnswerOption(event) {
    var selected_option = event.target.value;
    var correct_option = qq.fil_array[qq.que_no].correct_option;
}

var old_clipboard_text = "";
function checkClipboardAndExtract() {
    //console.log(arguments.callee.name + " called");
    navigator.clipboard
        .readText()
        .then(function (clipboardText) {
            if (clipboardText.trim() !== "") {
                old_clipboard_text = clipboardText.trim();
                var index = getAIResponseIndex(old_clipboard_text);
                if (index != null) {
                    var text = old_clipboard_text.substring(0, index);
                    text = text.replace(/\*\*/g, "");

                    // Remove reference numbers (e.g., ¹ ² ³)
                    text = text.replace(/¹|²|³/g, "");
                    navigator.clipboard
                        .writeText(text)
                        .then(function () {
                            console.log("Text set to clipboard successfully.");
                        })
                        .catch(function (error) {
                            console.error("Error setting text to clipboard:", error);
                        });
                    //console.log("Extracted text:", old_clipboard_text.substring(0, index));
                }
                return;
            }
        })
        .catch(function (error) {
            //console.error("Error reading clipboard:", error);
        });
}

function getAIResponseIndex(clipboardText) {
    console.log(arguments.callee.name + " called");
    var a = clipboardText.indexOf("I hope that helps");
    var b = clipboardText.indexOf("Source: Conversation with Bing");
    if (a !== -1 && b !== -1) {
        return a;
    }

    if (b !== -1) {
        return b;
    }
    return null;
}
//var intervalIdd = setInterval(checkClipboardAndExtract, 1000);

// Call checkClipboardAndExtract every 1000 ms (1 second)
//const intervalId = setInterval(checkClipboardAndExtract, 1000);

function extractText(inputText) {
    console.log(arguments.callee.name + " called");
    // Check if the text contains 'Source: Conversation with Bing'
    const sourceIndex = inputText.indexOf("Source: Conversation with Bing");

    if (sourceIndex !== -1) {
        // Get the text from the beginning to the 'Source' part
        let extractedText = inputText.substring(0, sourceIndex);

        // Remove small numbers and asterisks
        extractedText = extractedText.replace(/[\*\d]/g, "");

        // Trim any leading or trailing whitespace
        extractedText = extractedText.trim();

        return extractedText;
    }

    return inputText; // If 'Source' is not found, return the original text
}

function showCategoriesInAnswer() {
    console.log(arguments.callee.name + " called");
    var category_section = document.querySelector(".answer-section .category-section .categories");
    var categories = qq.fil_array[qq.que_no].categories;
    category_section.innerHTML = "";
    qq.fil_array[qq.que_no].categories = removeDuplicates(categories);

    categories.forEach((category, index) => {
        var datePattern = /\d{2}-\d{2}-\d{4}/;
        if (!datePattern.test(category)) {
            var div = document.createElement("div");
            div.className = "category";
            div.innerHTML = `<span class="category-name">${category}</span> <i class="fas fa-pencil-alt"></i>  <div class="clear-icon-cat" id="clear-icon"> x </div>`;
            var edit_icon = document.createElement("div");

            category_section.append(div);
            div.children[1].addEventListener("click", function () {
                //debugger_;;
                document.querySelector(".category-section textarea.add-category").value = category;
                document.querySelector(".category-section button.add-category").classList.add("hide");
                document.querySelector(".category-section button.update-category").classList.remove("hide");
                is_edit_category = true;
                old_cat = category;
            });
            div.children[2].addEventListener("click", function (event) {
                //debugger_;;
                var category_name = event.target.parentNode.children[0].textContent;
                qq.fil_array[qq.que_no].categories = qq.fil_array[qq.que_no].categories.filter((category) => category !== category_name);
                div.remove();
                updateCategories("answer");
                saveAddPracQueData();
            });
        }
    });
}

function addCategory(name, loc, type) {
    console.log(arguments.callee.name + " called");
    var input = document.querySelector(`.${loc} textarea.add-category`);
    if (name == "") {
        name = input.value.toLowerCase().trim();
        input.value = "";
    }
    input.focus();

    name = name.trim();
    var cat_div = document.querySelector(`.${loc} .category-section .categories`);
    var is_duplicate = false;
    document.querySelectorAll(`.${loc} .category-section .categories .category`).forEach((cat) => {
        if (cat.children[0].textContent == name) is_duplicate = true;
    });
    if (is_duplicate) return;
    if (loc == "add" && name == "") return;

    var div = document.createElement("div");
    div.className = "category";

    if (loc == "add") {
        div.innerHTML = `<span class="category-name">${name}</span> <div class="clear-icon-cat" id="clear-icon"> x </div>`;
        cat_div.append(div);
        div.children[1].addEventListener("click", function () {
            div.remove();
        });
        updateCategories("add");
    } else if (loc == "answer") {
        if (is_edit_category && old_cat != "" && type == "edit") {
            document.querySelector(".category-section button.add-category").classList.remove("hide");
            document.querySelector(".category-section button.update-category").classList.add("hide");
            editCategory(name, old_cat);

            return;
        }
        qq.fil_array[qq.que_no].categories.push(name);
        div.innerHTML = `<span class="category-name">${name}</span> <i class="fas fa-pencil-alt hide"></i>  <div class="clear-icon-cat" id="clear-icon"> x </div>`;
        cat_div.append(div);
        is_edit_category = false;
        saveAddPracQueData();

        div.children[0].addEventListener("click", function () {
            document.querySelector(".answer-section .category-section textarea.add-category").value = category;
            document.querySelector(".answer-section .category-section .add-category").classList.add("hide");
            document.querySelector(".answer-section .category-section .update-category").classList.remove("hide");

            is_edit_category = true;
            old_cat = name;
        });

        div.children[2].addEventListener("click", function () {
            div.remove();
            qq.fil_array[qq.que_no].categories.forEach((category, index) => {
                if (name === category) {
                    qq.fil_array[qq.que_no].categories.splice(index, 1);
                }
            });
            saveAddPracQueData();
        });

        updateCategories("answer");
        updateCategories("");
    }
}

function editCategory(new_cat, old_cat) {
    console.log(arguments.callee.name + " called");
    qq.que_array.forEach((item) => {
        item.categories.forEach((cat, index) => {
            if (cat == old_cat) {
                item.categories[index] = new_cat;
            }
        });
    });

    saveAddPracQueData();
    updateCategories("answer");
    updateCategories("");
    showCategoriesInAnswer();
}

function checkAnswer() {
    console.log(arguments.callee.name + " called");
    //googleIt();
    hide(".center .question-section");
    show(".center .answer-section");

    hide("button#answer");
    show("button#delete");

    setAutoCompeleteForAllInputs(qq.cat_array);

    document.querySelectorAll(".answer-section .level").forEach((level) => {
        level.classList.remove("active");
        level.addEventListener("click", function () {
            qq.fil_array[qq.que_no].level = level.textContent;
            if (level.textContent == "hard") {
                qq.fil_array[qq.que_no].revision_date = revisionDate(1);
            } else if (level.textContent == "medium") {
                qq.fil_array[qq.que_no].revision_date = revisionDate(5);
            }
            if (level.textContent == "easy") {
                qq.fil_array[qq.que_no].revision_date = revisionDate(10);
            }
            saveAddPracQueData();
        });
    });

    textareaAutoHeightSetting();
}

function nextQuestion() {
    console.log(arguments.callee.name + " called");
    ++qq.que_no;
    if (qq.que_no < qq.fil_array.length) {
        showQuestion();
    } else {
        --qq.que_no;
    }
}
function prevQuestion() {
    console.log(arguments.callee.name + " called");
    --qq.que_no;
    if (qq.que_no < 0) {
        ++qq.que_no;
    } else {
        showQuestion();
    }
}
function deleteQuestion(id) {
    console.log(arguments.callee.name + " called");
    qq.que_array = qq.que_array.filter((item) => item.id !== id);
    saveAddPracQueData();
    filter();
}

function getRandomQuestion() {
    console.log(arguments.callee.name + " called");
    var random_index = Math.floor(Math.random() * qq.que_array.length);
    qq.que_no = 0;
    qq.fil_array = [];
    qq.fil_array.push(qq.que_array[random_index]);
    showQuestion();
}

function addQuestion() {
    console.log(arguments.callee.name + " called");
    var type = "";
    var correct_option = "";
    if (document.querySelector(".mcq.active")) {
        type = "mcq";
        correct_option = document.querySelector(".add-question-section select").value;
    } else {
        type = "normal";
    }
    var visibility = getQuestionVisibility();

    var categories = getNewQuestionCategories();

    var que_obj = {
        id: generateID(),
        type: type,
        question: document.querySelector(".add-question-section textarea.question").value.trim(),
        explanation: document.querySelector(".add-question-section textarea.explanation").value.trim(),
        categories: categories,
        level: "hard",
        correct_option: correct_option,
        wronged: false,
        create_date: getTodayDate(),
        revision_date: revisionDate(1),
        username: qq.username,
        exam: qq.exam,
        visibility: visibility,
    };

    qq.que_array.push(que_obj);
    document.querySelector(".que-add-message").classList.remove("hide");
    document.querySelector(".que-add-message").textContent = "New question has been added";
    setTimeout(function () {
        document.querySelector(".que-add-message").classList.add("hide");
    }, 3000);

    console.log("New question has been added successfully");
    saveAddPracQueData();
    updateCategories("add");

    if (visibility.indexOf("public") != -1) {
        addQuestionInPublicList(que_obj);
    }
}

function getNewQuestionCategories() {
    return Array.from(document.querySelectorAll(".add .categories .category")).map((cat) => cat.children[0].textContent);
    categories.push(getTodayDate());
}

function getQuestionVisibility() {
    var visibility;
    var personal = document.querySelector("input#personal");
    var public = document.querySelector("input#personal");
    personal = personal.checked ? "personal " : "";
    public = public.checked ? "public " : "";
    visibility = personal + public;
    if (visibility == "") {
        visibility = "personal";
    }
    return visibility;
}

async function addQuestionInPublicList(que_obj) {
    //debugger_;;
    var id = "75c566d35f68942b6f88faf0fbdddaa4";
    var filename = `neet_unreviewed_question.json`;

    var array = await getDataFromCloud(id, filename);
    array.push(que_obj);
    saveDataInCloud(id, filename, array);
}

function saveAddPracQueData() {
    console.log(arguments.callee.name + " called");
    saveDataInLocale("add_prac_que_data", qq);
}
function getAddPracQueData() {
    console.log(arguments.callee.name + " called");
    var data = getDataFromLocale("add_prac_que_data");
    if (data) {
        qq = Object.assign({}, qq, data);
    }
}

function clearInputFields() {
    console.log(arguments.callee.name + " called");
    document.querySelectorAll("#add textarea, #add span").forEach((item) => {
        if (item.tagName === "SPAN") {
            item.textContent = "";
        } else if (item.tagName === "TEXTAREA") {
            item.value = "";
        }
        item.classList.toggle("hide");
        if (item.classList.contains("add-category")) {
            item.classList.remove("hide");
        }
    });
    document.querySelector(".add .categories").innerHTML = "";
    document.querySelector(".que-add-message").classList.add("hide");
}

var other_mcq_template = `Question...
(a) 
(b) 
(c) 
(d) `;

var upsc_mcq_template = `Consider the following statements ..
1. 
2. 
3. 
4. 

Which of the above statements are correct
(a) Only one
(b) Only two
(c) Only three
(d) All the four`;
