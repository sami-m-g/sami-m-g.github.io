---
layout: default
title: My Story
permalink: /story/
description: A look at my path across engineering, design, and product.
---

<section class="section-card story-hero">
  <div class="story-hero__grid">
    <div class="story-hero__copy">
      <h1>My story</h1>
      <div class="story-card">
        <div class="story-body">
          {{ site.story | newline_to_br | newline_to_br }}
        </div>
      </div>
    </div>
  </div>
</section>
