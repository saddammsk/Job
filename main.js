const form = document.querySelector('.form-area'),
    input = document.querySelector('.file-input'),
    Dropfile = document.querySelector('.drop-file'),
progressArea = document.querySelector('.progress-area');

let file;

// Button Listener
form.addEventListener('click', () => {
    input.click();
});

input.addEventListener('change', ({target}) => {
    file = target.files[0];
    if (file) {
        let fileName = file.name;
        if (fileName.length >= 12) { //if file name length is greater than 12 then split it and add ...
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 13) + "..." + splitName[1];
           }
        ajax_file_upload(target.files);
        form.classList.add("active");
        form.style.backgroundColor = "rgba(0, 0, 0, 0.02)";
    }

});



// Drag and drop listener
//If user Drag File Over form
form.addEventListener("dragover", (event) => {
    event.preventDefault();
    form.classList.add("active");
    form.style.backgroundColor = "rgba(0, 0, 0, 0.02)";
});

//If user leave dragged File from form
form.addEventListener("dragleave", () => {
    form.classList.remove("active");
    form.style.backgroundColor = "#ffffff";

});

//If user drop File on form
form.addEventListener("drop", (e) => {
    e.preventDefault();
    ajax_file_upload(e.dataTransfer.files);

});


function ajax_file_upload(name) {
    if (name != undefined) {
        var form_data = new FormData();
        let fileName = name[0];
        form_data.append('file[]', fileName);

        // For more files upload uncomment below lines only
        // for (i = 0; i < name.length; i++) {
        //     form_data.append('file[]', name[i]);
        // }
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "php/data.php", true);
        xhttp.upload.addEventListener("progress", ({loaded, total}) => { //file uploading progress event
            let fileLoaded = Math.floor((loaded / total) * 100); //getting percentage of loaded file size
            let fileTotal = Math.floor(total / 1000); //gettting total file size in KB from bytes
            let fileSize;
            // if file size is less than 1024 then add only KB else convert this KB into MB
            (fileTotal < 1024) ? fileSize = fileTotal + " KB": fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB";
            let progressHTML = `<div class="progress-area"">
                                <div class="progress-bar" style="width:${fileLoaded}%;"></div>
                                </div>`;
            progressArea.style.display = "block";
            progressArea.innerHTML = progressHTML;
            if (fileLoaded == 100) {
                Dropfile.innerHTML = "<strong>" + name[0].name + "</strong>";
                progressArea.style.display = "none";
            }
        });
        xhttp.onload = () => {
            if (!xhttp.status == 200) {
                alert("Error " + xhttp.status);
            }
        }

        xhttp.send(form_data);
    }
    
}