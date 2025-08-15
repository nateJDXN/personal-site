---
layout: default
title: posts
# pagination:
#     enabled: true
#     per_page: 10
---

<div>
    <div class="categories">
        <a href="/posts/" class="category-link {% unless page.category %}active{% endunless %}">
            all
        </a>
        {% for category in site.categories %}
            <a href="/posts/?category={{ category | first | downcase }}" class="category-link">
                {{ category | first }}
            </a>
        {% endfor %}
    </div>
    <div id="posts-container">
        {% assign filtered_posts = site.posts %}
        {% if page.category %}
            {% assign filtered_posts = site.categories[page.category] %}
        {% endif %}
        
        {% for post in filtered_posts %}
            <span class="post-item" data-category="{{ post.categories | join: ',' | downcase }}">
                <span class="mobile-hide"> {{ post.date | date: '%Y-%m-%d' }} >> </span>
                <a href="{{ post.url }}">{{ post.title }}</a>
                <span class="float-right mobile-hide">{{ post.categories }}</span>
            </span>
        {% endfor %}
    </div>
    <div class="post-nav">
        {% if paginator.total_pages > 1 %}
            {% if paginator.previous_page %}
                <a href="{{ paginator.previous_page_path | prepend: site.baseurl }}">&lt;- Newer</a>
            {% endif %}
            {% if paginator.next_page %}
                <a href="{{ paginator.next_page_path | prepend: site.baseurl }}">Older -&gt;</a>
            {% endif %}
        {% endif %}
    </div>
</div>

<script>
// Client-side filtering based on URL parameters
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');
    const posts = document.querySelectorAll('.post-item');
    const categoryLinks = document.querySelectorAll('.category-link');
    
    // Remove active class from all links
    categoryLinks.forEach(link => link.classList.remove('active'));
    
    if (categoryFilter) {
        // Hide all posts first
        posts.forEach(post => post.style.display = 'none');
        
        // Show only posts from the selected category
        posts.forEach(post => {
            const postCategories = post.dataset.category.split(',');
            if (postCategories.includes(categoryFilter)) {
                post.style.display = 'block';
            }
        });
        
        // Add active class to current category link
        const activeLink = document.querySelector(`a[href="/posts/?category=${categoryFilter}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Update page title
        document.title = `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} - Posts`;
    } else {
        // Show all posts
        posts.forEach(post => post.style.display = 'block');
        
        // Add active class to "all" link
        const allLink = document.querySelector('a[href="/posts/"]');
        if (allLink) {
            allLink.classList.add('active');
        }
    }
});
</script>

<!-- <style>
.category-link {
    margin-right: 10px;
    padding: 5px 10px;
    background: #f0f0f0;
    text-decoration: none;
    border-radius: 3px;
    display: inline-block;
    margin-bottom: 5px;
}

.category-link:hover {
    background: #e0e0e0;
}

.category-link.active {
    background: #007acc;
    color: white;
}

.post-item {
    display: block;
    margin-bottom: 10px;
    padding: 5px 0;
    border-bottom: 1px solid #eee;
}
</style> -->