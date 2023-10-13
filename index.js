const canvas = document.getElementById('mycanvas')
const ctx = canvas.getContext('2d')
document.getElementById('mycanvas').width = 1600
document.getElementById('mycanvas').height = 600

let map = []
let start = [19,14]
let end = [59,14]
let algochoice = 0

//draw grid
function grid(){
    for(let i = 0; i < canvas.width/20; i++){
        ctx.beginPath()
        ctx.moveTo(20*i,canvas.height)
        ctx.lineTo(20*i,0)
        ctx.strokeStyle = '#00ADB5'
        ctx.stroke()
    }
    for(let i = 0; i < canvas.height/20; i++){
        ctx.beginPath()
        ctx.moveTo(canvas.width,20*i)
        ctx.lineTo(0,20*i)
        ctx.strokeStyle = '#00ADB5'
        ctx.stroke()
    }
}
grid()


//create grid array
function basearray(){
    map = []
    for(let i = 0; i < canvas.width/20; i++){
        map.push([])
        for(let j = 0; j < canvas.height/20; j++){
            map[i].push([])
        }
    }
}
basearray()


//draw start and end
function SandE(){
    ctx.beginPath()
    ctx.fillStyle = 'blue'
    ctx.rect(start[0]*20,start[1]*20,20,20)
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = 'red'
    ctx.rect(end[0]*20,end[1]*20,20,20)
    ctx.fill()
}
SandE()


// heuristic
function heuristic(node, end){
    let distx = Math.abs((node[0]*20 + 10) - (end[0]*20 + 10))
    let disty = Math.abs((node[1]*20 + 10) - (end[1]*20 + 10))
    return Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2))
}


//generate random walls
document.getElementById('randomwalls').onclick = function (){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    grid()
    SandE()
    map = []
    basearray()
    for(let i = 0; i < canvas.width/20; i++){
        for(let j = 0; j < canvas.height/20; j++){
            let rand = Math.random()
            if(i == start[0] && j == start[1] || i == end[0] && j == end[1]){
                continue
            }
            if(rand < 0.25){
                ctx.beginPath()
                ctx.fillStyle = '#393E46'
                ctx.rect(i*20,j*20,20,20)
                ctx.fill()
                map[i][j] = 'w'
            }
        }
    }
}


//generate maze
document.getElementById('maze').onclick = function (){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    basearray()
    SandE()
    grid()
    let pos = []
    let x = 0
    let y = 0
    map[x][y] = 'w'
    let visited = []
    let neighbors = []
    let link = []
    function mazegen(){

        visited.push([x,y])
        link.push([x,y])

        while(visited.length > 0){

            pos = visited[visited.length - 1]
            neighbors = []
            map[pos[0]][pos[1]] = 'w'
            
            if(pos[0] + 2 <= 79){
                neighbors.push([pos[0] + 2, pos[1]])
                if(isin() == true){
                    neighbors.pop()
                }
            }
            if(pos[0] - 2 >= 0){
                neighbors.push([pos[0] - 2, pos[1]])
                if(isin() == true){
                    neighbors.pop()
                }
            }
            if(pos[1] + 2 <= 29){
                neighbors.push([pos[0], pos[1] + 2])
                if(isin() == true){
                    neighbors.pop()
                }
            }
            if(pos[1] - 2 >= 0){
                neighbors.push([pos[0], pos[1] - 2])
                if(isin() == true){
                    neighbors.pop()
                }
            }
            if (neighbors.length == 0) {
                visited.pop()
            }
            else{
                let neighbor = neighbors[Math.floor(Math.random() * neighbors.length)]
                if(pos[0] == neighbor[0] && pos[1] > neighbor[1] && pos[1] + 1 <= 29){
                    map[pos[0]][pos[1] + 1] = 'w'
                }
                if(pos[0] == neighbor[0] && pos[1] < neighbor[1] && pos[1] - 1 >= 0){
                    map[pos[0]][pos[1] - 1] = 'w'
                }
                if(pos[0] < neighbor[0] && pos[1] == neighbor[1] && pos[0] - 1 >= 0){
                    map[pos[0] - 1][pos[1]] = 'w'
                }
                if(pos[0] > neighbor[0] && pos[1] == neighbor[1] && pos[0] + 1 <= 79){
                    map[pos[0] + 1][pos[1]] = 'w'
                }

                visited.push(neighbor)
                link.push(neighbor)
            }

        }
    }
    mazegen()

    function isin(){
        for(let i = 0; i < link.length; i++){
            if(link[i][0] == neighbors[neighbors.length - 1][0] && link[i][1] == neighbors[neighbors.length - 1][1]){
                return true
            }
        }
        return false
    }
    cremaze()
}


//create maze walls
function cremaze(){
    for(let i = 0; i < canvas.width/20; i++){
        for(let j = 0; j < canvas.height/20; j++){
            if(i == start[0] && j == start[1] || i == end[0] && j == end[1]){
                map[i][j] = []
            }
            if(map[i][j] == 'w'){
                ctx.beginPath()
                ctx.fillStyle = '#393E46'
                ctx.rect(i*20,j*20,20,20)
                ctx.fill()
            }
        }
    }
}

let overlay = document.getElementById("overlay")
toggleOverlay()
//overlay to stop clicks
function toggleOverlay(){
    overlay = document.getElementById("overlay")
    if (overlay.style.display == 'none') {
        overlay.style.display = 'block'
    }
    else{
        overlay.style.display = 'none'
    }
}


//start
document.getElementById('start').onclick = function (){
    toggleOverlay()
    switch(algochoice){
        case 1:
            First()
            break
        case 2:
            Second()
            break
        case 3:
            Third()
            break
        default:
            choice = 0
            document.getElementById('paragraph').innerHTML = 'You need to pick an algorithm!'
            toggleOverlay()
    }
}

//algos
document.getElementById('dijkstra').onclick = function (){
    document.getElementById('paragraph').innerHTML = 'You have chosen Dijkstra s algorithm!'
    algochoice = 1
    choice = 0
    clearpath()
}
document.getElementById('A*').onclick = function (){
    document.getElementById('paragraph').innerHTML = 'You have chosen the A* algorithm!'
    algochoice = 2
    choice = 0
    clearpath()
}
document.getElementById('swarm').onclick = function (){
    document.getElementById('paragraph').innerHTML = 'You have chosen the Bidirectional search algorithm!'
    algochoice = 3
    choice = 0
    clearpath()
}

//clear path
function clearpath(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    SandE()
    grid()
    cremaze()
}


let controll = 0

//animation 
async function animation(path, color){
    if(controll == 0){
        clearpath()
    }
    if(path.length > 2){
        for(let i = 0; i < path.length; i++){
            if(path[i][0] == start[0] && path[i][1] == start[1] || path[i][0] == end[0] && path[i][1] == end[1]){
                continue
            }
            ctx.beginPath()
            ctx.fillStyle = color
            ctx.rect(path[i][0]*20,path[i][1]*20,20,20)
            ctx.fill()
        }
    }
    else{
        if(path[0] == start[0] && path[1] == start[1] || path[0] == end[0] && path[1] == end[1]){
            return
        }
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.rect(path[0]*20,path[1]*20,20,20)
        ctx.fill()
    }         
}

//dijkstra
async function First(){
    clearpath()
    
    let num = 0

    async function dijkstra() {
        let numRows = map.length
        let numCols = map[0].length
    
        // Initialize arrays to store distances and visited status
        let distances = []
        let visited = []
        let visitedNodes = []
    
        for (let i = 0; i < numRows; i++) {
            distances.push([])
            visited.push([])
            for (let j = 0; j < numCols; j++) {
                distances[i][j] = Infinity // Initialize all distances to infinity
                visited[i][j] = false // Initialize all nodes as unvisited
            }
        }
    
        let [startX, startY] = start
        let [endX, endY] = end
    
        distances[startX][startY] = 0 // Set the distance of the starting node to 0
    
        // Define movement directions
        let dx = [1, -1, 0, 0, 1, -1, 1, -1]
        let dy = [0, 0, 1, -1, 1, 1, -1, -1]
    
        while(true){
            let minDist = Infinity
            let minNode = null
            // Find the unvisited node with the smallest distance
            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numCols; j++) {
                    if (!visited[i][j] && distances[i][j] < minDist) {
                        minDist = distances[i][j]
                        minNode = [i, j]
                    }
                }
            }
    
            if(!minNode){
                break // No unvisited nodes with finite distance
            }
            num = 0
            
            visitedNodes.push([...minNode])
            await sleep(10)
            await animation(visitedNodes, '#FBF0B2')
            visited[minNode[0]][minNode[1]] = true
    
            // Explore neighbors
            for(let k = 0; k < 8; k++){
                let newRow = minNode[0] + dx[k];
                let newCol = minNode[1] + dy[k];
    
                if(newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols && map[newRow][newCol] !== 'w'){
                    let alt = distances[minNode[0]][minNode[1]] + 1 
                    if (alt < distances[newRow][newCol]) {
                        distances[newRow][newCol] = alt
                    }
                    num = 1
                }
            }
            if(num == 0){
                break
            }
        }
        if(num == 0){
            document.getElementById('paragraph').innerHTML = 'No possible path!'
            algochoice = 0
            return
        }
        // Backtrack to find the shortest path
        let shortestPath = [];
        let currentNode = [endX, endY]
        while (!isEqual(currentNode, start)) {
            shortestPath.push(currentNode)
            controll = 1
            await sleep(50)
            await animation(shortestPath, '#892CDC')
            for (let k = 0; k < 8; k++) {
                let newRow = currentNode[0] + dx[k]
                let newCol = currentNode[1] + dy[k]
                if(newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols && distances[newRow][newCol] + 1 === distances[currentNode[0]][currentNode[1]]
                ){
                    currentNode = [newRow, newCol]
                    break
                }
            }
        }
        shortestPath.push(start)
        await sleep(50)
        await animation(shortestPath, '#892CDC')
        controll = 0
        toggleOverlay()
        return
    }
    dijkstra()
    

    //check if two arrays are equal
    function isEqual(arr1, arr2) {
        return arr1[0] === arr2[0] && arr1[1] === arr2[1]
    }
}


//A*
async function Second(){
    clearpath()
    
    async function astar() {
        let open = []
        let path = []
        let openSet = [start]
        let cameFrom = new Array(map.length * map[0].length).fill(null)
        let gScore = new Array(map.length * map[0].length).fill(Infinity)
        let fScore = new Array(map.length * map[0].length).fill(Infinity)
      
        const startIdx = flattenIndex(start, map[0].length) // Convert 2D indices to 1D
        gScore[startIdx] = 0
        fScore[startIdx] = heuristic(start, end)
      
        while (openSet.length > 0) {
            let currentIdx = 0;
            for(let i = 0; i < openSet.length; i++){
                if (fScore[flattenIndex(openSet[i], map[0].length)] < fScore[flattenIndex(openSet[currentIdx], map[0].length)]) {
                    currentIdx = i
                }
            }
            let current = openSet[currentIdx]
      
            if(arraysEqual(current, end)){
                path = reconstructPath(cameFrom, current, map)
                controll = 1
                for(let i = 0; i < path.length; i++){
                    await sleep(40)
                    await animation(path[i], '#892CDC')
                }
                controll = 0
                toggleOverlay()
                return path
            }
      
            openSet.splice(currentIdx, 1)
      
            let neighbors = []
      
            let currentX = current[0]
            let currentY = current[1]
      
            let potentialNeighbors = [
            [currentX + 1, currentY],
            [currentX, currentY + 1],
            [currentX - 1, currentY],
            [currentX, currentY - 1],
            [currentX + 1, currentY + 1],
            [currentX - 1, currentY + 1],
            [currentX + 1, currentY - 1],
            [currentX - 1, currentY - 1],
            ]
      
            for(let neighborCoords of potentialNeighbors){
                if(
                    neighborCoords[0] >= 0 && neighborCoords[0] < map.length &&
                    neighborCoords[1] >= 0 && neighborCoords[1] < map[0].length &&
                    map[neighborCoords[0]][neighborCoords[1]] !== 'w'
                ){
                    neighbors.push(neighborCoords)
                }
            }
      
            for(let neighbor of neighbors){
                let neighborIdx = flattenIndex(neighbor, map[0].length)
                let tentativeGScore = gScore[flattenIndex(current, map[0].length)] + 1
      
                if(tentativeGScore < gScore[neighborIdx]){
                    cameFrom[neighborIdx] = current
                    gScore[neighborIdx] = tentativeGScore
                    fScore[neighborIdx] = gScore[neighborIdx] + heuristic(neighbor, end)
      
                    if(!includesCoord(openSet, neighbor)){
                        openSet.push(neighbor)
                    }
               }
               open.push(...openSet)
               
            }
            controll = 1
            await sleep(40)
            await animation(open, '#FBF0B2')
            controll = 0
        }
        
        document.getElementById('paragraph').innerHTML = 'No possible path!'
        algochoice = 0
        toggleOverlay()
        return null
    }
      
    function reconstructPath(cameFrom, current, grid){
        let path = [current]
        let currentIdx = flattenIndex(current, grid[0].length)
      
        while (cameFrom[currentIdx]) {
            current = cameFrom[currentIdx]
            currentIdx = flattenIndex(current, grid[0].length)
            path.push(current)
        }
      
        return path.reverse()
    }
      
      
    function flattenIndex(coord, width){
        return coord[0] * width + coord[1]
    }
      
    function arraysEqual(arr1, arr2){
        return arr1[0] === arr2[0] && arr1[1] === arr2[1]
    }
      
    function includesCoord(arr, coord){
        for(let element of arr){
          if(arraysEqual(element, coord)){
            return true
          }
        }
        return false
    }
    astar()

}


//bidirectional
async function Third(){
    clearpath()
    
    let fvisited = []
    let bvisited = []
    let fqueue = [start]
    let bqueue = [end]
    let fparents = []
    let bparents = []
    let val = 0

    for(let i = 0; i < canvas.width / 20; i++){
        fvisited.push([])
        bvisited.push([])
        fparents.push([])
        bparents.push([])
        for(let j = 0; j < canvas.height / 20; j++){
            fvisited[i].push(false)
            bvisited[i].push(false)
            fparents[i].push([])
            bparents[i].push([])
        }
    }

    async function bidirectional(){
        
        while(fqueue.length > 0 && bqueue.length > 0){

            let node1 = fqueue.shift()
            let node2 = bqueue.shift()

            if(fvisited[node2[0]][node2[1]]){
                val = 2
                toggleOverlay()
                return reconstructPath(node1, node2, fparents, bparents)
            }
            if(bvisited[node1[0]][node1[1]]){
                val = 1
                toggleOverlay()
                return reconstructPath(node1, node2, fparents, bparents)
            }
            
            fvisited[node1[0]][node1[1]] = true
            bvisited[node2[0]][node2[1]] = true

            let neighbors1 = getNeighbors(node1, map)
            for(let neighbor1 of neighbors1){
                if (!fvisited[neighbor1[0]][neighbor1[1]]) {
                  fqueue.push(neighbor1)
                  fparents[neighbor1[0]][neighbor1[1]] = node1
                  fvisited[neighbor1[0]][neighbor1[1]] = true
                  await sleep(10)
                  controll = 1
                  await animation(fqueue, '#FBF0B2')
                }
              }

            let neighbors2 = getNeighbors(node2, map)
            for(let neighbor2 of neighbors2){
                if(!bvisited[neighbor2[0]][neighbor2[1]]){
                  bqueue.push(neighbor2)
                  bparents[neighbor2[0]][neighbor2[1]] = node2
                  bvisited[neighbor2[0]][neighbor2[1]] = true
                  await sleep(10)
                  await animation(bqueue, '#FBF0B2')
                }
            } 
        }
        document.getElementById('paragraph').innerHTML = 'No possible path!'
        algochoice = 0
        toggleOverlay()
        return
    }

    let final = await bidirectional()
    for(let i = 0; i < final.length; i++){
        await sleep(40)
        await animation(final[i], '#892CDC')
    }
    await animation(final, '#892CDC')
    

    function reconstructPath(node1, node2, fparents, bparents){
        if(val == 1){
            let path = []
        
        while(true){
            path.unshift(node1)
            node1 = fparents[node1[0]][node1[1]]
            if(node1[0] == start[0] && node1[1] == start[1])
                break
        }
        node2 = path.pop()
        while(true){
            path.push(node2)
            node2 = bparents[node2[0]][node2[1]]
            if(node2[0] == end[0] && node2[1] == end[1])
                break
        }
        return path
        }

        let path = []
        
       
       
        while(true){
            path.unshift(node2)
            node2 = bparents[node2[0]][node2[1]]
            if(node2[0] == end[0] && node2[1] == end[1])
                break
        }

        node1 = path.pop()

        while(true){
            path.push(node1)
            node1 = fparents[node1[0]][node1[1]]
            if(node1[0] == start[0] && node1[1] == start[1])
                break
        }
        return path

    }

    function getNeighbors(node, map){
        let neighbors = []
        let [x, y] = node
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]
      
        for(let [dx, dy] of directions){
          let newX = x + dx
          let newY = y + dy
      
          if(isValidCell(newX, newY, map)){
            neighbors.push([newX, newY])
          }
        }
      
        return neighbors
      }
      
      function isValidCell(x, y, map){
        return x >= 0 && x < map.length && y >= 0 && y < map[0].length && map[x][y] != 'w'
      }
      

}


//clear board
document.getElementById('clearboard').onclick = function (){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    grid()
    SandE()
    map = []
    basearray()
}


//move start and end
canvas.addEventListener('mousedown', changepos)
let choice = 0
function changepos(event){

    let rect = canvas.getBoundingClientRect()
    let scalex = canvas.width / rect.width
    let scaley = canvas.height / rect.height
    let mousex = (event.clientX - rect.left)*scalex/20 
    let mousey = (event.clientY - rect.top)*scaley/20
    let click = event.button

    if(click == 0){
        if(mousex > start[0] && mousex < start[0] + 1 && mousey > start[1] && mousey < start[1] + 1){
            document.getElementById('paragraph').innerHTML = 'You are moving the starting point!'
            choice = 1
            algochoice = 0
            clearpath()
            canvas.addEventListener('mousedown', newpos)
        }
        if(mousex > end[0] && mousex < end[0] + 1 && mousey > end[1] && mousey < end[1] + 1){
            document.getElementById('paragraph').innerHTML = 'You are moving the end point!'
            choice = 2 
            algochoice = 0
            clearpath()
            canvas.addEventListener('mousedown', newpos)
        }
    }
    return
}


function newpos(event){
    let rect = canvas.getBoundingClientRect()
    let scalex = canvas.width / rect.width
    let scaley = canvas.height / rect.height
    let mousex = (event.clientX - rect.left)*scalex/20 
    let mousey = (event.clientY - rect.top)*scaley/20
    let click = event.button
    
    if(click == 0){
        if(choice == 1){
            for(let i = 0; i < canvas.width/20; i++){
                for(let j = 0; j < canvas.height/20; j++){
                    if(mousex > i && mousex < i + 1 && mousey > j && mousey < j + 1){
                        start = [i,j]
                        map[i][j] = []
                        clearpath()
                        break
                    } 
                }
            }
        }
        if(choice == 2){
            for(let i = 0; i < canvas.width/20; i++){
                for(let j = 0; j < canvas.height/20; j++){
                    if(mousex > i && mousex < i + 1 && mousey > j && mousey < j + 1){
                        end = [i,j]
                        map[i][j] = []
                        clearpath()
                        break
                    } 
                }
            }
        }
    }
    return
}


//sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
