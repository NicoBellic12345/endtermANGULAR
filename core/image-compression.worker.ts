/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { imageData, maxWidth, quality } = data;
  
  const img = new Image();
  img.onload = () => {
    const canvas = new OffscreenCanvas(maxWidth, maxWidth);
    const ctx = canvas.getContext('2d');
    
    const scale = maxWidth / Math.max(img.width, img.height);
    const width = img.width * scale;
    const height = img.height * scale;
    
    canvas.width = width;
    canvas.height = height;
    
    ctx!.drawImage(img, 0, 0, width, height);
    
    canvas.convertToBlob({ 
      type: 'image/jpeg', 
      quality: quality 
    }).then(blob => {
      postMessage({
        blob,
        width: Math.round(width),
        height: Math.round(height),
        originalSize: imageData.length,
        compressedSize: blob.size
      });
    });
  };
  
  img.onerror = (error) => {
    postMessage({ error: 'Ошибка загрузки изображения' });
  };
  
  img.src = imageData;
});