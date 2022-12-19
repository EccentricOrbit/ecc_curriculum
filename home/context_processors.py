from django.conf import settings # import the settings file

# values to add to all template contexts
def deploy_values(request):
    home = settings.TUNEPAD_PROTOCOL + '://' + settings.TUNEPAD_DOMAIN
    learn = settings.TUNEPAD_PROTOCOL + '://learn.' + settings.TUNEPAD_DOMAIN
    community = settings.TUNEPAD_PROTOCOL + '://community.' + settings.TUNEPAD_DOMAIN
    return {
        'TUNEPAD_HOME' : home,
        'TUNEPAD_LEARN' : learn,
        'TUNEPAD_COMMUNITY' : community,
    }
