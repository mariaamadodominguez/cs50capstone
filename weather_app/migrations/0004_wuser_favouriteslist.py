# Generated by Django 5.1.2 on 2024-10-23 15:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('weather_app', '0003_alter_city_lat_alter_city_lon'),
    ]

    operations = [
        migrations.AddField(
            model_name='wuser',
            name='favouritesList',
            field=models.ManyToManyField(blank=True, related_name='userFavourite', to='weather_app.city'),
        ),
    ]
