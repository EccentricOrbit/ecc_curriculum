---
layout: layouts/base.njk
title: Learn TunePad
subtitle: Tutorials, documentation and curriculum for TunePad
splash: /images/learn-splash.png
showtoc: true
---

TunePad learning resources are designed to help you get started making music with Python code.

<img src="/images/quickstart.svg" style="float: right" width="200">

# Learning Resources
{%- for item in toc.contents %}
## [{{ item.title }}]({{ item.url }})
    {%- if item.contents %}
        {%- for subitem in item.contents %}
* [{{ subitem.title}}]({{subitem.url}})
        {%- endfor %}
    {%- endif %}
{%- endfor %}

