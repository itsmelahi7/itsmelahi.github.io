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
    is_today: false,
};

var first_time = true;
loadAddPracticeQuestionsUI();






function loadAddPracticeQuestionsUI(){
    const interval_apq = setInterval(() => {
        if ( document.querySelector('.add-sec button')  ) { 
            clearInterval(interval_apq); // This stops the interval
            getAddPracQueData(); 
            

            loadTodayQuestion();
            document.querySelector('.today-que').addEventListener('click', function(){
                qq.search_level = '';
                qq.search_cat = '';
                qq.fil_array = qq.today_que;
                is_today = true;
                showQuestion();
            })

            textareaAutoHeightSetting();
              
            document.querySelector('div#add button#close').addEventListener('click', function(){
              openPracticeSection();
              
            });
            document.querySelector('.add-sec button.add').addEventListener('click', function(){
                qq.fil_array = qq.today_que;    
            });
            document.querySelector('.add-sec button.add').addEventListener('click', function(){
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
                  qq.search_level = level.textContent;
                } else {
                  qq.search_level = '';
                }
                ;
                filter();
                console.log(`qq.search_level: ${qq.search_level}`)
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

            var cat_ta = document.querySelector('.answer textarea.categories');
            cat_ta.addEventListener('input', function(){
                qq.fil_array[qq.que_no].categories = cat_ta.value;
                saveAddPracQueData();
            });
            
            
            if( qq.que_array.length == 0 ){
              var message = 'No questions data found. Add question but clicking on the "add" button';
              noQuestion(message);
              return;
            }

            if( qq.que_array.length ){ ;
              
              loadCats();
              filter();
            }
        }
    }, 1000);
}

function loadCats(){
  qq.today_que = getTodayQuestions(qq.que_array);
  qq.cat_array = loadCategories(qq.que_array);
  
  setAutoCompelete(qq.cat_array, 'prac');
  setAllCategories(qq.cat_array);
  filter();
}

function filter(name){
  if(name != undefined){
    qq.search_cat = name;
  }
  qq.que_array = sortArrayInRandomOrder( qq.que_array);
  qq.fil_array = filterQuestion(qq.que_array, qq.search_level, qq.search_cat);
  if( qq.fil_array.length ){
    qq.fil_array = sortArrayInRandomOrder(qq.fil_array);
    qq.que_no = 0;
    showQuestion();
  } else {
    noQuestion();
  }
}


function loadTodayQuestion(){ 
    qq.today_que =[];
    qq.today_que = getTodayQuestions( qq.que_array);
    if(qq.today_que.length != 0){
        document.querySelector('.today-que').classList.remove('hide');
        
    } else {
        document.querySelector('.today-que').classList.add('hide');
        noQuestion('Congratulations, you have finished all the today practice questions.');
    }

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

}
function openPracticeSection(){
    console.log('practice section opened');
    document.querySelector('.add_prac_que > #practice').classList.remove('hide');
    

    document.querySelector('.add_prac_que > #add').classList.add('hide');
    loadCats();
    

    //loadCategories();  
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

  document.querySelector('.center .answer').classList.add('hide');
  document.querySelector('.center .no-que').classList.add('hide');

  
  loadQuestionCategories(qq.fil_array[qq.que_no].categories);
  
  document.querySelector('.que-num').textContent = (qq.que_no + 1) +'/'+ qq.fil_array.length;
  
  document.querySelector('.question span').textContent = qq.fil_array[qq.que_no].question;
  
  document.querySelector('.answer textarea.question').value = qq.fil_array[qq.que_no].question;
  document.querySelector('.answer textarea.explanation').value = qq.fil_array[qq.que_no].explanation;
  document.querySelector('.answer textarea.categories').value = qq.fil_array[qq.que_no].categories;


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
  
      qq.que_array.push({
          id: generateID(),
          type: 'normal',
          question: document.querySelector("#add textarea#question").value.trim(),
          explanation: document.querySelector(" #add textarea#explanation").value.trim(),
          categories: document.querySelector("#add textarea#categories").value.toLowerCase().trim() + ', ' + getTodayDateUid(),
          level: 'hard',
          wronged: false,
          create_date: getTodayDateUid(),
          revision_date: revisionDate(1),
      });
      document.querySelector('.que-add-message').classList.remove('hide');
      document.querySelector('.que-add-message').textContent = 'Question has been added';
      
    
      console.log('New question is added successfully');
      saveAddPracQueData();
}

function saveAddPracQueData(){ 
  saveDataInLocale('add_prac_que_data', qq);
}
function getAddPracQueData(){ 
  var data = getDataFromLocale('add_prac_que_data');
  if(data){
      qq = data;
  }
}


function clearInputFields(){
  document.querySelectorAll('#add textarea').forEach( input => {
    input.value = '';
  });
  document.querySelector('.que-add-message').classList.add('hide');
  
}



