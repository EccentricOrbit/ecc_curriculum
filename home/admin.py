from django.db import models
from django.contrib import admin

from martor.widgets import AdminMartorWidget
from martor.models import MartorField

from home.models import PostMeta, Post


class PostMetaAdminInline(admin.TabularInline):
    model = PostMeta


class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "id"]

admin.site.register(Post, PostAdmin)
