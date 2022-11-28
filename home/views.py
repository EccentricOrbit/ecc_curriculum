from django.conf import settings
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from .forms import ImageForm
from home.forms import SimpleForm, PostForm
from home.models import Post


def home_redirect_view(request):
    return redirect("simple_form")


def simple_form_view(request):
    form = SimpleForm()
    context = {"form": form, "title": "Simple Form"}
    theme = getattr(settings, "MARTOR_THEME", "bootstrap")
    return render(request, "form.html", context)


@login_required
def post_form_view(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.description = request.POST['description']
            post.save()
            messages.success(request, "%s successfully saved." % post.title)
            return redirect("test_markdownify")
    else:
        form = PostForm()
        context = {"form": form, "title": "Post Form"}
    theme = getattr(settings, "MARTOR_THEME", "bootstrap")
    return render(request, "form.html", context)


def test_markdownify(request):
    post = Post.objects.last()
    context = {"post": post}
    if post is None:
        context = {
            "post": {
                "title": "Fake Post",
                "description": """It **working**! :heart: [Python Learning](https://python.web.id)""",
            }
        }
    theme = getattr(settings, "MARTOR_THEME", "bootstrap")
    return render(request, "test_markdownify.html", context)


def image_upload_view(request):
    """Process images uploaded by users"""
    if request.method == 'POST':
        form = ImageForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            # Get the current instance object to display in the template
            img_obj = form.instance
            return render(request, 'index.html', {'form': form, 'img_obj': img_obj})
    else:
        form = ImageForm()
    return render(request, 'index.html', {'form': form})
