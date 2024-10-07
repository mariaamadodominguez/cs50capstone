from django.contrib import admin
from .models import WUser, City, Weather
class CityAdmin(admin.ModelAdmin):
    list_display = ("city", "country", "state")

# Register your models here.
admin.site.register(WUser)
admin.site.register(City, CityAdmin)
admin.site.register(Weather)
