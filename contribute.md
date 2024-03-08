---
layout: layouts/minimal.njk
title: Contribute to Learn TunePad
description: This page provides information on how to contribute lessons, activities, videos, tutorials, covers, and more to https://learn.tunepad.com
---

# How to submit your original TunePad project
1. Open your project in TunePad
2. Click on the **Share** button and select **Sharing & Collaboration**
3. Add project artwork by clicking on the image button (please avoid copyrighted images)
4. Click on the **Preview** button to generate an audio preview of your project
5. Add a short description of your project along with your Author information
6. Finally, make sure your project is set to **View Only**

When you're done, [send us](mailto:support@tunepad.com) us your project URL with the Subject **TunePad original submission**.

**Note** if you're creating a cover or remix of an existing song, please also include this disclaimer in your project description:
<pre style="margin: 1rem; background-color: #e3e9f2; font-size: 13px; padding: 1rem; line-height: 150%;">
This project is based on <mark>TITLE</mark> by <mark>ARTISTS</mark> (<mark>YEAR</mark>), <mark>record label</mark>. For educational purposes only.
</pre>

# How to contribute a TunePad Tutorial

We welcome your contributions!   
Please feel free to [email us](mailto:support@tunepad.com) for more information on publishing your lessons, activities, videos, covers, and original music on [learn.tunepad.com](https://learn.tunepad.com).   

If you’re feeling adventurous, you can also contribute directly to our open source repository by following the instructions below.

## Step 1: Clone the GitHub repository
* Visit our [github repo](https://github.com/EccentricOrbit/ecc_curriculum) and make a clone of the main branch.
* Create a [new branch](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging) for your local changes.

## Step 2: Install 11ty
We use a static site generator called [11ty](https://www.11ty.dev/) to publish our learning resources. To install 11ty:
```sh
cd <my-project-directory>
npm install @11ty/eleventy --save-dev
npm install @11ty/eleventy-plugin-syntaxhighlight --save-dev
npm install --save-dev pagefind
```
<br>

## Step 3: Run the development server
```sh
npx @11ty/eleventy --serve
```
<br>

Test your setup by opening [http://localhost:8080/](http://localhost:8080/) in a web browser. You should see the landing page.

## Step 4: Create your tutorial page
* Make a copy of the file `tutorials/stranger-things.md` and save it in the `tutorials` folder
* Let's say you called your new file `tutorials/`<mark>`my-tutorial.md`</mark>
* Edit the [frontmatter](https://www.11ty.dev/docs/data-frontmatter/) of your new file to change the highlighted fields below.

<pre style="margin: 1rem; background-color: #e3e9f2; font-size: 13px; padding: 1rem; line-height: 150%;">
---
layout: layouts/activity.njk
tags: tutorials
category: Tutorial
title: <mark>"My Tutorial Title"</mark>
subtitle: <mark>Artist's name</mark>
description: <mark>Description of my tutorial and what people will learn</mark>
authors: by <mark>My name and optional contact info</mark>
level: <mark>Beginner, Intermediate, or Expert</mark>
time: <mark>Best estimate for the time it will take to do the tutorial in minutes</mark>
license: by-nc-sa
splash: /images/splash/<mark>my-tutorial-splash</mark>.png
video: <mark>optional link to external walkthrough video (e.g. YouTube link)</mark>
slides: <mark>optional link to external slides (e.g. Google Slides)</mark>
project: https://tunepad.com/project/<mark>project_id</mark>
audio: https://api.tunepad.com/api/projects/<mark>project_id</mark>/audio/
disclaimer: For educational purposes only. Based on <mark>song</mark> by <mark>artists</mark> (<mark>year</mark>), <mark>optional record label</mark>.
---
</pre>

## Step 5: Make your splash image
* Add a splash image with this filename `/assets/images/splash/`<mark>`my-tutorial`</mark>`-splash.png`
* Your image should be 600 x 400 pixels or 900 x 600 pixels
* Please be careful with copyrighted material to stay in public domain or fair use boundaries

## Step 6: See if your tutorial appears
* Navigate to http://localhost:8080/tutorials/
* You should see your tutorial appear at the end of the list
* Click on your tutorial to open it

## Step 7: Create your tutorial content
* Edit the `tutorials/`<mark>`my-tutorial.md`</mark> file with your tutorial content. 
* This file uses [markdown](https://www.markdownguide.org/basic-syntax/) formatting. 
* You can proofread your edits by navigating to http://localhost:8080/tutorials/<mark>my-tutorial</mark>/

## Step 8: Publish your TunePad project
Open your project in TunePad and click on **Share** -> **Sharing & Collaboration**
1. Add project artwork
2. Set your project to **View Only**
3. Add a short description
4. Make sure to click on the **Preview** button to generate an audio preview of your project


## Step 9: Commit and Pull Request
* When you're happy with your content make sure to commit your changes to your github development branch
* Create a pull request to merge your content into the `staging-master` branch
* We'll follow up to confirm that we received the request and keep you updated on the review and publishing process
