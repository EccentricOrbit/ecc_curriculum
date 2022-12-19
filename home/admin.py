from django.db import models
from django.contrib import admin

from martor.widgets import AdminMartorWidget
from martor.models import MartorField

from treebeard.admin import TreeAdmin
from treebeard.forms import movenodeform_factory

from home.models import PostMeta, Post, PlaylistNode


class PostMetaAdminInline(admin.TabularInline):
    model = PostMeta

class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "id"]

class PlaylistNodeAdmin(TreeAdmin):
    #formfield_overrides = { models.TextField: {'widget': AdminMartorWidget} }
    form = movenodeform_factory(PlaylistNode)

admin.site.register(Post, PostAdmin)
admin.site.register(PlaylistNode, PlaylistNodeAdmin)
