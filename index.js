const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const OTPDisplay=document.querySelector("[data-OTPDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#Numbers");
const symbolCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()-_+={[}]<.>?/';

let OTP="";
let OtpLength=6;
let checkCount=0;
handleSlider();
// set strength circle to grey 
setIndicator("#ccc");

//set OTP length
function handleSlider(){
    inputSlider.value=OtpLength;
    lengthDisplay.innerText=OtpLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((OtpLength-min)*100/(max-min))+"% 100%"

}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow =`0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
     return Math.floor(Math.random()*[max-min])+min;
}

function generateRandomNumber(){
    return getRandomInteger(0,5);
}

function generateLowerCase(){
   return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    const randNum=getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);

}

function calculateStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum||hasSym) && OtpLength >=4){
        setIndicator("#0f0");

    }
    else if(
        (hasLower||hasUpper)&&
        (hasNum||hasSym)&&
        OtpLength>=3
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(OTPDisplay.value);
        copyMsg.innerText= "copied";

    }
    catch(e){
        copyMsg.innerText="Failed";

    }
    //to make copy wala span visible
    copyMsg.classList.add("active");
     
    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shuffleOTP(array){
    //Fisher Yates Method
    for(let i=array.length-1; i>0; i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el)=>(str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    });
    //
    //special condition
    if(OtpLength<checkCount){
        OtpLength=checkCount;
        handleSlider();
    }

}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);

})



inputSlider.addEventListener('input',(e)=>{
    OtpLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(OTPDisplay.value){
        copyContent();
    }

})

generateBtn.addEventListener('click', ()=>{
    //none of the checkbox are selected
    if(checkCount<=0)return;

    if(OtpLength<checkCount){
        OtpLength=checkCount;
        handleSlider();
    }

    //lets start the journey to find new password

    //remove old OTP
    OTP="";

    
    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }

    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }

    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    //compulsory addtion
    for( let i=0; i<funcArr.length; i++){
        OTP += funcArr[i]();

    }

    //remiaining addition
    for( let i=0; i<OtpLength-funcArr.length; i++){
        let randIndex = getRandomInteger(0, funcArr.length);
        OTP += funcArr[randIndex]();
    }
    //

    //shuffle the OTP
    OTP = shuffleOTP(Array.from(OTP));
    


    //show on UI
    OTPDisplay.value=OTP;
    //
    //calculate strength
    calculateStrength();






});
