---
layout: layouts/base.njk
title: TunePad Tutorials and Covers
subtitle: Recreate popular music with step-by-step tutorials
splash: /images/tutorials-splash.jpg
showtoc: true
---

{%- for item in toc.contents %}
    {%- if item.collection == "tutorials" %}
        {%- for subitem  in item.contents %}
* [{{ subitem.title}}]({{subitem.url}})
        {%- endfor %}
    {%- endif %}
{%- endfor %}

