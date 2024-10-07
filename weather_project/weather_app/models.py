from django.db import models
from django.contrib.auth.models import AbstractUser

class WUser(AbstractUser):

    pass

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

    
   