---
layout: /layouts/collection
tags: challenges
category: TunePad Challenge
title: "Team Live Coding"
description: "Live coding is a new form of musical performance where you write code in real-time to create multi-layered compositions for a live audience. Live coding can also feature vocals, rap, instruments, dance, and computer-generated graphics and video."
splash: /images/splash/livecode-splash.png
---

# Live Coding Challenge

For this challenge, your team will perform a TunePad project for a live audience and a panel of judges. Your performance should be between 3 and 4 minutes long. Teams are allowed one device per person, but only one device will be connected to a speaker and projector for the performance. Teams can consist of 2-4 people.

## How do you live code a project?

This involves four steps:

1. **Before the competition:** Your team should create an original musical composition in TunePad. This can be your own invention, a cover of an existing song, or a creative reinterpretation or mashup of existing songs. Good songs for this challenge will combine lots of cells that can be layered into more complex compositions.

2. **For the live performance:** Your project should have some parts that are finished and ready to play and some parts that you will code during the competition. You should decide ahead of time what you will code live and what each team member will do during the performance. You will only earn **technical** points for the parts that you code live, but you can earn **musical** and **creative** points for all parts of your project, whether you code it live or not. Check out the scoring guide and getting started information below for strategies on preparing for the competition.

3. **Layer in performance elements:** Singing, rapping, dancing, musical instruments, or other performance elements to earn **performance** points. In general, your performance score will be determined by your stage presence, entertainment, and how well you engage the audience.

4. **Practice, practice, practice!** Work for a smooth, entertaining performance that dazzles the audience.

## How do I earn points?

Your performance will earn points for:
- Technical complexity (25%)
- Musicality (25%)
- Creativity (25%)
- Entertainment and audience engagement (25%)

## What do you mean by performance?

Check out some example videos of live coded performances by college students:

<iframe width="560" height="315" src="https://www.youtube.com/embed/9U_IefZwg78?si=rRnnI07OTCYXeVbz" title="YouTube video player" class="noprint" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/pIDOIghttmE?si=6elQCrx9HCTOhpbx" title="YouTube video player" class="noprint" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/wJZRxe9oKZQ?si=oAVYNMwu-PiRjXXY" title="YouTube video player" class="noprint" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

# Scoring Rubric

<style>
    table.rubric {
        max-width: 100%;
        border-collapse: collapse;
        margin: 2rem;
    }
    table.rubric th {
        background-color: black;
        color: white;
    }
    table.rubric td {
        border: 1px solid black;
    }
</style>

<table class="rubric">
<tr>
    <th>Category</th>
    <th>Description</th>
    <th>Points</th>
</tr>
<tr>
    <td><b>Creativity</b></td>
    <td>
        <ul>
            <li>Judges will use their discretion to award creativity points for elements that go beyond the standard example projectss. Surprize and delight the audience to max out this category.</li>
            
        </ul>
    </td>
    <td>40%</td>
</tr>
<tr>
    <td><b>Musical Quality</b></td>
    <td>
        <ul>
            <li>Cohesiveness and general musical appeal of the composition</li>
            <li>Use of rhythm, bass, melody, and harmony</li>
            <li>Engaging and dynamic arrangement that showcases the remixed elements</li>
        </ul>
    </td>
    <td>30%</td>
</tr>
<tr>
    <td><b>Technical Proficiency</b></td>
    <td>
        <ul>
            <li>Effective use of TunePad features and coding techniques</li>
            <li>Use of variables, loops, lists, and user-defined functions</li>
            <li>Advanced elements such as nested loops, conditional logic, user-defined functions with parameters, and definitions cells with shared code</li>
            <li>Code efficiency, readability, and organization</li>
        </ul>
    </td>
    <td>20%</td>
</tr>
<tr>
    <td><b>Performance Points</b></td>
    <td>
        <ul>
            <li>How smooth and practiced is the performance?</li>
            <li>How well does the team engage the audience?</li>
            <li>Does the performance involve extra elements (singing, rapping, dancing, instruments, etc)?</li>
            <li>How entertaining is the performance?</li>
        </ul>
    </td>
    <td>10%</td>
</tr>
</table>

# Practice Project

This pre-coded example project includes step-by-step instructions for how a team of two or three people can live code.

[Open Example Project](https://tunepad.com/project/58633)

# Getting Started

Here are a collection of activities and tutorials to help prepare your team.


<section class="highlights">
    <div class="vcards">
    {%- for demo in collections.livecoders -%}
        <div class="vcard" data-url="{{ demo.url }}">
            <div class="card-image">
                <img src="{{ demo.data.splash }}" alt="{{ demo.data.title }}">
            </div>
            <div class="card-info">
                <h1>{{ demo.data.title }}</h1>
                <div class="summary">{{ demo.data.description }}</div>
            </div>
            {% if demo.data.audio %}
            <button class="card-audio-button">
                <i class="fas fa-play"></i>
                <audio src="{{ demo.data.audio }}" class="audio-preview"></audio>
            </button>
            {% endif %}
            <div class="level-badge">{{ demo.data.level }}</div>
        </div>
    {%- endfor -%}
    </div>
</section>