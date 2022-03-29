const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d"); //context는 canvas의 픽셀을 컨트롤 
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode"); //채우기, 그리기 모드
const saveBtn = document.getElementById("jsSave");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE_W = 1000;
const CANVAS_SIZE_H = 700;

canvas.width = CANVAS_SIZE_W;
canvas.height = CANVAS_SIZE_H; //css를 사용하기 위한 픽셀 설정(캔버스 사이즈)

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE_W, CANVAS_SIZE_H);
ctx.strokeStyle = INITIAL_COLOR; //그릴 선의 색 지정
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false; 
let drawing = false;
let filling = false;

function stopPainting(){
    painting = false;
}  

function startPainting(){
    painting = true;
}

function onMouseMove(event){
    const x = event.offsetX;
    const y = event.offsetY;
    //console.log(x,y);
    if(!painting){
        ctx.beginPath(); //클릭하지 않고 마우스를 움직이면 path(선) 시작
        ctx.moveTo(x,y); //만들어진 path의 좌표를 이동
    }else{
        ctx.lineTo(x,y); //path의 이전 위치에서 현재 위치까지의 선을 만듦
        ctx.stroke(); // 현재의 sub-path를 현재의 stroke style로 획을 그음. 즉, path를 만들고 획 그음. 
    }
}

function getTouchPos(e) {
    return {
        x: e.touches[0].clientX - e.target.offsetLeft,
        y: e.touches[0].clientY - e.target.offsetTop
    }
}


function penStart(event) {
    event.preventDefault();
    drawing = true;
    const { x, y } = getTouchPos(event);
    startX = x;
    startY = y;
}

function penEnd(event) {
    if(!drawing) return;
    // 점을 찍을 경우 위해 마지막에 점을 찍는다.
    // touchEnd 이벤트의 경우 위치정보가 없어서 startX, startY를 가져와서 점을 찍는다.
    ctx.beginPath();
    ctx.arc(startX, startY, ctx.lineWidth/2, 0, 2*Math.PI);
    ctx.fill();
    drawing = false;
}

function onPenMove(event){
    console.log(event);
    if(!drawing) return;
    const { x, y } = getTouchPos(event);
    if(!drawing){
        ctx.beginPath(); 
        ctx.moveTo(x,y); 
    }else{
        ctx.lineTo(x,y); 
        ctx.stroke();  
        startX = x;
        startY = y;
    }
}


function handleColorClick(event){
    const color = event.target.style.backgroundColor;  //이벤트에서 컬러 가져오기
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
} //클릭한 컬러의 색 가져와서 그 색으로 바꾸기

function handleRangeChange(event){
    const size = event.target.value; //이벤트에서 사이즈 가져오기
    ctx.lineWidth = size;
}

function handleModeClick(){
    if(filling == true){
        filling = false;
        mode.innerText = "Fill";
    }else{
        filling = true;
        mode.innerText = "Paint";
    }
}

function handleCanvasClick(){
    if ( filling ) {
        ctx.fillRect(0, 0, CANVAS_SIZE_W, CANVAS_SIZE_H);
    }
}

function handleCM(event){
    event.preventDefault(); //우클릭 방지
}

function handleSaveClick(event){
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image; //href는 URL이 되어야 함
    link.download = "PaintJS[🎨]"; //download는 이름이 되어야 함
    link.click();
}

function preventBehavior(event) {
    event.preventDefault();
}

if(canvas){
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCM);
    canvas.addEventListener("touchend", penEnd);
    canvas.addEventListener("touchstart",penStart);
    canvas.addEventListener('touchmove', onPenMove); //펜 움직임 감지

} //캔버스에서 마우스 관련 이벤트

Array.from(colors).forEach(color=> //color는 각각의 div
    color.addEventListener("click", handleColorClick)
); //array 만들어서 forEach로 컬러를 돌려서 addEventListener("click", handleColorClick) 호출

if(range){
    range.addEventListener("input", handleRangeChange);
} //펜의 사이즈 조절

if(mode){
    mode.addEventListener("click", handleModeClick);
}

if(saveBtn){
    saveBtn.addEventListener("click", handleSaveClick);
} //저장 버튼