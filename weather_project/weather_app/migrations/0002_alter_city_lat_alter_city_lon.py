# Generated by Django 5.0.4 on 2024-09-27 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('weather_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='city',
            name='lat',
            field=models.DecimalField(decimal_places=7, default=0, max_digits=9),
        ),
        migrations.AlterField(
            model_name='city',
            name='lon',
            field=models.DecimalField(decimal_places=7, default=0, max_digits=9),
        ),
    ]
