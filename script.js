const gallery = document.getElementById('gallery');
const fileInput = document.getElementById('fileInput');
const modal = document.getElementById('modal');
const captionInput = document.getElementById('captionInput');
let memories = [];
let currentImage = null;
let pendingImages = [];

// Load saved memories when page loads
window.addEventListener('DOMContentLoaded', async function() {
    await loadMemories();
});

async function loadMemories() {
    try {
        // Get list of all memory keys
        const result = await window.storage.list('memory:');
        
        if (result && result.keys && result.keys.length > 0) {
            // Remove empty state
            const emptyState = gallery.querySelector('.empty-state');
            if (emptyState) {
                emptyState.remove();
            }
            
            // Load each memory
            for (const key of result.keys) {
                try {
                    const memoryResult = await window.storage.get(key);
                    if (memoryResult && memoryResult.value) {
                        const memory = JSON.parse(memoryResult.value);
                        memories.push(memory);
                        displayMemoryCard(memory);
                    }
                } catch (err) {
                    console.log('Memory not found:', key);
                }
            }
        }
    } catch (error) {
        console.log('No saved memories found');
    }
}

function displayMemoryCard(memory) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    
    const img = document.createElement('img');
    img.src = memory.image;
    img.alt = 'Memory';
    
    const captionDiv = document.createElement('div');
    captionDiv.className = 'memory-caption';
    captionDiv.textContent = memory.caption;
    
    card.appendChild(img);
    card.appendChild(captionDiv);
    gallery.appendChild(card);
    
    setTimeout(() => {
        card.style.animation = 'fadeIn 0.6s ease';
    }, 10);
}

fileInput.addEventListener('change', function(e) {
    const files = e.target.files;
    
    if (files.length > 0) {
        pendingImages = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (pendingImages.length > 0) {
            processNextImage();
        }
    }
    
    fileInput.value = '';
});

function processNextImage() {
    if (pendingImages.length === 0) {
        return;
    }
    
    const file = pendingImages[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
        currentImage = event.target.result;
        modal.style.display = 'block';
        captionInput.value = '';
        captionInput.focus();
    };
    
    reader.readAsDataURL(file);
}

async function saveMemory() {
    const caption = captionInput.value.trim();
    
    if (currentImage) {
        const emptyState = gallery.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        const memory = {
            image: currentImage,
            caption: caption || 'No caption',
            timestamp: Date.now()
        };
        
        // Save to persistent storage
        try {
            const memoryKey = `memory:${memory.timestamp}`;
            await window.storage.set(memoryKey, JSON.stringify(memory), true);
            console.log('Memory saved successfully!');
        } catch (error) {
            console.error('Error saving memory:', error);
        }
        
        memories.push(memory);
        displayMemoryCard(memory);
    }
    
    modal.style.display = 'none';
    currentImage = null;
    pendingImages.shift();
    
    if (pendingImages.length > 0) {
        setTimeout(processNextImage, 300);
    }
}

function cancelUpload() {
    modal.style.display = 'none';
    currentImage = null;
    pendingImages = [];
}

captionInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        saveMemory();
    }
});

window.addEventListener('click', function(e) {
    if (e.target === modal) {
        cancelUpload();
    }
});
