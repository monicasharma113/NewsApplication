const API_KEY = '356b0f237b374144bb7d369b8b357ade';
const newsContainer = document.getElementById('newsContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const contactForm = document.getElementById('contactForm');

let currentCategory = 'general';

// Fetch news based on category
async function fetchNews(category = 'general', query = '') {
    try {
        const url = query
            ? `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`
            : `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'ok') {
            displayNews(data.articles);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        newsContainer.innerHTML = `
            <div class="error-message">
                <p>😕 Something went wrong. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

// Display news in the container
function displayNews(articles) {
    if (articles.length === 0) {
        newsContainer.innerHTML = '<p class="no-results">No news found. Try a different search.</p>';
        return;
    }

    newsContainer.innerHTML = articles.map(article => `
        <article class="news-card">
            <img 
                src="${article.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                alt="${article.title}"
                class="news-image"
                onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
            >
            <div class="news-content">
                <h3 class="news-title">${article.title}</h3>
                <p class="news-description">${article.description || 'No description available'}</p>
                <div class="news-meta">
                    <span>${new Date(article.publishedAt).toLocaleDateString()}</span>
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read More</a>
                </div>
            </div>
        </article>
    `).join('');
}

// Event Listeners
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Fetch news for selected category
        currentCategory = btn.dataset.category;
        fetchNews(currentCategory);
    });
});

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchNews(currentCategory, query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            fetchNews(currentCategory, query);
        }
    }
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    // Here you would typically send the form data to a server
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
});

// Initialize with general news
fetchNews();
