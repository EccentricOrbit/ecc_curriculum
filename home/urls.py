from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import image_upload_view
from home.views import (
    home_redirect_view,
    simple_form_view,
    post_form_view,
    test_markdownify,
)

urlpatterns = [
    path("", home_redirect_view, name="home_redirect"),
    path("simple-form/", simple_form_view, name="simple_form"),
    path("post-form/", post_form_view, name="post_form"),
    path("test-markdownify/", test_markdownify, name="test_markdownify"),
    path('upload/', image_upload_view)
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)