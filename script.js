
var is_mobile = false;

document.addEventListener('DOMContentLoaded', function () {
    loadPages('add_prac_que');
});


function loadPages(pageName) {
    
    fetch(`${pageName}.html`)
        .then((response) => response.text())
        .then((html) => {
        document.getElementById('page-content').innerHTML = html;
    })
    .catch((error) => console.error('Error loading HTML:', error));
  
    
    document.head.querySelector('#page-css').href = `${pageName}.css`;
  
    // Load the JavaScript
    const script = document.createElement('script');
    script.src = `${pageName}.js`;
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => console.log(`${script.src} script loaded`);
    script.onerror = (error) => console.error('Error loading script:', script.src, error);
    document.head.appendChild(script);
  }
  
function loadPage(pageName) {
    const mainContent = document.getElementById('page-content');
    mainContent.innerHTML = '';

    fetch(`${pageName}.html`)
        .then((response) => response.text())
        .then((content) => {
            mainContent.innerHTML = content;
        })
        .catch((error) => {
            console.error(`Error loading content: ${error}`);
        });
}

  
  
document.querySelector('#home').addEventListener('click',function(){
    loadPages('add_prac_que');
});
document.querySelector('#about-me').addEventListener('click', function(){
    loadPage('about_me');
});



if ( window.innerWidth < 700 ) {
    is_mobile = true;
    document.querySelector(`.menu-button`).classList.remove('hide');
    document.querySelector(`.header > .tabs`).classList.add('hide');
    
    var menu_button = document.querySelector("#openMenu")
    menu_button.addEventListener("click", function() {
        document.querySelector("#tabOverlay").style.right = "0";
        document.querySelector("#tabOverlay").classList.remove('hide');
    });
    
    document.querySelector("#closeMenu").addEventListener("click", function() {
        closeTabOverlay();

    });

    document.querySelector(".mobile-tab #home").addEventListener('click', function(){
        loadPages('add_prac_que');
        closeTabOverlay();
    });
    document.querySelector(".mobile-tab #about-me").addEventListener('click', function(){
        loadPage('about_me');
        closeTabOverlay();
    });

} else {
    document.querySelector(`.menu-button`).classList.add('hide');
    document.querySelector(`.header > .tabs`).classList.remove('hide');
}

function closeTabOverlay(){
    document.querySelector("#tabOverlay").style.right = "-300px";
    document.querySelector("#tabOverlay").classList.add('hide');
}

















function saveDataInLocale(key, array) {
    try {
        const jsonData = JSON.stringify(array);
        localStorage.setItem(key, jsonData);
        console.log(` Data with key "${key}" successfullt saved in locale`);
    } catch (error) {
        console.error(`Error saving data with key "${key}" in local storage:`, error);
    }
}

function getDataFromLocale(key) {
    try {
        const jsonData = localStorage.getItem(key);
        if (jsonData === null) {
            console.log(`No local data is found for key: ${key}`);
            return null;
        }
        var data = JSON.parse(jsonData);
        console.log(`Local data for key "${key}"retrived successfully from locale`);
        return data;

    } catch (error) {
        console.error(`Error retrieving local data with key "${key}" from localStorage`);
        return null;
    }
}



function loadCategories(fromArray){
    var toArray =[];
    fromArray.forEach( array => {
        let cat =  array.categories;
        let cat_array = convertStringToArray(cat, ',');
        cat_array.forEach(category => {
            if (!toArray.includes( category )) {
                toArray.push( category);
            }
        });
    });
    toArray = removeDuplicatesAndEmptyItems( toArray );
    console.log('all categories loaded');
    return toArray;
}


function loadQuestionCategories(categories){
    if(!categories){
        return;
    }
    var div = document.querySelector('.center .question .categories');
    div.innerHTML = '';
    categories = categories.split(',');
    categories.forEach( cat => {
        cat = cat.toLowerCase().trim();
        var span = document.createElement('div');
        span.className = 'category';
        span.textContent = cat;
        div.append(span);

        span.addEventListener('click', function(){
            addSearchCat(cat);
            filter(cat);
        });
    });
}

function setAllCategories(cat_array){
    var all_cat_div = document.querySelector('.all-categories-section .all-categories')
    cat_array.forEach(cat => {
        var div = document.createElement('div');
        div.className = 'category';
        div.textContent = cat;
        div.addEventListener('click', function(){
            addSearchCat(cat);
            filter(cat);
        });
        all_cat_div.append(div);
        
    });
}


function setAutoCompelete(cat_array) { debugger;
    const input = document.querySelector('input#search-input');
    
    var autocompleteList = document.createElement('div');
    autocompleteList.className = 'autocomplete-list';
    document.body.append(autocompleteList);
    autocompleteList.style.position = 'absolute';
  
    input.addEventListener('input', function() {
        var inputValue = input.value.toLowerCase();
        const matchingNames = cat_array.filter(name => name.toLowerCase().includes(inputValue));
  
        autocompleteList.innerHTML = '';
        if (matchingNames.length === 0) {
            autocompleteList.classList.remove('active');
            return;
        }
  
        
        matchingNames.forEach(name => {
            const item = document.createElement('div');
            item.textContent = name;
  
            item.addEventListener('click', function() {
                
            
                input.value = '';//input.value = name;
                autocompleteList.classList.remove('active');
                search_cat = name;
                search_text = '';
                addSearchCat(name);
                filter(name);
                
            });
            autocompleteList.appendChild(item);
        });
        autocompleteList.style.width = document.querySelector('input#search-input').offsetWidth + 'px';
        autocompleteList.style.top = document.querySelector('input#search-input').offsetTop + 36 + 'px';
        autocompleteList.style.left = document.querySelector('input#search-input').offsetLeft + 'px';
        autocompleteList.classList.add('active');
        autocompleteList.classList.remove('hide');
  
        autocompleteList.style.left = document.querySelector('input#search-input').offsetLeft + 'px';
        autocompleteList.classList.remove('hide');
    });
  
    
    document.addEventListener('click', function(event) {
        if (!input.contains(event.target)) {
            autocompleteList.classList.remove('active');
            autocompleteList.classList.add('hide');
        }
    });
  }


function filterQuestion(que_array, search_level, search_cat){
    console.log(`Filter question with search_level: "${search_level}" and search_cat: ${search_cat}`)
    var fil_que_array = []; 
    if( search_level != ''){
        que_array.forEach(item =>{
            if(item.level == search_level && (item.categories.indexOf(search_cat) >= 0)){
                fil_que_array.push(item);
            }
        });
    }
    else if(search_cat != '') {
        que_array.forEach(item =>{
            if(item.categories.indexOf(search_cat) >= 0){
                fil_que_array.push(item);
            }
        });
    } else {
        fil_que_array = que_array; 
    }
    return fil_que_array;
}

function handleSelectChange() {
    var select = document.getElementById("difficultySelect");
    var selectedValue = select.options[select.selectedIndex].value;
    
    // You can use the selectedValue in your code for further actions
    console.log("Selected Difficulty: " + selectedValue);
}

function addSearchCat(name){ 
    document.querySelector('.search-categories .category').classList.remove('hide');
    document.querySelector('.search-categories span').textContent = name;
    console.log(`search_cat is: "${search_cat}"`);
    document.querySelector('#search-input').classList.add('hide');
    document.querySelectorAll('.search-level .level').forEach( div => {
        div.classList.add('cat');
    });
}

function removeSearchCat(){
    document.querySelector('.search-categories  .category').classList.add('hide');
    
    document.querySelector('#search-input').classList.remove('hide');
    document.querySelectorAll('.search-level .level').forEach( div => {
        div.classList.remove('cat');
    })
    console.log('search_cat is removed');
    filter('');
}

function textareaAutoHeightSetting() {
    const intervalTA = setInterval(() => {

        if (document.querySelectorAll('textarea')) {

            document.querySelectorAll('textarea').forEach(el => {
                el.style.height = el.setAttribute('style', 'height: ' + el.scrollHeight + 'px');
                el.classList.add('auto');
                el.addEventListener('input', e => {
                    el.style.height = 'auto';
                    el.style.height = (el.scrollHeight) + 'px';
                });
            });
            console.log('textarea auto height triggered');
            clearInterval(intervalTA); // This stops the interval

        }
    }, 300);
}
//textareaAutoHeightSetting();

function generateID() {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
    const idLength = 9;
    let id = '';
  
    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
    }
  
    return id;
  }

  function getTodayDateUid() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
  
    return `${day}-${month}-${year}`;
  }

  function revisionDate(num) {
    const today = new Date(); // Get the current date
    today.setDate(today.getDate() + num); // Add 'num' days to the current date
  
    const day = today.getDate().toString().padStart(2, '0'); // Format day with leading zero
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = today.getFullYear();
  
    return `${day}-${month}-${year}`;
  }

function removeDuplicatesAndEmptyItems(arr) {
    // Use filter to remove empty items and keep track of seen items
    const uniqueItems = [];
    const seenItems = {};
  
    const cleanedArray = arr.filter((item) => {
        const trimmedItem = item.trim();
  
        if (trimmedItem === null || trimmedItem === undefined || trimmedItem === '') {
            // Remove empty or falsy items
            return false;
        }
  
        if (!seenItems.hasOwnProperty(trimmedItem)) {
            seenItems[trimmedItem] = true;
            uniqueItems.push(trimmedItem);
            return true;
        }
  
        return false;
    });
  
    return cleanedArray;
  }





function sortArrayInRandomOrder(array) {
    return array.sort(() => Math.random() - 0.5);
  }

function convertStringToArray(string, splitby){
  var array = string.split(splitby).map(item => item.trim());
  return array;
}
