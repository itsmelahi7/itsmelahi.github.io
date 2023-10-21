var que_array =[];
var cat_array = [];
var fil_que_array =[];
var que_no = 0;
var search_cat = '';
var search_level = '';
var first_time = true;
loadAddPracticeQuestionsUI();






function loadAddPracticeQuestionsUI(){
    const interval_apq = setInterval(() => {
        if ( document.querySelector('.add-sec button')  ) { 
            clearInterval(interval_apq); // This stops the interval
            getAddPracQueData(); 
            
            if(is_mobile){
                document.querySelector('.all-categories').classList.add('hide');
            }


            textareaAutoHeightSetting();
              
            document.querySelector('div#add button#close').addEventListener('click', function(){
              openPracticeSection();
              start();
            });
            document.querySelector('.add-sec button').addEventListener('click', function(){
              openAddQuestionSection();
              if(first_time){
                textareaAutoHeightSetting();
                first_time = false;
              }
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
                  search_level = level.textContent;
                } else {
                  search_level = '';
                }
                ;
                filter();
                console.log(`search_level: ${search_level}`)
              });
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
                  fil_que_array[ que_no].level = level.textContent;
                  console.log(`curr_que_level: ${fil_que_array[ que_no].level}`)
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
              deleteQuestion(fil_que_array[que_no].id );
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
                fil_que_array[que_no].question = que_ta.value;
                saveAddPracQueData();
            });

            var exp_ta = document.querySelector('.answer textarea.explanation');
            exp_ta.addEventListener('input', function(){
                fil_que_array[que_no].explanation = exp_ta.value;
                saveAddPracQueData();
            });

            var cat_ta = document.querySelector('.answer textarea.categories');
            cat_ta.addEventListener('input', function(){
                fil_que_array[que_no].categories = cat_ta.value;
                saveAddPracQueData();
            });
            if( window.innerWidth > 700 ){
              document.querySelector('.all-categories-section').classList.remove('hide');
            }
            
            if( que_array.length ){ ;
              
              loadCats();
              filter();
            }
        }
    }, 1000);
}

function loadCats(){
  cat_array = loadCategories(que_array);
  setAutoCompelete(cat_array);
  setAllCategories(cat_array);
}

function filter(name){
  if(name != undefined){
    search_cat = name;
  }
  que_array = sortArrayInRandomOrder( que_array);
  fil_que_array = filterQuestion(que_array, search_level, search_cat);
  if( fil_que_array.length ){
    fil_que_array = sortArrayInRandomOrder(fil_que_array);
    que_no = 0;
    showQuestion();
  } else {
    noQuestion();
  }
}


function noQuestion(){
  document.querySelector('.center .no-que').classList.remove('hide');

  document.querySelector('.que-num ').classList.add('hide');
  document.querySelector('.center .question').classList.add('hide');
  document.querySelector('.center .answer').classList.add('hide');

}
function openPracticeSection(){
    console.log('practice section opened');
    document.querySelector('.add_prac_que > #practice').classList.remove('hide');
    document.querySelector('.add_prac_que > #add').classList.add('hide');
    

    //loadCategories();  
}
function openAddQuestionSection(){ 
    console.log('add question section opened');
    document.querySelector('.add_prac_que > #practice').classList.remove('hide');
    document.querySelector('.add_prac_que > #add').classList.add('hide');
}

function showQuestion(){ 
  console.log('showQuestion is called');
  document.querySelector('.center .question').classList.remove('hide');
  document.querySelector('.que-num ').classList.remove('hide');

  document.querySelector('.center .answer').classList.add('hide');
  document.querySelector('.center .no-que').classList.add('hide');

  
  loadQuestionCategories(fil_que_array[que_no].categories);
  
  document.querySelector('.que-num').textContent = (que_no + 1) +'/'+ fil_que_array.length;
  
  document.querySelector('.question span').textContent = fil_que_array[que_no].question;
  
  document.querySelector('.answer textarea.question').value = fil_que_array[que_no].question;
  document.querySelector('.answer textarea.explanation').value = fil_que_array[que_no].explanation;
  document.querySelector('.answer textarea.categories').value = fil_que_array[que_no].categories;


}

function checkAnswer(){
  document.querySelector('.center .question').classList.toggle('hide');
  document.querySelector('.center .answer').classList.toggle('hide');
  document.querySelectorAll('.answer .level').forEach( level => {
    level.classList.remove('active');
  });
  textareaAutoHeightSetting();
}

function nextQuestion(){
  ++que_no;
  if( que_no < fil_que_array.length){
    showQuestion();
  } else {
    --que_no;
  }

}
function prevQuestion(){
  --que_no;
  if( que_no < 0){
    ++que_no;
  } else {
    showQuestion();
  }
}
function deleteQuestion(id) {

  que_array = que_array.filter(item => item.id !== id);
  saveAddPracQueData();
  filter();
}
function addQuestion(){
  
      que_array.push({
          id: generateID(),
          type: 'normal',
          question: document.querySelector("#add textarea#question").value.trim(),
          explanation: document.querySelector(" #add textarea#explanation").value.trim(),
          categories: document.querySelector("#add textarea#categories").value.toLowerCase().trim() + ', ' + getTodayDateUid(),
          level: 'hard',
          wronged: false,
          date: getTodayDateUid(),
          revision_date: revisionDate(1),
      });

      document.querySelector('.que-add-message').textContent = 'Question has been added';
      document.querySelector('.que-add-message').classList.toggle('hide');
      setTimeout(() => { 
          document.querySelector('.que-add-message').classList.toggle('hide');
      }, 4000);
    
      console.log('New question is added successfully');
      saveAddPracQueData();
}

function saveAddPracQueData(){ 
  saveDataInLocale('add_prac_que_data', que_array);
}
function getAddPracQueData(){ 
  var data = getDataFromLocale('add_prac_que_data');
  if(data){
      que_array = data;
  }
}


function clearInputFields(){
  
}



