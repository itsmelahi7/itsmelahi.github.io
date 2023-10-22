var qq = {
    username: '',
    exam: '',
    que_array:[],
    fil_array:[],
    cat_array:[],
    today_que:[],
    search_level:'',
    search_cat:'',
    que_no:'',
    que_id:'',
    native_language:'urdu',
    is_today: false,
    setting: {
        hide_que_categories: false,
        theme: 'light',
    }
};
var is_edit_category = true;
var old_cat = '';
var first_time = true;
loadAddPracticeQuestionsUI();


function loadAddPracticeQuestionsUI(){
    const interval_apq = setInterval(() => {
        if ( document.querySelector('.add-sec button')  ) { 
            clearInterval(interval_apq); // This stops the interval
            getAddPracQueData();

            document.querySelector('.today-que').addEventListener('click',  function(){
                qq.search_level = '';
                qq.search_cat = '';
                qq.fil_array = qq.today_que;
                is_today = true;
                showQuestion();
            })
            document.querySelector('.center').classList.remove('hide');
            textareaAutoHeightSetting();
            document.querySelector('.refresh-icon').addEventListener('click', refresh);  
            document.querySelector('div#add button#close').addEventListener('click', function(){
              openPracticeSection();
              
            });
            document.querySelector(' button.add').addEventListener('click', function(){
                qq.fil_array = qq.today_que;    
            });
            document.querySelector('button.add').addEventListener('click', function(){
              openAddQuestionSection();
              if(first_time){
                textareaAutoHeightSetting();
                first_time = false;
              }
            });

            document.querySelector('.add button.add-category').addEventListener('click', function(){
                addCategory('', 'add');
            });
            document.querySelector('.answer button.add-category').addEventListener('click', function(){
                addCategory('', 'answer');
            });
            document.querySelector('.answer button.update-category').addEventListener('click', function(){
                addCategory('', 'answer');
            });
            document.querySelectorAll('.search-level .level').forEach( level => {
              level.addEventListener('click', function(event){
                
                document.querySelectorAll('.search-level .level').forEach( div => {
                  
                  if( div != level )
                  div.classList.remove('active');
                });

                level.classList.toggle('active'); 
                ;
                if(level.className.indexOf('active') > 0){
                  qq.search_level = level.textContent;
                } else {
                  qq.search_level = '';
                }
                ;
                filter();
                console.log(`qq.search_level: ${qq.search_level}`)
              });
            });

            document.querySelector('.search-container .que-level').addEventListener('change', function(){
                var select = document.querySelector(".que-level");
                var selectedValue = select.options[select.selectedIndex].value;
                qq.search_level = selectedValue;
                // You can use the selectedValue in your code for further actions
                console.log(`search level = "${qq.search_level}"`);
                if(qq.search_level == 'all') {
                    qq.search_level = '';
                    select.style.removeProperty('color');
                } else {
                    select.style.color = `var(--${qq.search_level})`;
                }
                filter();
            });


            document.querySelectorAll('.answer .level').forEach( level => {
              level.addEventListener('click', function(event){
                
                document.querySelectorAll('.answer .level').forEach( div => {
                  
                  if( div != level )
                  div.classList.remove('active');
                });
                level.classList.add('active'); 
                ;
                if(level.className.indexOf('active') > 0){
                  qq.fil_array[ qq.que_no].level = level.textContent;
                  console.log(`curr_que_level: ${qq.fil_array[ qq.que_no].level}`)
                  saveAddPracQueData();
                }
                
              });
            });

            document.querySelector('.clear-icon-cat').addEventListener('click', removeSearchCat);
            document.querySelector('button#answer').addEventListener('click', checkAnswer);
            
            document.querySelector("button#delete").addEventListener("click", function() {
              document.querySelector(".delete-confirmation.overlay").classList.remove('hide');
              
          });
          
          // Add event listeners to the Yes and No buttons to handle confirmation
          document.getElementById("yes").addEventListener("click", function() {
              deleteQuestion(qq.fil_array[qq.que_no].id );
              // For example, you can delete the question or perform any other action
              document.querySelector(".delete-confirmation.overlay").classList.add('hide');
          });
          
          document.getElementById("no").addEventListener("click", function() {
              // Close the overlay without performing the delete action
              document.querySelector(".delete-confirmation.overlay").classList.add('hide');
          });


            document.querySelector('button#next').addEventListener('click', nextQuestion);
            document.querySelector('button#prev').addEventListener('click', prevQuestion);

            document.querySelector('button#add').addEventListener('click', addQuestion);
            document.querySelector('button#clear').addEventListener('click', clearInputFields);
            
            

            var que_ta = document.querySelector('.answer textarea.question');
            que_ta.addEventListener('input', function(){
                qq.fil_array[qq.que_no].question = que_ta.value;
                saveAddPracQueData();
            });

            var exp_ta = document.querySelector('.answer textarea.explanation');
            exp_ta.addEventListener('input', function(){
                qq.fil_array[qq.que_no].explanation = exp_ta.value;
                saveAddPracQueData();
            });

            
        document.querySelector('.google-it').addEventListener('click', googleIt);
            
          






            
            if( qq.que_array.length == 0 ){
              var message = 'No questions data found. Open "add question" section by clicking the "add" button.';
              noQuestion(message);
              return;
            } else {
                refresh();
            }
        }
    }, 1000);
}

function askChatGPT(){

}

function filter(category){
  if(category != undefined){
    qq.search_cat = category;
  }

  qq.que_array = sortArrayInRandomOrder( qq.que_array);
  qq.fil_array = filterQuestion(qq.que_array, qq.search_level, qq.search_cat);
  if( qq.fil_array.length ){
    qq.fil_array = sortArrayInRandomOrder(qq.fil_array);
    qq.que_no = 0;
    showQuestion();
  } else {
    if( qq.search_level != '' && qq.search_cat == ''){
        noQuestion(`No question found for level '${qq.search_level}'`);
    } else if ( qq.search_level != '' && qq.search_cat != ''){
        noQuestion(`No question found for level '${qq.search_level}' AND category '${qq.search_cat}'`);
    }
    
  }
}

function googleIt(){
    var a = document.querySelector('a.google-it');
    a.textContent = 'Look question in chatGPT';
    var search_string = qq.fil_array[ qq.que_no].question;
    if( qq.search_cat == 'vocab'){
        search_string = `${search_string} define? also give its meaning in ${qq.native_language}`;
        a.textContent = 'Look word meaning in chatGPT';
    }
    
    a.href = 'https://www.bing.com/search?q=' + search_string;
    
    //a.click();
}

function loadTodayQuestion(){ 
    qq.today_que =[];
    qq.today_que = getTodayQuestions( qq.que_array);
    var today_que_ele = document.querySelector('.today-que')
    if(qq.today_que.length != 0){
        today_que_ele.classList.remove('hide');
        today_que_ele.textContent = `Today revision questions: ${qq.today_que.length}`;
        today_que_ele.addEventListener('click',function(){
            qq.fil_array = qq.today_que;
            qq.que_no = 0;
            showQuestion();
            today_que_ele.classList.add('hide');
        })
        
    } else {
        today_que_ele.classList.add('hide');
        
        refresh();
    }


}

document.getElementById("backup").addEventListener("click", function() {
    backupData(qq);
});


function refresh(){
    getAddPracQueData();
    updateCategories();
    qq.search_level = '';
    document.querySelector(`.search-container input`).classList.remove('hide');
    document.querySelector(`.search-container .category`).classList.add('hide');

    qq.search_cat = '';
    document.querySelector(`.search-container select`).value = 'all';
    document.querySelector(`.search-container select`).style.removeProperty('color');
    //loadTodayQuestion();
    
    
    
    
    filter();
}
function updateCategories( loc ){
    qq.cat_array = loadCategories(qq.que_array);
    setAutoCompelete(qq.cat_array, loc);
    setAllCategories(qq.cat_array, qq.que_array);
}

function handleSelectChange() {
  var select = document.getElementById("difficultySelect");
  var selectedValue = select.options[select.selectedIndex].value;
  qq.search_level = selectedValue;
  // You can use the selectedValue in your code for further actions
  console.log(`search level = "${qq.search_level}"`);
  if(qq.search_level == 'all') {
    qq.search_level = '';
  }
  filter();
}

function noQuestion(message){
  if(message){
    document.querySelector('.center .no-que').textContent = message;
  }  else {
    document.querySelector('.center .no-que').textContent = 'No questions';
  } 
  document.querySelector('.center .no-que').classList.remove('hide');

  document.querySelector('.que-num ').classList.add('hide');
  document.querySelector('.center .question').classList.add('hide');
  document.querySelector('.center .answer').classList.add('hide');
  document.querySelector('.bottom.button-section').classList.add('hide');


}
function openPracticeSection(){
    console.log('practice section opened');
    document.querySelector('.add_prac_que > #practice').classList.remove('hide');
    

    document.querySelector('.add_prac_que > #add').classList.add('hide');
    refresh(); 
}
function openAddQuestionSection(){ 
    console.log('add question section opened');
    document.querySelector('.add_prac_que > #practice').classList.add('hide');
    
    document.querySelector('.add_prac_que > #add').classList.remove('hide');
    setAutoCompelete(qq.cat_array, 'add');
}

function showQuestion(){ 
  console.log('showQuestion is called');
  document.querySelector('.center .question').classList.remove('hide');
  document.querySelector('.que-num ').classList.remove('hide');
  document.querySelector('.bottom.button-section').classList.remove('hide');

  document.querySelector('.center .answer').classList.add('hide');
  document.querySelector('.center .no-que').classList.add('hide');

  hide('button#delete');
  show('button#answer');

  
  loadQuestionCategories(qq.fil_array[qq.que_no].categories);
  
  document.querySelector('.que-num').textContent = (qq.que_no + 1) +'/'+ qq.fil_array.length;
  
  document.querySelector('.question span').textContent = qq.fil_array[qq.que_no].question;
  
  document.querySelector('.answer textarea.question').value = qq.fil_array[qq.que_no].question;
  document.querySelector('.answer textarea.explanation').value = qq.fil_array[qq.que_no].explanation;
  
  showCategoriesInAnswer();
}




var old_clipboard_text = '';
function checkClipboardAndExtract() {
    
    navigator.clipboard.readText().then(function(clipboardText) {
        if (clipboardText.trim() !== "") {
            old_clipboard_text = clipboardText.trim();
            var index = getAIResponseIndex(old_clipboard_text);
            if(index != null){
                var text = old_clipboard_text.substring(0, index);
                text = text.replace(/\*\*/g, '');

    // Remove reference numbers (e.g., ¹ ² ³)
    text = text.replace(/¹|²|³/g, '');
    navigator.clipboard.writeText(text).then(function() {
        console.log("Text set to clipboard successfully.");
    }).catch(function(error) {
        console.error("Error setting text to clipboard:", error);
    });  
     //console.log("Extracted text:", old_clipboard_text.substring(0, index));
            }
            return;
            
        }
    }).catch(function(error) {
        //console.error("Error reading clipboard:", error);
    });
}


function getAIResponseIndex(clipboardText) {
    
    var a = clipboardText.indexOf('I hope that helps');
    var b = clipboardText.indexOf('Source: Conversation with Bing');
    if( a !== -1 && b !== -1 ){
        return a;
        
    }
    
    if( b !== -1 ){
        return b;
    }
    return null;
}
var intervalIdd = setInterval(checkClipboardAndExtract, 1000);


// Call checkClipboardAndExtract every 1000 ms (1 second)
const intervalId = setInterval(checkClipboardAndExtract, 1000);



function extractText(inputText) {
    // Check if the text contains 'Source: Conversation with Bing'
    const sourceIndex = inputText.indexOf('Source: Conversation with Bing');
    
    if (sourceIndex !== -1) {
        // Get the text from the beginning to the 'Source' part
        let extractedText = inputText.substring(0, sourceIndex);

        // Remove small numbers and asterisks
        extractedText = extractedText.replace(/[\*\d]/g, '');

        // Trim any leading or trailing whitespace
        extractedText = extractedText.trim();

        return extractedText;
    }

    return inputText; // If 'Source' is not found, return the original text
}


function showCategoriesInAnswer() {
    var category_section = document.querySelector('.answer .category-section .categories');
    var categories = qq.fil_array[qq.que_no].categories;
    category_section.innerHTML = '';
    qq.fil_array[qq.que_no].categories = removeDuplicates(categories);

    categories.forEach((category, index) => {
        var datePattern = /\d{2}-\d{2}-\d{4}/;
        if ( !datePattern.test(category)) {
            var div = document.createElement('div');
            div.className = 'category';
            div.innerHTML = `<span>${category}</span> <i class="fas fa-pencil-alt"></i>  <div class="clear-icon-cat" id="clear-icon"> x </div>`;
            var edit_icon = document.createElement("div");
        
            category_section.append(div);
            div.children[1].addEventListener('click', function () {
                document.querySelector('.answer .category-section input').value = category;
                document.querySelector('.answer .category-section .add-category').classList.add('hide');
               document.querySelector('.answer .category-section .update-category').classList.remove('hide');
            
            is_edit_category = true;
            old_cat = category;
            });
            div.children[2].addEventListener('click', function () {
                div.remove();
                categories.splice(index, 1);
                saveAddPracQueData();
            });
        }
    });
}


function addCategory(name, loc){ 
    if(name == '') {
        name = document.querySelector(`.${loc} .category-section textarea.add-category`).value.toLowerCase().trim();
        document.querySelector(`.${loc} .category-section textarea.add-category`).value = '';
    }
    name = name.trim();
    var cat_div = document.querySelector(`.${loc} .category-section .categories`);
    var is_duplicate = false;
    document.querySelectorAll(`.${loc} .category-section .categories .category`).forEach( cat => {
        if (cat.children[0].textContent == name )
            is_duplicate = true;
    });
    if( is_duplicate) return;
    if(loc == 'add' && name == '') return;
    

    var div = document.createElement('div');
    div.className = 'category';
    
    if( loc == 'add'){
        div.innerHTML = `<span>${name}</span> <div class="clear-icon-cat" id="clear-icon"> x </div>`;
        cat_div.append(div);
        div.children[1].addEventListener('click', function () {
            div.remove();
        });
        updateCategories('add');
    } else if ( loc == 'answer'){

        

        
        if( is_edit_category && old_cat != '' ){
            document.querySelector('.answer .category-section .add-category').classList.remove('hide');
            document.querySelector('.answer .category-section .update-category').classList.add('hide');
            editCategory(name, old_cat);
            
            return;
        }
        qq.fil_array[ qq.que_no].categories.push(name);
        div.innerHTML = `<span>${name}</span> <i class="fas fa-pencil-alt"></i>  <div class="clear-icon-cat" id="clear-icon"> x </div>`;
        cat_div.append(div);
        is_edit_category = false;
        saveAddPracQueData();
        
        div.children[1].addEventListener('click', function () {
            document.querySelector('.answer .category-section input').value = category;
            document.querySelector('.answer .category-section .add-category').classList.add('hide');
            document.querySelector('.answer .category-section .update-category').classList.remove('hide');
            
            is_edit_category = true;
            old_cat = name;
        });

        div.children[2].addEventListener('click', function () {
            div.remove();
            qq.fil_array[qq.que_no].categories.forEach((category, index) => {
                if (name === category) {
                    qq.fil_array[qq.que_no].categories.splice(index, 1);
                }
            });
            saveAddPracQueData();
        });

        
        updateCategories('answer');
    }
    
}


function editCategory(new_cat, old_cat){
    qq.que_array.forEach(item => {
        item.categories.forEach((cat, index) => {
            if (cat == old_cat) {
                item.categories[index] = new_cat;
            }
        });
    });
    
    saveAddPracQueData();
    updateCategories();
    showCategoriesInAnswer();
}



// Function to hide an element
function hide(itemSelector) {
    const element = document.querySelector(itemSelector);
    if (element) {
        element.classList.add('hide'); // Add a class to hide the element
    }
}

// Function to show an element
function show(itemSelector) {
    const element = document.querySelector(itemSelector);
    if (element) {
        element.classList.remove('hide'); // Remove the class to show the element
    }
}



function checkAnswer(){

  googleIt();
  hide('.center .question');
  hide('button#answer');
  show('.center .answer');
  show('button#delete');
  


  setAutoCompelete(qq.cat_array, 'answer');
  document.querySelectorAll('.answer .level').forEach( level => {
    level.classList.remove('active');
    level.addEventListener('click', function(){
        qq.fil_array[qq.que_no].level = level.textContent;
        if(level.textContent == 'hard'){
            qq.fil_array[qq.que_no].revision_date = revisionDate(1);
        } else if(level.textContent == 'medium'){
            qq.fil_array[qq.que_no].revision_date = revisionDate(5);
        } if(level.textContent == 'easy'){
            qq.fil_array[qq.que_no].revision_date = revisionDate(10);
        }
        saveAddPracQueData();
    }) 
  });
  
  textareaAutoHeightSetting();
}

function nextQuestion(){
  ++qq.que_no;
  if( qq.que_no < qq.fil_array.length){
    
    showQuestion();
  } else {
    --qq.que_no;
  }

}
function prevQuestion(){
  --qq.que_no;
  if( qq.que_no < 0){
    ++qq.que_no;
  } else {
    
    showQuestion();
  }
}
function deleteQuestion(id) {

  qq.que_array = qq.que_array.filter(item => item.id !== id);
  saveAddPracQueData();
  filter();
}
function addQuestion(){
     
    var categories = Array.from(document.querySelectorAll('.add .categories .category'))
    .map(cat => cat.children[0].textContent);
    categories.push( getTodayDate());


     var que_obj = {
        id: generateID(),
        type: 'normal',
        question: document.querySelector("#add textarea#question").value.trim(),
        explanation: document.querySelector(" #add textarea#explanation").value.trim(),
        categories: categories,
        level: 'hard',
        wronged: false,
        create_date: getTodayDate(),
        revision_date: revisionDate(1),
    };
  
      qq.que_array.push(que_obj);
      document.querySelector('.que-add-message').classList.remove('hide');
      document.querySelector('.que-add-message').textContent = 'Question has been added';
      
    
      console.log('New question is added successfully' + que_obj);
      saveAddPracQueData();
      updateCategories('add');
}


function saveAddPracQueData(){ 
  saveDataInLocale('add_prac_que_data', qq);
}
function getAddPracQueData(){ 
  var data = getDataFromLocale('add_prac_que_data');
  if(data){
    qq = Object.assign({}, qq, data);
    
  }
}


function clearInputFields(){
  document.querySelectorAll('#add textarea').forEach( input => {
    input.value = '';
  });
  document.querySelector('.add .categories').innerHTML = '';
  document.querySelector('.que-add-message').classList.add('hide');
  
}



