from django import forms
from .models import Image

from martor.fields import MartorFormField
from home.models import Post


class SimpleForm(forms.Form):
    title = forms.CharField(widget=forms.TextInput())
    description = MartorFormField()
    wiki = MartorFormField()


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = "__all__"


class ImageForm(forms.ModelForm):
    """Form for the image model"""
    class Meta:
        model = Image
        fields = ('title', 'image')