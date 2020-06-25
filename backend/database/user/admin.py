"""denne filen styrer hvordan enkelte modeller skal vises på adminsiden"""
from django.contrib import admin

from .models import Kalas, names, Borst

# Register your models here.

admin.site.site_header = "Kalas Admin"
admin.site.site_title = "Kalas Admin"


class nameInLine(admin.TabularInline):
    model = names
    extra = 2


class userAdmin(admin.ModelAdmin):
    fieldset = [(None, {'fields': ['userID']}), ('date', {
        'fields': ['time'], 'classes': ['collapse']}), ]
    inlines = [nameInLine]


# admin.site.register(user)
# admin.site.register(names)

admin.site.register(Kalas, userAdmin)
admin.site.register(Borst)
