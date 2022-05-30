const $area = document.querySelector('.area');
const $addBtn = document.querySelector('.btn');



let action = false;
let $selectedBox = null;
let selectedBoxIndex = null;
let selectedNotice = null;
let boxes = [];

const areaWidth = $area.offsetWidth;
const areaHeight = $area.offsetHeight;
let boxWidth = 0;
let boxHeight = 0;

let startCoords = {
    x: 0, y: 0
}

let distance = {
    x: 0, y: 0
}

if (!!getLS('coords')) {
    boxes = getLS('coords');
    boxGenerator(boxes);
}

function setLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLS(key) {
    return JSON.parse(localStorage.getItem(key));
}

function boxGenerator(list) {
    let template = '';
    for (let i = 0; i < list.length; i++) {
        console.log( list);
        template += '<div class="box" style="left: ' + list[i].x + 'px; top: ' + list[i].y + 'px;" data-index="' + i + '">' +
            '<span class="note">Note ' + (i+1) +'</span>' +
            '<textarea class="notice" indexNotice="' +i+'"placeholder="Input :" >' + list[i].notice + '</textarea>' +
            '</div>';
    }
    $area.innerHTML = template;

    $notise = document.querySelectorAll('.notice');
    for (let i = 0; i < $notise.length; i++) {
    $notise[i].addEventListener('input',function (e){
           // console.log(e.target.value);
            selectedNotice = (e.target).value;
            selectedBoxIndex = e.target.getAttribute('indexNotice');
            boxes[selectedBoxIndex].notice = selectedNotice;
        setLS('coords', boxes);
    });}

    boxWidth = document.querySelector('.box').offsetWidth;
    boxHeight = document.querySelector('.box').offsetHeight;
}

function boxController(x, y) {
    $selectedBox.style.left = x + 'px';
    $selectedBox.style.top = y + 'px';
}

$area.addEventListener('mousedown', function (e) {
    if (e.target.classList.contains('box')) {
        action = true;
        $selectedBox = e.target;
        selectedBoxIndex = e.target.getAttribute('data-index');
        startCoords.x = e.pageX;
        startCoords.y = e.pageY;
    }
});

$area.addEventListener('mouseup', function (e) {
    action = false;
    boxes[selectedBoxIndex].x = distance.x;
    boxes[selectedBoxIndex].y = distance.y;
    setLS('coords', boxes);
});

$area.addEventListener('mousemove', function (e) {
    if (action) {
        distance.x = boxes[selectedBoxIndex].x + (e.pageX - startCoords.x);
        distance.y = boxes[selectedBoxIndex].y + (e.pageY - startCoords.y);

        if (distance.x <= 0) distance.x = 0;
        if (distance.x >= (areaWidth - boxWidth)) distance.x = areaWidth - boxWidth;

        if (distance.y <= 0) distance.y = 0;
        if (distance.y >= (areaHeight - boxHeight)) distance.y = areaHeight - boxHeight;

        boxController(distance.x, distance.y);
    }
});

$addBtn.addEventListener('click', function () {
    boxes.push({
        notice: "", x: 0, y: 0
    });
    boxGenerator(boxes);
});