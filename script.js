let uploadImage = document.querySelector(".image");
let button = document.querySelector("#chooseFile");
let displayResult = document.querySelector(".displayFileResult");
let CropButton = document.querySelector("#cropImage");
let resultCropImage = document.querySelector(".imagecrop");
let UploadCropImage = document.querySelector("#uploadCropImage");
let imageSrc , fileInput , cropper , croppedCanva , croppedCanvaURL;

button.addEventListener("click", function(){
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.name = 'mediaFile[]';
    fileInput.multiple = true;
    fileInput.accept = 'image/*';

    // trigger the file input
    fileInput.click();

    // handle the file input events
    fileInput.addEventListener('change',function(event){
        uploadImage.innerHTML = "";
        const file = event.target.files[0]; // get the selected files.
        if(!file){
            alert("you have not selected any file.")
            return;
        }
        const fileType = file.type;  // getting the file type
        if(fileType.startsWith('image/')){
            const img = document.createElement("img");// creating the img tag
            imageSrc = URL.createObjectURL(file);// object url stored in variable.
            img.src = imageSrc;
            img.style.maxWidth = '100%';
            img.style.maxHeight='100%';
            img.style.objectFit = 'cover';
            uploadImage.appendChild(img); //appending the img tag to image class in html.
// to find the actual size of the image we have to create the image object
            const image = new Image();
            image.src = img.src; //source of the image 
              
            image.onload = function(){//onload find the actual size of image
                const width = image.width;
                const height = image.height;
                console.log(`Height : ${height} Width : ${width}`);

                
            // finding the file size
            const fileSize = file.size;
            let MB = (fileSize/1048576).toFixed(2);
            console.log("you file size is" , MB , "MB")

            const ImageRatio = (width/height).toFixed(2);
            console.log("the Image Ratio is", ImageRatio);
            
                createTable([
                    ["Image Size: ", `${MB} MB`],
                    ["Image Type: ", `${fileType}`],
                    ["Image Height: ", `${height}px`],
                    ["Image width: ", `${width}px`],
                    ["Image Ratio:", `${ImageRatio}`]
                ]);
                // Initialize the cropper
                if (cropper) {
                    cropper.destroy(); // Destroy previous cropper
                }
                cropper = new Cropper(img, {
                    aspectRatio: 1, // 1:1 square form
                    viewPort: 1,
                    autoCropArea: 1,
                    scalable: false,
                    zoomable: false,
                    movable: true,
                });

            }
            image.onerror = function(){
                console.log("failed to load the image dimension:");
                
            }
            // creata a table with image details
         

        }else{
              alert("please select the image file");
            
        }
       
    })
})
// function to create and display the data 
function createTable(data){
    displayResult.innerHTML="";
    let table = document.createElement("table");
    table.border = 0;

    // loop for each rows and column
    data.forEach(rowData => {
        let tr = document.createElement("tr");
        
        rowData.forEach(cellData => {
            let td = document.createElement("td");
            td.textContent = cellData;
            td.style.borderBottom = "2px solid black";
            td.style.padding = "10px";
            td.style.marginLeft = "5px";
            tr.appendChild(td);
        })
        table.appendChild(tr);
    });
    displayResult.appendChild(table);

}
 // Crop button click to crop and display the image
 CropButton.addEventListener("click", function () {
     if (cropper) {
         const croppedCanvas = cropper.getCroppedCanvas({
             width: 600,
             height: 600
         });
         const croppedImage = document.createElement("img");
         croppedCanvaURL = croppedCanvas.toDataURL("image/");
         croppedImage.src = croppedCanvaURL;
         croppedImage.style.border = "2px solid black";
         croppedImage.style.maxHeight = "100%";
         croppedImage.style.maxWidth = "100%";
         croppedImage.style.objectFit = "cover";
         resultCropImage.innerHTML = ""; // Clear previous results if needed
         resultCropImage.appendChild(croppedImage);
     } else {
         alert("Please select and upload an image before cropping.");
     }
 });
 UploadCropImage.addEventListener("click" , function(){
    // sent the crop image to backend for modifying the image.
    
    fetch("http://127.0.0.1:5000/process-image", {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({image : croppedCanvaURL})
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`Server error: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // save the processed image URL to session storage.
      sessionStorage.setItem("processedImageURL" , data.processed_image);
    //   Redirect the display page.
    window.location.href = "displayfinalphoto.html";

    })
    .catch(error => console.error("Error:" , error))
    alert("The image is processing please wait for the few second.")
 })
