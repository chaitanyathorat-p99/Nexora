import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';

const SignatureCanvas = () => {
  const sigPadRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  // Clear the signature pad
  const clearSignature = () => {
    sigPadRef.current.clear();
  };

  // Handle image upload from PC
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result); // Set the uploaded image as base64 URL
      };
      reader.readAsDataURL(file);
    }
  };
  const saveSignature = () => {
    if (sigPadRef.current.isEmpty()) {
      alert('Please provide a signature first.');
    } else {
      const dataURL = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
      console.log('Signature saved as: ', dataURL);
      // You can send the dataURL to your backend here or save it locally
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Signature</h2>
      <SignaturePad
        ref={sigPadRef}
        canvasProps={{ className: 'border border-gray-300 rounded-md mb-4 w-96 h-48' }}
      />

      <div className="flex space-x-4 mb-4">
        <button
        type='button'
          onClick={clearSignature}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear Signature
        </button>
        <button
        type='button'
          onClick={saveSignature}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Show Signature
        </button>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {/* Upload Signature Image from PC */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border rounded p-2"
        />
        
        {uploadedImage && (
          <div>
            <p className="text-sm text-gray-600">Uploaded Signature:</p>
            <img src={uploadedImage} alt="Uploaded Signature" className="border border-gray-300 rounded-md w-96 h-48" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureCanvas;
