//This is an Instant PDF Reader web application built using HTML, CSS, and JavaScript. It allows users to upload PDF files and view them instantly within the browser.

//### Uses:
//- Viewing PDF files instantly within the browser without the need for additional software.
//- Providing a user-friendly interface for reading PDF documents.

//### Features:
//- Upload PDF files using a file input element.
//- Dynamically render PDF pages onto the canvas element.
//- Adjust the scale of the PDF pages based on the viewport size.
//- Support for handling window resize events to update the scale accordingly.

 const pdfContainer = document.getElementById('pdfContainer');
  const fileInput = document.getElementById('fileInput');

  // Function to handle PDF file upload
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      const typedarray = new Uint8Array(e.target.result);
      renderPDF(typedarray);
    };
    reader.readAsArrayBuffer(file);
  });

  // Function to render PDF
  function renderPDF(data) {
    pdfContainer.innerHTML = ''; // Clear previous content
    pdfjsLib.getDocument(data).promise.then(function(pdf) {
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        pdf.getPage(pageNum).then(function(page) {
          const scale = calculateScale(page);
          const viewport = page.getViewport({ scale: scale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };

          page.render(renderContext).promise.then(function() {
            pdfContainer.appendChild(canvas);
          });
        });
      }
    });
  }

  // Function to calculate scale based on viewport size
  function calculateScale(page) {
    const viewport = page.getViewport({ scale: 1 });
    const widthScale = window.innerWidth / viewport.width;
    const heightScale = window.innerHeight / viewport.height;
    return Math.min(widthScale, heightScale);
  }

  // Handle window resize event to update the scale
  window.addEventListener('resize', function() {
    const canvasElements = document.querySelectorAll('canvas');
    canvasElements.forEach(function(canvas) {
      const pageIndex = parseInt(canvas.getAttribute('data-page'), 10);
      pdfjsLib.getDocument(data).promise.then(function(pdf) {
        pdf.getPage(pageIndex).then(function(page) {
          const scale = calculateScale(page);
          const viewport = page.getViewport({ scale: scale });
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          const renderContext = {
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
          };
          page.render(renderContext);
        });
      });
    });
  });