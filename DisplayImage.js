
            let finalOutput = document.querySelector(".finalOutput");
            let download = document.querySelector("#download");
            // Retrived the processed image from the session storage
            let processedImageURL = sessionStorage.getItem("processedImageURL");
            if(processedImageURL){
              // Create an image element and set its source to process image url
                const ResultPhoto = document.createElement("img");
                ResultPhoto.src = processedImageURL;
                ResultPhoto.style.maxWidth = "100%";
                ResultPhoto.style.maxHeight = "100%";
                ResultPhoto.style.objectFit = "cover";
                finalOutput.innerHTML = "";
                finalOutput.appendChild(ResultPhoto);
            }
            else{
                alert("No image found please select the file.")
            }
            download.addEventListener("click", function(){
               if(processedImageURL){
                // creating the temporary link element to trigger the download.
                const link = document.createElement("a");
                link.href = processedImageURL;
                link.download = "ResultPhoto"; // file name of the image
                link.click(); // trigger the download.
               }
            })