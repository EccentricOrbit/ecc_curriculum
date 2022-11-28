from django.db import models
from django.contrib.auth import get_user_model
from martor.models import MartorField

User = get_user_model()


class Post(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    title = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.title


class PostMeta(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    text = MartorField()

    def __str__(self):
        return self.text


class Image(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='images')

    def __str__(self):
        return self.title