const gallery = document.getElementById('gallery');
const fileInput = document.getElementById('fileInput');
let memories = [];

fileInput.addEventListener('change', function(e) {
    const files = e.target.files;
    
    if (files.length > 0) {
        // Remove empty state if it exists
        const emptyState = gallery.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        // Process each selected file
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    const imgSrc = event.target.result;
                    memories.push(imgSrc);
                    
                    // Create memory card
                    const card = document.createElement('div');
                    card.className = 'memory-card';
                    
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = 'Memory';
                    
                    card.appendChild(img);
                    gallery.appendChild(card);
                    
                    // Trigger animation
                    setTimeout(() => {
                        card.style.animation = 'fadeIn 0.6s ease';
                    }, 10);
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Reset file input
    fileInput.value = '';
});