from django.db import models
from django.contrib.auth import get_user_model
from martor.models import MartorField
from treebeard.al_tree import AL_Node

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


# This is the treebeard hierarchy. Uses adjacency list algorithm.
class PlaylistNode(AL_Node):
    parent = models.ForeignKey('self',
                               related_name='children_set',
                               on_delete=models.CASCADE,
                               default=None,
                               blank=True,
                               null=True,
                               db_index=True)
    node_order_by = ['ordering', 'title']
    ordering = models.IntegerField()
    title = models.CharField(max_length=255)
    slug = models.SlugField(null=False, unique=True)

    # tunepad project_id to display an embedded project
    project_id = models.IntegerField(null=True, blank=True, default=None, verbose_name = 'TunePad Project ID')

    # URL to display external content (e.g. Google doc)
    url = models.URLField(max_length=512, default=None, blank=True, null=True, verbose_name = 'External URL')

    # markdown text to display markdown
    text = models.TextField(verbose_name = 'Markdown Text', default=None, blank=True, null=True)
    # MartorField?

    def __str__(self):
        return "{} ({})".format(self.title, self.id)

    def get_absolute_url(self):
        return reverse("content", kwargs={"slug": self.slug})
