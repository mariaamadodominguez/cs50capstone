from django.db import models
from django.contrib.auth.models import AbstractUser


class Weather(models.Model):
    city = models.CharField(max_length=100)
    temperature = models.FloatField(default=0)
    description = models.CharField(blank=True, max_length=255),

class City(models.Model):
    city = models.CharField(max_length=100)
    lat = models.DecimalField(max_digits=10, decimal_places=7, default=0)
    lon = models.DecimalField(max_digits=10, decimal_places=7, default=0)
    country= models.CharField(max_length=2, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zipcode = models.CharField(max_length=5, blank=True)    
    def __str__(self) -> str:
        return f"{self.city}"   

class WUser(AbstractUser):
    favouritesList = models.ManyToManyField(City, blank=True, related_name="userFavourite")         
    def serialize(self):
        return {
            "user": {self.user.username},
            "favouritesList": [city.city for city in self.favouritesList.all()],
        }
    @property
    def FavouritesList_count(self):
        return self.favouritesList.count()    
   