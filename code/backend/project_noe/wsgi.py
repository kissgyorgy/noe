"""
WSGI config for project_noe project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""
import os
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise
from .config import config

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project_noe.settings")

application = get_wsgi_application()
application = WhiteNoise(application, root=config.static.root)
application.add_files(config.static.root, prefix="static/")
