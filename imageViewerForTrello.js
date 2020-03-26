let showpicturesButton = null;
let attatchments = null;
let imageContainer = null;
const delayedActionTimeout = 10000;


function main() {
    console.log("main running");
    createImageViewerStyle();
    console.log("created image style")
    addButton()
    console.log("added button")
    createImageContainer()
    console.log("crated image container")
}

function createImageViewerStyle() {
    let style = document.createElement("style");
    style.innerHTML = `
         .trello-image-container{
            background-color: #EAECF0;
            max-height: 80vh;
            max-width: 65vw;
            position: relative;
            top: 10vh;
            margin-left: auto;
            margin-right: auto;
            z-index: 30;
            

            display: none;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-evenly;
            align-items: center;
            align-content: flex-start;
            overflow-y: auto;
            overflow-x: none;
            padding-bottom: 2em;
            padding-left: 2em;
            padding-right: 2em;
         }
         .trello-image{
            width: 20%;
            max-width: 20%;
            max-height: 100%;
            margin: 2em;
            box-shadow: 5px 5px #C8C9CA;
         }
         
         .multi-image-focus{
            width: 100%;
            max-width = "100%";
            flex-basis = "100%";
         }

         .trello-attachment-viewer-button{
             width: 33%;
             padding-top: 2em;
             padding-bottom: 2em;
             color: #ddd;
             background-color: #777;
         }

        .trello-image-underlay{
            position: fixed;
            display: none;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 25;
        }
         `
    document.querySelector("script").parentNode.prepend(style);
}

function createImageContainer() {
    let underlay = document.createElement("DIV")
    underlay.setAttribute("class", "trello-image-underlay")

    document.querySelector(".window-overlay").parentElement.append(underlay)

    imageContainer = document.createElement("DIV")
    imageContainer.setAttribute("class", "trello-image-container")

    underlay.append(imageContainer)
    underlay.addEventListener("click", () => {
        imageContainer.style.display = "none"
        underlay.style.display = "none"
    })

}

function hideMultiImageViewer(){
    // Consider just editing the css instead?
    console.log("hiding multiimage viewer")
    console.log(imageContainer)
    imageContainer.style.display = "none" // This is probably only known later, so we need promises for this to work
    underlay.style.display = "none" // It does not know what this is yet., 
}


function addButton() {
    // check if there are actually any images to display?
    delayedAction(() => {
        return document.querySelector(".js-attachments-section") != null
    }, () => {
        attatchments = document.querySelector(".js-attachments-section")
        let showAttatchmentsButton = document.createElement("BUTTON");
        showAttatchmentsButton.innerText = "View All Attachments"
        showAttatchmentsButton.setAttribute("class", "trello-attachment-viewer-button");

        attatchments.prepend(showAttatchmentsButton);
        showpicturesButton = showAttatchmentsButton;
        showpicturesButton.addEventListener("click", () => {
            showImageViewer() 
            addImages()
        });
    })


}

function addImages() {
    console.log("calling add images")
    delayedAction(
        () => { 
            console.log("checking attatchemtns")
            return attatchments != null 
        },
        () => {
            let allAttachments = null
            delayedAction(() => {
                return attatchments.querySelectorAll(".attachment-thumbnail").length != 0
            },
                () => {
                    if (document.querySelector(".js-show-more-attachments").classList.contains("hide")){
                        handleImages()
                    }

                    else {
                        delayedAction(() =>{
                            document.querySelector(".js-view-all-attachments").click()
                            return attatchments.querySelectorAll(".attachment-thumbnail").length > 4 
                        }, ()=>{
                            handleImages()
                            document.querySelector(".js-view-some-attachments").click()
                        })
                    }

                })
        })
        //TODO: Return a promise, so we can show the viewer only when the images have been loaded. 
}

function handleImages(){
    console.log("handeling images")
    allAttachments = attatchments.querySelectorAll(".attachment-thumbnail")
    document.querySelector(".trello-image-container").textContent = ''
    for (attachment of allAttachments) {
        console.log("adding an image");
        let source = attachment.querySelector("a").getAttribute("href")
        let newImage = document.createElement("IMG")
        newImage.setAttribute("class", "trello-image")
        newImage.setAttribute("src", source)
        
        let addedImage = document.querySelector(".trello-image-container").appendChild(newImage)
        scaleImage(addedImage, source)
        addedImage.addEventListener("click", ()=>{
            if (addedImage.classList.contains("multi-image-focus")){
                    addedImage.classList.remove("multi-image-focus")
            }
            else{
                //TODO; this will also remove the css from the elements that have to be wide. But it is also a bad soultion right now.
                addedImage.classList.add("multi-image-focus")
            }
        })
    }
}

function scaleImage(addedImageElement, source){
    addedImageElement.onload = ()=> {
        let image = new Image()
        image.src = source

        if( image.width >= image.height){
            addedImageElement.classList.add("multi-image-focus")
        }
        image = null
    }
}

function showImageViewer() {
    document.querySelector(".trello-image-underlay").style.display = "block"
    document.querySelector(".trello-image-container").style.display = "flex"
}

function AddListenerToTasks() {
    delayedAction(() => {
        return document.querySelector(".list-card") != null
    }, () => {
        let allTasks = document.querySelectorAll(".list-card")
        for (singleTask of allTasks) {
            singleTask.addEventListener("click", main)
        }
    }, 10000)
}

function delayedAction(condition, action, waitTime = delayedActionTimeout) {
    breakCondition = false
    var actionTimeout = setTimeout(() => {
        breakCondition = true
    }, waitTime)

    var readyStateCheckInterval = setInterval(function () {
        if (condition()) {
            clearInterval(readyStateCheckInterval)
            clearTimeout(actionTimeout)
            action();
        }
        else if (breakCondition == true) {
            console.error("condition not met - timer ran out, this could be a missing element" + condition)
            clearInterval(readyStateCheckInterval);
        }
    }, 10);
}

function setUpKeys(){
    document.addEventListener('keypress', (e) => {
        console.log("there was a keypress")
        switch(e.keyCode){
            case "Escape":
                console.log("escape was pressed")
                hideMultiImageViewer()
                break;

            case "ArrowLeft":
                //TODO: Focus on previous image
                break;
                
            case "ArrowRight":
                //TODO: Focus on next image
                break;
                
            default:
                break;
        }
    })
}

delayedAction(
    () => { return document.readyState === "complete" },
    () => {
        AddListenerToTasks()
        main()
        setUpKeys()
    }, 20000
)



