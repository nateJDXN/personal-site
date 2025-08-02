---
layout: default
title: posts
pagination:
    enabled: true
    per_page: 10
---

<div>
    <div class=categories>
        {% for category in site.categories %}
            <a href="/category/{{category | first | downcase }}/" class=category-link>
            {{category | first}}</a>
        {% endfor %}
    </div>
    {% for post in paginator.posts %}
        <span class="post-item"><span class="mobile-hide"> {{ post.date | date: '%Y-%m-%d' }} >> </span><a href="{{ post.url }}">{{ post.title }}</a><span class="float-right mobile-hide">{{ post.categories }}</span></span>
    {% endfor %}
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
