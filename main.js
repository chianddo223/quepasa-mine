const $tbody = document.querySelector('#table tbody');
const $inputRow = document.querySelector('#row');
const $inputCol = document.querySelector('#cell');
const $inputMine = document.querySelector('#mine');
const $btn = document.querySelector('button');
const rows = [];
const randomArray = [];
const mineArray = [];
let flattedArray = rows.flat();
let copyFlatted = flattedArray.concat();
let numRows = 0;
let numClos = 0;
let numMine = 0;
let arrayWidth = 0;

$btn.addEventListener('click', startGame);

function startGame(event) {
    event.preventDefault();
    numRows = parseInt($inputRow.value);
    numClos = parseInt($inputCol.value);
    numMine = parseInt($inputMine.value);
    arrayWidth = numRows * numClos;

    for (let i = 0; i < numRows; i++) {
        const $tr = document.createElement('tr');
        const cells = [];
        for (let j = 0; j < numClos; j++) {
            const $td = document.createElement('td');
            $td.addEventListener('click', onClick);
            $td.addEventListener('contextmenu', fillRed);
            $td.classList.add(i * numRows + j);
            cells.push($td);
            $tr.append($td);
        }
        rows.push(cells);
        $tbody.append($tr);
    }
    flattedArray = rows.flat();
    copyFlatted = flattedArray.concat();
    shuffleMine();
}

function shuffleMine() {
    for (let i = 0; i < numMine; i++) {
        const randomIndex = flattedArray.splice(Math.floor(Math.random() * flattedArray.length), 1);
        randomArray.push(randomIndex);
    }
    const flattedRandom = randomArray.flat();
    for (let j = 0; j < numMine; j++) {
        mineArray.push(flattedRandom[j]);
        mineArray[j].id = "mine";
    }
}

function onClick() {
    if (this.style.background === 'white') return;

    if (this.id === 'mine') {
        this.style.background = 'black';
        this.textContent = '💥';
        defeat();
    } else {
        checkAround(this);
    }

    if (this.style.background === 'white') {
        const whiteBlock = copyFlatted.filter((item) => item.style.background === 'white');
        for (let i = 0; i < whiteBlock.length; i++) {
            checkAround(whiteBlock[i]);
        }
        checkWin();
    }
}

function fillRed(event) {
    if (this.style.background === 'white') return;

    event.preventDefault();
    if (this.textContent === '🚩') {
        this.style.background = '#888';
        this.textContent = '';
    } else {
        this.style.background = '#888';
        this.textContent = '🚩';
    }
}

function checkAround(clickedBlock) {
    const onClickClass = parseInt(clickedBlock.className);        
    const checkList = [];
    const leftSide = [];
    const rightSide = [];

    for (let i = 0; i < numClos; i++) leftSide.push(numRows * i);
    for (let i = 0; i < numClos; i++) rightSide.push((numRows * (i+1))-1);

    let classOfCheckList = [];
    switch (clickedBlock) {
        case rows[0][0]:
            classOfCheckList = [onClickClass + 1, onClickClass + numRows, onClickClass + numRows + 1];
            break;
        case rows[0][numRows-1]:
            classOfCheckList = [onClickClass -1, onClickClass + numRows, onClickClass + numRows - 1];
            break;
        case rows[numClos-1][0]:
            classOfCheckList = [parseInt(onClickClass) + 1 ,onClickClass -numRows, parseInt(onClickClass -numRows) + 1];
            break;
        case rows[numClos-1][numRows-1]:
            classOfCheckList = [onClickClass -1, onClickClass - numRows, onClickClass - numRows -1];
            break;
    }

    if (rows[0].includes(clickedBlock) && classOfCheckList.length === 0 ) {
        classOfCheckList = [onClickClass + 1, onClickClass -1, onClickClass -1 + numRows, onClickClass + numRows, onClickClass + numRows + 1];
    } else if(rows[numClos-1].includes(clickedBlock) && classOfCheckList.length === 0  ){
        classOfCheckList = [onClickClass + 1, onClickClass -1, onClickClass + 1 - numRows, onClickClass -1 - numRows, onClickClass -numRows];
    } else if (leftSide.includes(onClickClass) && classOfCheckList.length === 0 ) {
        classOfCheckList = [onClickClass - numRows, onClickClass - numRows + 1, onClickClass + 1, onClickClass + numRows, onClickClass + numRows +1];
    } else if (rightSide.includes(onClickClass) && classOfCheckList.length === 0 ){
        classOfCheckList = [onClickClass - numRows, onClickClass - numRows -1, onClickClass -1, onClickClass + numRows, onClickClass + numRows -1];
    } else if (classOfCheckList.length === 0){
        classOfCheckList = [onClickClass - numRows -1, onClickClass - numRows, onClickClass - numRows + 1,
        onClickClass - 1, parseInt(onClickClass) + 1,
        parseInt(onClickClass) + numRows -1 , parseInt(onClickClass) + numRows, parseInt(onClickClass) + numRows + 1];    
    };

    const filteredClass1 = classOfCheckList.filter( item => -1 < item && item< numRows * numClos );
    for (let i = 0; i < filteredClass1.length; i++) {
        checkList.push(copyFlatted[filteredClass1[i]]);
    };

    const countMine = checkList.filter(item => item.id === "mine").length;
    clickedBlock.textContent = countMine;
    clickedBlock.style.background = 'white';

    if (countMine === 0) {
        clickedBlock.textContent = ''; 
        let aroundCheckList = [];
        for (let j = 0; j < checkList.length; j++) {
            const aroundClass = parseInt(checkList[j].className);
            let aroundClassOfCheckList = [];

            switch (checkList[j]) {
                case rows[0][0]:
                    aroundClassOfCheckList = [aroundClass + 1, aroundClass + numRows, aroundClass + numRows + 1];
                    break;
                case rows[0][numRows-1]:
                    aroundClassOfCheckList = [aroundClass -1, aroundClass + numRows, aroundClass + numRows - 1];
                    break;
                case rows[numClos-1][0]:
                    aroundClassOfCheckList = [aroundClass + 1 ,aroundClass -numRows, aroundClass -numRows + 1];
                    break;
                case rows[numClos-1][numRows-1]:
                    aroundClassOfCheckList = [aroundClass -1, aroundClass - numRows, aroundClass - numRows -1];
                    break;
            }

            if (rows[0].includes(checkList[j]) && aroundClassOfCheckList.length === 0 ) {
                aroundClassOfCheckList = [aroundClass + 1, aroundClass -1, aroundClass -1 + numRows, aroundClass + numRows, aroundClass + numRows + 1];
            } else if(rows[numClos-1].includes(checkList[j]) && aroundClassOfCheckList.length === 0  ){
                aroundClassOfCheckList = [aroundClass + 1, aroundClass -1, aroundClass + 1 - numRows, aroundClass -1 - numRows, aroundClass -numRows];
            } else if (leftSide.includes(aroundClass) && aroundClassOfCheckList.length === 0 ) {
                aroundClassOfCheckList = [aroundClass - numRows, aroundClass - numRows + 1, aroundClass + 1, aroundClass + numRows, aroundClass + numRows +1];
            } else if (rightSide.includes(aroundClass) && aroundClassOfCheckList.length === 0 ){
                aroundClassOfCheckList = [aroundClass - numRows, aroundClass - numRows -1, aroundClass -1, aroundClass + numRows, aroundClass + numRows -1];
            } else if( aroundClassOfCheckList.length === 0){
                aroundClassOfCheckList = [aroundClass - numRows -1, aroundClass - numRows, aroundClass - numRows + 1,
                aroundClass - 1, parseInt(aroundClass) + 1,
                parseInt(aroundClass) + numRows -1, parseInt(aroundClass) + numRows, parseInt(aroundClass) + numRows + 1];    
            };

            const filteredClass2 = aroundClassOfCheckList.filter( item => -1 < item && item < numRows * numClos); 
            for (let k = 0; k < filteredClass2.length; k++) {
                aroundCheckList.push(copyFlatted[filteredClass2[k]]);
            }; 

            const aroundCountMine = aroundCheckList.filter(item => item.id === "mine").length;
            copyFlatted[aroundClass].textContent = aroundCountMine;
            if( aroundCountMine === 0 ){
                copyFlatted[aroundClass].textContent = '';
            }
            copyFlatted[aroundClass].style.background = 'white';
            aroundCheckList = [];
        }
    }
}

function checkWin(){
    const allMine = copyFlatted.filter(item => item.id === 'mine'); 
    const blank = copyFlatted.filter(item => item.id !== "mine");
    const noBlank = blank.every(item => item.style.background === 'white');

    if(noBlank){
        allMine.forEach((mine, index) => {
            setTimeout(() => {
                mine.textContent = '💥';
                mine.style.transition = 'opacity 1s ease-in-out';
                mine.style.opacity = 0;
            }, 1000 + index * 200);
        });

        setTimeout(() => {
            allMine.forEach(mine => { mine.style.opacity = 1; });
        }, allMine.length * 200 + 3000);

        setTimeout(() => {
            allMine.forEach(mine => { mine.style.opacity = 0; })
        }, allMine.length * 200 + 5000);

        setTimeout(() => {
            allMine.forEach(mine => {
                mine.textContent = '🎉';
                mine.style.opacity = 1;
            })
        }, allMine.length * 200 + 6000);

        setTimeout(() => {
            const confirm = window.confirm('승리 !! \n게임을 다시 하시겠습니까?');
            if(confirm){ reGame(); }
        }, allMine.length * 200 + 7000);
    }
}

const randomMine = [];
function defeat(){
    const allMine = copyFlatted.filter(item => item.id === 'mine'); 
    for( let i = 0; i< numMine; i++){
        const randomIndex = allMine.splice(Math.floor(allMine.length * Math.random()), 1);
        randomMine.push(randomIndex[0]);
    };

    randomMine.forEach((mine, index) => {
        setTimeout(() => {
            mine.textContent = '💥';
            mine.style.background = 'black';
            mine.style.transition = 'opacity 1s ease-in-out';
            mine.style.opacity = 1;
        }, 1000 + index * 200);
    });

    setTimeout(()=>{
        const confirm = window.confirm('패배 ㅠㅠ \n게임을 다시 하시겠습니까?');
        if(confirm){ reGame(); }
    }, 1000 + randomMine.length * 200);
}

function reGame(){
    location.reload();
}
